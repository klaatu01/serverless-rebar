type EventType = "http" | "stream" | "sns" | "invoke" | "sqs"
type StreamType = "dynamodb" | "kinesis"
type MethodType = "post" | "get"

export class Template {
  eventType: EventType
  isHttp = () => {
    return false;
  }
  isStream = () => {
    return false;
  }
  getName = (): string => {
    return this.eventType;
  }
}

export class InvokeTemplate extends Template {
  constructor() {
    super()
    this.eventType = "invoke"
  }
}

export class SnsTemplate extends Template {
  constructor() {
    super()
    this.eventType = "sns"
  }
}

export class SqsTemplate extends Template {
  constructor() {
    super()
    this.eventType = "sqs"
  }
}


abstract class StreamTemplate extends Template {
  streamType: StreamType;
  constructor() {
    super();
    this.eventType = "stream"
  }

  isStream = () => {
    return true;
  }

  getName = () => {
    return `${this.eventType}_${this.streamType}`
  }
}

export class DynamoDBStreamTemplate extends StreamTemplate {
  public constructor() {
    super();
    this.streamType = "dynamodb"
  }
}

export class KinesisStreamTemplate extends StreamTemplate {
  public constructor() {
    super();
    this.streamType = "kinesis"
  }
}

abstract class HttpTemplate extends Template {
  method: MethodType;
  public constructor() {
    super();
    this.eventType = "http"
  }

  isHttp = () => {
    return true;
  }

  getName = () => {
    return `${this.eventType}_${this.method}`
  }
}

export class HttpGetTemplate extends HttpTemplate {
  public constructor() {
    super();
    this.method = "get"
  }
}

export class HttpPostTemplate extends HttpTemplate {
  public constructor() {
    super();
    this.method = "post"
  }
}
