import mustache from "mustache";
import {
  FunctionDefinitionImage,
  FunctionDefinitionHandler
} from "serverless/index";
import { Binary, CargoToml, Dependency, EventType, Template } from "./types";
import { defaultDeps, resolveDepenencies } from "./deps";
import { lambda } from "./templates/lambda";
import { sns } from "./templates/sns";
import { sqs } from "./templates/sqs";
import { kinesis } from "./templates/kinesis";
import { dynamodb } from "./templates/dynamodb";
import { http } from "./templates/http";
import * as io from "./io";
import { snakeCase } from "snake-case";
import { eventBridge } from "./templates/eventBridge";

type Functions = {
  [key: string]: FunctionDefinitionHandler | FunctionDefinitionImage;
};

export interface Config {
  name: string;
  libs?: string[];
  handlerDir: string;
}

export const parseConfig = (name: string, config: any): Config => {
  let libs = config.libs ?? undefined;
  let handlerDir = config.handlerPath ?? "bin";
  return { libs, handlerDir, name } as Config;
};

export const generate = (config: Config, functions: Functions) => {
  const templates = generateTemplates(config, functions);

  const dependencies = resolveDepenencies(
    defaultDeps,
    templates.map((t: any) => t.eventType)
  );

  const cargoToml = generateCargoToml(
    io.getExistingCargoToml(),
    config,
    templates.map((n: any) => n.name),
    dependencies
  );

  return { cargoToml, templates };
};

export const writeRebar = (
  config: Config,
  cargoToml: CargoToml,
  templates: Template[]
) => {
  io.writeSetup(config);
  io.writeCargoToml(cargoToml);
  io.writeTemplates(config, templates);
};

const binPath = (dir: string, bin: string) => `src/${dir}/${bin}.rs`

const generateCargoToml = (
  existingCargoToml: CargoToml,
  config: Config,
  newBins: string[],
  deps: Dependency[]
) => {
  const existingBins: Binary[] = existingCargoToml.bin || [];

  const sourceBins = newBins.map((n: string) => ({
    name: n,
    path: binPath(config.handlerDir, n)
  }));
  const nonExistingBins = getNonExistingBinaries(existingBins, sourceBins);

  existingCargoToml.package = {
    name: config.name,
    version: "0.1.0",
    edition: "2021",
    ...existingCargoToml.package
  };

  !!existingCargoToml.bin
    ? nonExistingBins.forEach(b => existingCargoToml.bin.push(b))
    : (existingCargoToml.bin = nonExistingBins);

  existingCargoToml.dependencies = {
    ...deps.reduce(
      (acc: any, dep: Dependency) => ({
        ...acc,
        [dep.package]: !dep.features
          ? dep.version
          : { version: dep.version, features: dep.features }
      }),
      {}
    ),
    ...existingCargoToml.dependencies
  };

  return existingCargoToml;
};

const getNonExistingBinaries = (existing: Binary[], bins: Binary[]): Binary[] =>
  bins.filter(
    (bin: Binary) =>
      !existing.find((existing: Binary) => bin.name == existing.name)
  );

const getTemplate = (eventType: EventType) => {
  switch (eventType) {
    case "invoke":
      return lambda;
    case "sns":
      return sns;
    case "sqs":
      return sqs;
    case "dynamodb":
      return dynamodb;
    case "kinesis":
      return kinesis;
    case "http":
      return http;
    case "eventBridge":
      return eventBridge;
  }
  throw new Error("Unrecognised template:" + eventType);
};

export const generateTemplates = (config: Config, functions: Functions): Template[] => {
  return Object.getOwnPropertyNames(functions)
    .map(name => {
      const fn = functions[name];
      const eventType = getEventType(fn);
      if(!eventType)
        return null
      return { name: snakeCase(name), eventType };
    })
    .filter(x => !!x)
    .map(record => ({
      name: record.name,
      eventType: record.eventType,
      path: binPath(config.handlerDir, record.name),
      file: mustache.render(getTemplate(record.eventType), {
        name: record.name
      })
    }));
};

const getEventType = (
  fn: FunctionDefinitionHandler | FunctionDefinitionImage
): EventType => {
  if (!fn.events || fn.events.length == 0) return "invoke";

  const eventName = Object.getOwnPropertyNames(fn.events[0])[0];

  switch (eventName) {
    case "sqs":
    case "sns":
    case "http":
    case "eventBridge":
      return eventName;
    case "stream":
      const type = fn.events[0][eventName].type;
      switch (type) {
        case "dynamodb":
        case "kinesis":
          return type;
      }
  }
  return null
};
