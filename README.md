# Serverless Rebar

A scaffolding tool for rust serverless projects.

## About

Rebar reads the functions object of your `serverless.yml`, creates a file for each function and does its best to try and provide a relevant `main.rs` depending on the function's [event](https://www.serverless.com/framework/docs/providers/aws/guide/events)

Cool... but why?

Well, the problem with rust + lambda is that each function needs to be its own binary. Here is one pattern that I have found to work well:

```
rust-sls/
    ├── cargo.toml
    ├── serverless.yaml
    ├── common/
    │   ├── cargo.toml
    │   └── src/
    │       └── lib.rs
    ├── handler-a/
    │   ├── cargo.toml
    │   └── src/
    │       └── main.rs
    └── handler-b/
        ├── cargo.toml
        └── src/
            └── main.rs
```

Keeping all of the application logic in a shared library `common`. 
Each handler has its own `main.rs` that references this `common` lib.

## Installation

```serverless plugin install --name serverless-rebar```

## Configuration

```
custom:
  rebar:
    libs:
      - <common-lib-name>
```

## Usage

```serverless rebar```


