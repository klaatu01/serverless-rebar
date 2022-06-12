import { Dependency, EventType } from "./types";

export const resolveDepenencies = (
  deps: Dependency[],
  eventTypes: EventType[]
) =>
  deps.filter(
    (dep: Dependency) =>
      !dep.requiredBy ||
      !!dep.requiredBy.find(eventType => eventTypes.includes(eventType))
  );

export const defaultDeps: Dependency[] = [
  {
    package: "tokio",
    version: "1.0",
    features: ["full"]
  },
  {
    package: "serde",
    version: "1.0"
  },
  {
    package: "serde_json",
    version: "1.0"
  },
  {
    package: "aws_lambda_events",
    version: "0.4.0"
  },
  {
    package: "aws_lambda_events_extended",
    version: "0.1.0",
    requiredBy: ["dynamodb"]
  },
  {
    package: "lambda_http",
    version: "0.3.0",
    requiredBy: ["http"]
  },
  {
    package: "lambda_runtime",
    version: "0.3.0",
    requiredBy: ["kinesis", "dynamodb", "sns", "invoke", "sqs"]
  }
];
