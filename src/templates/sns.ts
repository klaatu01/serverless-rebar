export const sns = `use lambda_runtime::{handler_fn, Context};
use aws_lambda_events::event::sns::{SnsEvent};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

async fn {{name}}_handler(event: SnsEvent, _: Context) -> Result<(), Error> {
    Ok(())
}

#[tokio:: main]
async fn main() -> Result<(), Error> {
    let func = handler_fn({{ name }}_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}`
