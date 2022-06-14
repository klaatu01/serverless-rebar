export const directInvokeFunction = {
  handler: "directInvoke"
};
export const httpFunction = {
  handler: "http",
  events: [{ http: null }]
};
export const snsFunction = {
  handler: "sns",
  events: [{ sns: null }]
};
export const sqsFunction = {
  handler: "sqs",
  events: [{ sqs: null }]
};
export const dynamodbFunction = {
  handler: "dynamodb",
  events: [{ stream: {type: "dynamodb" } }]
};
export const kinesisFunction = {
  handler: "kinesis",
  events: [{ stream: {type: "kinesis" } }]
};
export const eventBridgeFunction = {
  handler: "event_bridge",
  events: [{ eventBridge: null }]
};
