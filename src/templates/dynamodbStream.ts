export const dynamodbStream = `use aws_lambda_events_extended::dynamodb::DynamoDBEvent;
use lambda_runtime::{handler_fn, Context};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

async fn {{name}}_handler(event: DynamoDBEvent, _: Context) -> Result<(), Error> {
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = handler_fn({{name}}_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}`
