export type EventType = "http" | "stream" | "sns" | "invoke" | "sqs" | "dynamodb" | "kinesis" | "eventBridge" ;

export interface Dependency {
  package: string;
  version: string;
  features?: string[];
  requiredBy?: EventType[];
}

export interface Template {
  name: string;
  eventType: EventType;
  file: string;
}

export interface Binary {
  name: string;
  path: string;
}

export interface Package {
  name: string;
  version: string;
  edition: string;
}

export interface CargoToml {
  package: Package;
  bin: Binary[];
  dependencies: { string: {} | string };
}
