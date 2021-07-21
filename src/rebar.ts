import fs from "fs"
import mustache from "mustache"
import { cargoTomlTemplate, mainTemplate } from "./templates"
import toml from "@iarna/toml"
import { FunctionDefinitionImage, FunctionDefinitionHandler } from "serverless/index"
import { HttpPostTemplate, HttpGetTemplate, DynamoDBStreamTemplate, Template, InvokeTemplate, SqsTemplate, SnsTemplate } from "./types"

type Functions = { [key: string]: FunctionDefinitionHandler | FunctionDefinitionImage }

export class Config {
  public constructor(public libs?: string[]) { }

  public static parse(config: any) {
    let libs = config.libs ?? undefined;
    return new Config(libs);
  }
}

export class Rebar {
  public constructor(private config: Config) { }
  generate = (functions: Functions) => {
    this.generateWorkspaceCargoToml(functions);
    this.generateScaffolding(functions, this.config.libs);
  }

  generateWorkspaceCargoToml = (functions: Functions) => {
    const functionNames =
      Object.getOwnPropertyNames(functions)
    let rootCargoToml: {};
    if (fs.existsSync("cargo.toml")) {
      rootCargoToml = toml.parse(fs.readFileSync("cargo.toml", "utf8"));
      rootCargoToml["workspace"] = { members: functionNames }
    } else {
      rootCargoToml = { workspace: { members: functionNames } }
    }
    fs.writeFileSync("cargo.toml", toml.stringify(rootCargoToml))
  }

  generateScaffolding = (functions: Functions, libs: string[]) => {
    const functionNames =
      Object.getOwnPropertyNames(functions)
    functionNames
      .forEach(name => {
        let fn = functions[name];
        console.log(fn.events);
        if (!this.functionExists(name)) {
          let event = this.getEvent(fn);
          this.generateScaffoldingForFunction(name, event, libs)
        }
      });
  }


  getEvent = (fn: FunctionDefinitionHandler | FunctionDefinitionImage): Template => {
    let eventName = (!!fn.events && !!fn.events[0]) ? Object.getOwnPropertyNames(fn.events[0])[0] : null;
    if (!eventName)
      return new InvokeTemplate()

    let eventBody = fn.events[0][eventName];

    switch (eventName) {
      case "sqs":
        return new SqsTemplate()
      case "sns":
        return new SnsTemplate()
      case "http":
        return this.parseHttpType(eventBody.method.toLowerCase());
      case "stream":
        return this.parseStreamType(eventBody.type.toLowerCase());
      default: throw new Error("Unrecognised event name:" + eventName);
    }

  }

  parseHttpType = (method: string) => {
    switch (method) {
      case "post":
        return new HttpPostTemplate()
      case "get":
        return new HttpGetTemplate()
      default: throw new Error("Unsupported http method: " + method);
    }
  }

  parseStreamType = (streamType: string) => {
    switch (streamType) {
      case "dynamodb":
        return new DynamoDBStreamTemplate()
      case "kinesis":
      default: throw new Error("Unsupported stream type: " + streamType);
    }
  }


  generateScaffoldingForFunction = (name: string, event: Template, libs: string[]) => {
    let args = { name, libs, [event.getName()]: true, isHttp: event.isHttp(), isStream: event.isStream() };
    //Create function folder
    fs.mkdirSync(name);

    //Generate cargo.toml
    const cargoRender = mustache.render(cargoTomlTemplate, args);
    fs.writeFileSync(name + "/cargo.toml", cargoRender);

    const src = `${name}/src`;
    fs.mkdirSync(src);

    //Generate main.rs
    const mainRender = mustache.render(mainTemplate, args);
    fs.writeFileSync(src + "/main.rs", mainRender);
  }

  functionExists = (name: string): boolean => {
    if (fs.existsSync(`./${name}`)) {
      if (fs.existsSync(`./${name}/cargo.toml`)) {
        return true
      }
    }
    return false;
  }
}


