# Serverless Rebar

Zero Configuration scaffolding tool for serverless rust projects.

## About

Rebar uses your `serverless.yml` to create handler templates for a variety of [AWS Lambda Events](https://www.serverless.com/framework/docs/providers/aws/guide/events).

Cool... but why?

Well, the problem with rust + lambda is that each function needs to be its own binary:


```
rust-sls/
    ├── cargo.toml
    ├── serverless.yml
    └── src/
        └── bin/
            ├── handler_a.rs
            └── handler_b.rs
```

## Installation

```serverless plugin install --name serverless-rebar```

## Configuration

```
custom:
  rebar:
    <parameter>: <value(s)>
```

Parameter | Type | Description | Default
--- | --- | ---
`libs` | `Array<string>` | Any local libraries you would like to import by default into your handlers | -
`handlerDir` | `string` | The name of the directory under `src` where binaries are stored. | `bin`

## Usage

```serverless rebar```


