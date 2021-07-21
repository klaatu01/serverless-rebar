import Serverless from "serverless"

import { Config, Rebar } from "./rebar";

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

    const rebarConfig = Config.parse(rebar);
    const rebarGenerator = new Rebar(rebarConfig);

    rebarGenerator.generate(functions);
  }

}

module.exports = RebarPlugin;
