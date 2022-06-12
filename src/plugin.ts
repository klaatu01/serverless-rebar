import Serverless from "serverless"

import { parseConfig, generate, writeRebar } from "./rebar";

class RebarPlugin {
  serverless: Serverless;
  hooks: { [key: string]: Function }
  commands: any
  options: any

  constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      rebar: {
        lifecycleEvents: [
          "generate",
        ]
      }
    }
    this.hooks = {
      "rebar:generate": this.generate.bind(this)
    };
  }

  generate = () => {
    const { service } = this.serverless;
    const { custom = {}, functions = {} } = service;
    const { rebar = {} } = custom;

    const rebarConfig = parseConfig(service.getServiceName(), rebar);
    const { cargoToml, templates } = generate(rebarConfig, functions);
    writeRebar(rebarConfig, cargoToml, templates);
  }

}

module.exports = RebarPlugin;
