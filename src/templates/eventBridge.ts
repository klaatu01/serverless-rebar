export const eventBridge = `use aws_lambda_events::event::cloudwatch_events::{CloudWatchEvent};
use lambda_runtime::{handler_fn, Context};
use serde::{Deserialize, Serialize};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

#[derive(Serialize, Deserialize)]
struct ExampleDetail {
    data: String,
}

#[derive(Serialize, Deserialize)]
struct AnotherExampleDetail {
    numerical_data: u64,
}

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
enum Detail {
    A(ExampleDetail),
    B(AnotherExampleDetail),
}

async fn {{name}}_handler(event: CloudWatchEvent<Detail>, _: Context) -> Result<(), Error> {
    match event.detail.unwrap() {
        Detail::A(example_detail) => Ok(()), 
        Detail::B(another_example_detail) => Ok(()), 
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = handler_fn({{name}}_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}`
