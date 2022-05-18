# TS-JSON-SCHEMA

[![npm package][npm-img]][npm-url] [![Build Status][build-img]][build-url] [![Downloads][downloads-img]][downloads-url] [![Issues][issues-img]][issues-url] [![Code Coverage][codecov-img]][codecov-url] [![Commitizen Friendly][commitizen-img]][commitizen-url] [![Semantic Release][semantic-release-img]][semantic-release-url]

Other languages: [中文](./README.zh-CN.md)

A Typescript transformer plugin to convert Typescript type to JSON Schema.

Inspired by [`vega/ts-json-schema-generator`](https://github.com/vega/ts-json-schema-generator) and [`ipetrovic11/ts-transformer-json-schema`](https://github.com/ipetrovic11/ts-transformer-json-schema)

## Table of Contents

- [Install](#Install)
- [Usage](#Usage)
  - [tsconfig.json](#tsconfig.json)
  - [ts-patch](#ts-patch)
  - [write code](#write-code)
- [Support Types](#Support-Types)
- [Extra Schema Props](#Extra-Schema-Props)
- [`undefined` in Transformer](#undefined-in-Transformer)

## Install

```bash
$ pnpm add types2schema
```

## Usage

### tsconfig.json

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "plugins": [{ "transform": "types2schema/lib/transformer" }]
  }
  // ...
}
```

### ts-patch

Unfortunately, TypeScript itself does not currently provide any easy way to use custom transformers, so you have to use [`ts-patch`](https://github.com/nonara/ts-patch) or other lib which support transformer to make this plugin available.

Why not use `ttypescript`? `ttypescript` didn't support alter diagnostics, but we can't avoid writing a **error type** whose inner has unsupported type, so we chose a lib support we add diagnostics to print transformer errors.

### Write Code

```ts
import { schema } from 'types2schema';

const validateSchema = schema<string>();
```

Compile Result:

```ts
import { schema } from 'types2schema';

const validateSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'string',
};
```

## Support Types

- Primitive Types (null、number、string、boolean)
- Literal
- Interface
- Type Literal
- Mapped Type
- Enum
- Union Type
- Intersection Type
- Array
- Tuple

All the above types support generic.

If you want more support more about the support situation, please check [Unit Tests](../tests/schema).

## Extra Schema Props

Sometime you want to add some JSON Schema specific fields like:

```json
{
  "type": "string",
  "minLength": 2,
  "maxLength": 10
}
```

In these case, you can use jsdoc tags to describe these extra schema fields and their value:

```ts
interface IApi {
  /**
   * @minLength 2
   * @maxLength 10
   */
  name: string;
}
```

Transformer will parse tags on object properties, interface and object type alias. But because object type would be transformed to [definition reference](https://json-schema.org/understanding-json-schema/structuring.html?highlight=ref#id1), so **property jsdoc tags will be invalidation when it's value type is a other object type**.

Example:

```ts
/**
 * ✅ available
 * @additionalProperties true
 */
interface IPerson {
  name: string;
}

interface IApi {
  /**
   * ❌ unavailable
   * @additionalProperties false
   */
  person: IPerson;
}
```

The tag value would be considered as a json string. When failed, treat it as a normal string.

## `undefined` in Transformer

Usually, `undefined` is not a type that can be converted to Schema, but when it is used as a property value of an object, Typescript will mark this property as an optional property. The plugin has some special process to be compatible with this type of writing (But we still recommend use the optional mark `?` when writing object), but using `undefined` in other scenes will trigger a transformer error.

✅：

```ts
interface IApi {
  name: string | undefined;
}

// Equal to
interface IApi {
  name?: string;
}
```

❌：

```ts
schema<undefined>();

type Union = string | undefined;
schema<Union>();

type Tuple = [string | undefined, undefined];
schema<Tuple>();
```

[build-img]: https://github.com/kainstar/types2schema/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/kainstar/types2schema/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/types2schema
[downloads-url]: https://www.npmtrends.com/types2schema
[npm-img]: https://img.shields.io/npm/v/types2schema
[npm-url]: https://www.npmjs.com/package/types2schema
[issues-img]: https://img.shields.io/github/issues/kainstar/types2schema
[issues-url]: https://github.com/kainstar/types2schema/issues
[codecov-img]: https://codecov.io/gh/kainstar/types2schema/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/kainstar/types2schema
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
