export const cargoTomlTemplate =
    `[package]
name = "{{name}}"
version = "0.1.0"
edition = "2018"

[dependencies]
tokio = { version = "1.0", features = ["full"] }
{{#isHttp}}
lambda_http = "0.3.0"
{{/isHttp}}
{{^isHttp}}
lambda_runtime = "0.3.0"
{{/isHttp}}
serde_json = "1.0"
serde = "1.0"
aws_lambda_events = "0.4.0"
{{#stream_dynamodb}}
aws_lambda_events_extended = "0.1.0"
{{/stream_dynamodb}}
{{#libs}}
{{.}} = "../{{.}}"
{{/libs}}`

export const mainTemplate =
    `{{#sns}}
use lambda_runtime::{handler_fn, Context};
use aws_lambda_events::event::sns::{SnsEvent};

async fn {{name}}_handler(event: SnsEvent, _: Context) -> Result<(), Error> {
    Ok(())
}
{{/sns}}
{{#sqs}}
use lambda_runtime::{handler_fn, Context};
use aws_lambda_events::event::sqs::{SqsEvent};

async fn {{name}}_handler(event: SqsEvent, _: Context) -> Result<(), Error> {
    Ok(())
}
{{/sqs}}
{{#invoke}}
use lambda_runtime::{handler_fn, Context};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct InvocationRequest {
    data: String,
    optional_data: Option<String>
}

#[derive(Serialize, Deserialize)]
struct InvocationResponse {
    data: String
}

async fn {{name}}_handler(event: InvocationRequest, _: Context) -> Result<InvocationResponse, Error> {
    Ok(InvocationResponse { data : "Hello from {{name}}!".to_string() })
}
{{/invoke}}
{{#stream_dynamodb}}
use aws_lambda_events_extended::dynamodb::DynamoDBEvent;
use lambda_runtime::{handler_fn, Context};

async fn {{name}}_handler(event: DynamoDBEvent, _: Context) -> Result<(), Error> {
    Ok(())
}
{{/stream_dynamodb}}
{{^isHttp}}
type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = handler_fn({{name}}_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}
{{/isHttp}}
{{#http_get}}
use lambda_http::{handler, lambda_runtime::{self, Context, Error }, IntoResponse, Request, RequestExt, Response};

async fn {{name}}_handler(event: Request, _: Context) -> Result<impl IntoResponse, Error> {
    let query_string_parameters = event.query_string_parameters();        
    let path_parameters = event.path_parameters();
    Ok("Hello!".into_response())
}

#[tokio:: main]
async fn main() -> Result<(), Error> {
    let func = handler({{ name }}_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}
{{/http_get}}
{{#http_post}}
use lambda_http::{handler, lambda_runtime::{self, Context, Error }, IntoResponse, Request, RequestExt, Response};

async fn {{name}}_handler(event: Request, _: Context) -> Result<impl IntoResponse, Error> {
    Ok("Hello!".into_response())
}

#[tokio:: main]
async fn main() -> Result<(), Error> {
    let func = handler({{ name }}_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}
{{/http_post}}`

