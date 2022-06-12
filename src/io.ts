import toml from "@iarna/toml";
import fs from "fs";
import { Config } from "./rebar";
import { CargoToml } from "./types";

export const getExistingCargoToml = () : CargoToml =>
  fs.existsSync("cargo.toml")
    ? (toml.parse(fs.readFileSync("cargo.toml", "utf8"))) as any as CargoToml
    : { package: {}, bin: null, dependencies: {}} as CargoToml;

export const writeTemplates = (config: Config, templates: any[]) =>
  templates.forEach(template => {
    if (!binaryExists(config.handlerDir, template.name)) {
      fs.writeFileSync(
        `src/${config.handlerDir}/${template.name}.rs`,
        template.file
      );
    }
  });

export const writeSetup = (config: Config) => {
  if (!fs.existsSync("./src")) fs.mkdirSync("src");
  fs.mkdirSync(`src/${config.handlerDir}`);
};

export const writeCargoToml = (cargoToml: any) =>
  fs.writeFileSync("cargo.toml", toml.stringify(cargoToml));

export const binaryExists = (path: string, name: string): boolean =>
  fs.existsSync(`./${path}/${name}.rs`);
