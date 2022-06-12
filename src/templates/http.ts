export const httpGet = `use lambda_http::{handler, lambda_runtime::{self, Context, Error }, IntoResponse, Request, RequestExt, Response};

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
}`

export const httpPost = `use lambda_http::{handler, lambda_runtime::{self, Context, Error }, IntoResponse, Request, RequestExt, Response};

async fn {{name}}_handler(event: Request, _: Context) -> Result<impl IntoResponse, Error> {
    Ok("Hello!".into_response())
}

#[tokio:: main]
async fn main() -> Result<(), Error> {
    let func = handler({{ name }}_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}`
