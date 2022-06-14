import Serverless from "serverless";

import { parseConfig, generate, writeRebar } from "./rebar";

class RebarPlugin {
  serverless: Serverless;
  hooks: { [key: string]: Function };
  commands: any;
  options: any;

  constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      rebar: {
        commands: {
          generate: {
            lifecycleEvents: ["generate"]
          },
          preview: {
            lifecycleEvents: ["preview"]
          }
        }
      }
    };
    this.hooks = {
      "rebar:generate:generate": this.generate.bind(this),
      "rebar:preview:preview": this.preview.bind(this)
    };
  }

  generate = () => {
    const { service } = this.serverless;
    const { custom = {}, functions = {} } = service;
    const { rebar = {} } = custom;

    const rebarConfig = parseConfig(service.getServiceName(), rebar);
    const { cargoToml, templates } = generate(rebarConfig, functions);
    writeRebar(rebarConfig, cargoToml, templates);
  };

  preview = () => {
    const { service } = this.serverless;
    const { custom = {}, functions = {} } = service;
    const { rebar = {} } = custom;

    const rebarConfig = parseConfig(service.getServiceName(), rebar);
    const { cargoToml, templates } = generate(rebarConfig, functions);
    console.table(
      templates.map(t => ({ name: t.name, eventType: t.eventType, path: t.path }))
    );
  };
}

module.exports = RebarPlugin;
