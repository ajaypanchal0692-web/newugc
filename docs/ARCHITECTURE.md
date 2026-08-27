# newugc Architecture

## Goal

Build a product-first UGC video workflow around reusable prompt templates and Seedance-compatible generation instructions.

## Core domains

- `prompts`: structured prompt templates, variables, categories and versions
- `creators`: reusable male/female creator personas and presentation attributes
- `products`: product references, media and campaign metadata
- `projects`: user-owned generation projects and outputs
- `api`: generation-provider adapters and application endpoints

## Reference strategy

`ZeroLu/awesome-seedance` is a research/reference source. Its repository is MIT licensed, but individual resources attributed to third parties are reviewed separately before reuse.

## First implementation phase

1. Establish data models for prompts, creators, products and projects.
2. Build prompt composition from product + creator + campaign inputs.
3. Add a provider abstraction so Seedance integration is isolated from the UI.
4. Add validation and tests before connecting paid generation APIs.
