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
{{.}} = { path = "../{{.}}" }
{{/libs}}`
