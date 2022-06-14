import { Config, generateTemplates } from "../src/rebar";

import {
  directInvokeFunction,
  httpFunction,
  snsFunction,
  sqsFunction,
  dynamodbFunction,
  kinesisFunction,
  eventBridgeFunction
} from "./helpers";

const config: Config = {
  name: "test",
  handlerDir: "bin"
}

describe("Templates", () => {
  it("Should generate invoke template", () => {
    const functions = {
      directInvokeFunction
    };

    const [template] = generateTemplates(config, functions as any);

    expect(template).toBeTruthy();
    expect(template).toEqual(
      expect.objectContaining({
        name: "direct_invoke_function",
        eventType: "invoke",
        file: expect.any(String)
      })
    );
    expect(template.file).toContain("Direct Invoke");
  });

  it("Should generate http template", () => {
    const functions = {
      httpFunction
    };

    const [template] = generateTemplates(config, functions as any);

    expect(template).toBeTruthy();
    expect(template).toEqual(
      expect.objectContaining({
        name: "http_function",
        eventType: "http",
        file: expect.any(String)
      })
    );
    expect(template.file).toContain("HTTP");
  });

  it("Should generate sns template", () => {
    const functions = {
      snsFunction
    };

    const [template] = generateTemplates(config, functions as any);

    expect(template).toBeTruthy();
    expect(template).toEqual(
      expect.objectContaining({
        name: "sns_function",
        eventType: "sns",
        file: expect.any(String)
      })
    );
    expect(template.file).toContain("SNS");
  });

  it("Should generate sqs template", () => {
    const functions = {
      sqsFunction
    };
    const [template] = generateTemplates(config, functions as any);

    expect(template).toBeTruthy();
    expect(template).toEqual(
      expect.objectContaining({
        name: "sqs_function",
        eventType: "sqs",
        file: expect.any(String)
      })
    );
    expect(template.file).toContain("SQS");
  });

  it("Should generate kinesis template", () => {
    const functions = {
      kinesisFunction
    };
    const [template] = generateTemplates(config, functions as any);

    expect(template).toBeTruthy();
    expect(template).toEqual(
      expect.objectContaining({
        name: "kinesis_function",
        eventType: "kinesis",
        file: expect.any(String)
      })
    );
    expect(template.file).toContain("Kinesis");
  });

  it("Should generate dynamodb template", () => {
    const functions = {
      dynamodbFunction
    };
    const [template] = generateTemplates(config, functions as any);

    expect(template).toBeTruthy();
    expect(template).toEqual(
      expect.objectContaining({
        name: "dynamodb_function",
        eventType: "dynamodb",
        file: expect.any(String)
      })
    );
    expect(template.file).toContain("DynamoDB");
  });

  it("Should generate eventbridge template", () => {
    const functions = {
      eventBridgeFunction
    };
    const [template] = generateTemplates(config, functions as any);

    expect(template).toBeTruthy();
    expect(template).toEqual(
      expect.objectContaining({
        name: "event_bridge_function",
        eventType: "eventBridge",
        file: expect.any(String)
      })
    );
    expect(template.file).toContain("EventBridge");
  });
});
