export const lambda = `use lambda_runtime::{handler_fn, Context};
use serde::{Deserialize, Serialize};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

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

#[tokio:: main]
async fn main() -> Result<(), Error> {
    let func = handler_fn({{ name }}_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}`

