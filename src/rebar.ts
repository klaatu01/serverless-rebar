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
import { dynamodbStream } from "./templates/dynamodbStream";
import { httpGet } from "./templates/http";
import * as io from "./io";
import { snakeCase } from "snake-case";

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
  const templates = generateTemplates(functions);

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

export const writeRebar = (config: Config, cargoToml: CargoToml, templates: any) => {
  io.writeSetup(config);
  io.writeCargoToml(cargoToml);
  io.writeTemplates(config, templates);
};

const generateCargoToml = (
  existingCargoToml: CargoToml,
  config: Config,
  newBins: string[],
  deps: Dependency[]
) => {
  const existingBins: Binary[] = existingCargoToml.bin || [];

  const sourceBins = newBins.map((n: string) => ({
    name: n,
    path: `src/${config.handlerDir}/${n}.rs`
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
    : existingCargoToml.bin = nonExistingBins;

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
    case "stream":
      return dynamodbStream;
    case "http":
      return httpGet;
  }
};

const generateTemplates = (functions: Functions): Template[] => {
  return Object.getOwnPropertyNames(functions)
    .map(name => {
      const fn = functions[name];
      const eventType = getEventType(fn);
      return { name: snakeCase(name), eventType };
    })
    .map(record => ({
      name: record.name,
      eventType: record.eventType,
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
    case "stream":
      return eventName;
  }
  throw new Error("Unrecognised event name:" + eventName);
};
