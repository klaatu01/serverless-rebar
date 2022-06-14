import Serverless from "serverless";

import { parseConfig, generate, writeRebar } from "./rebar";

class RebarPlugin {
  serverless: Serverless;
  hooks: { [key: string]: Function };
  commands: any;
  options: any;
  log: any;

  constructor(serverless: Serverless, options: Serverless.Options, { log }) {
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
    this.log = log
  }

  generate = () => {
    const { service } = this.serverless;
    const { custom = {}, functions = {} } = service;
    const { rebar = {} } = custom;

    const rebarConfig = parseConfig(service.getServiceName(), rebar);
    const { cargoToml, templates } = generate(rebarConfig, functions);
    writeRebar(rebarConfig, cargoToml, templates);
    this.log.notice('Rebar Complete')
  };

  preview = () => {
    const { service } = this.serverless;
    const { custom = {}, functions = {} } = service;
    const { rebar = {} } = custom;

    const rebarConfig = parseConfig(service.getServiceName(), rebar);
    const { cargoToml, templates } = generate(rebarConfig, functions);
    this.log.notice('Rebar Preview:')
    console.table(
      templates.map(t => ({ name: t.name, eventType: t.eventType, path: t.path }))
    );
    this.log.notice("run 'serverless rebar generate' to start scaffolding.")
  };
}

module.exports = RebarPlugin;
