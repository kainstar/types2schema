# types2schema

其他语言：[English](./README.md)

将 Typescript 类型转化为对应 JSON Schema 的 Typescript Transformer 插件。

本插件的实现参考了 [`vega/ts-json-schema-generator`](https://github.com/vega/ts-json-schema-generator) 和 [`ipetrovic11/ts-transformer-json-schema`](https://github.com/ipetrovic11/ts-transformer-json-schema) 这两个项目。

## 内容

- [安装](#安装)
- [使用](#使用)
  - [配置 tsconfig.json](#配置-tsconfig.json)
  - [ts-patch](#ts-patch)
  - [编写代码](#编写代码)
- [注意点](#注意点)
  - [支持的类型](#支持的类型)
  - [额外的 Schema 属性](#额外的-Schema-属性)
  - [`undefined` 的特殊处理](#undefined-的特殊处理)

## 安装

```bash
$ pnpm add types2schema
```

## 使用

### 配置 tsconfig.json

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

由于 TS 官方没有正式支持 Transformer Plugin，因此我们需要使用一些社区提供的工具，例如 [`ts-patch`](https://github.com/nonara/ts-patch) 来使插件能够正常运行。

可能有人会问为什么不选用 `ttypescript`？原因是 `ttypescript` 不支持我们修改诊断结果（`diagnostics`）,但我们实际上无法避免编写内部含有不支持类型的错误类型，因此为了体验考虑，我选择了支持修改诊断结果的库，这样我们可以将转换中的错误信息以正常的方式打印出来。

### 编写代码

```ts
import { schema } from 'types2schema';

const validateSchema = schema<string>();
```

编译结果:

```ts
import { schema } from 'types2schema';

const validateSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'string',
};
```

## 注意点

### 支持的类型

- 原始类型 (null、number、string、boolean)
- Literal
- Interface
- Type Literal
- Mapped Type
- Enum
- Union Type
- Intersection Type
- Array
- Tuple

以上所有类型均支持泛型参数。

如果你想了解更多支持的情况，请查看[单元测试用例](../tests/schema)。

### 额外的 Schema 属性

有时候你会想添加一些特殊的 Schema 属性，例如：

```json
{
  "type": "string",
  "minLength": 2,
  "maxLength": 10
}
```

这种情况下，你可以通过 `jsDoc` 来标注这些特殊的属性和对应的值：

```ts
interface IApi {
  /**
   * @minLength 2
   * @maxLength 10
   */
  name: string;
}
```

插件会解析在对象属性、接口或对象声明上的这些标注，但是由于对象类型会被转换成[定义引用](https://json-schema.org/understanding-json-schema/structuring.html?highlight=ref#id1)，因此当一个对象属性的值为另一个对象时，这个属性上的标注将会失效。

示例:

```ts
/**
 * ✅ 此处的标注有效
 * @additionalProperties true
 */
interface IPerson {
  name: string;
}

interface IApi {
  /**
   * ❌ 此处的标注无效
   * @additionalProperties false
   */
  person: IPerson;
}
```

解析标注的值时，会将其当成一个 JSON 字符串来解析，如果解析失败了，则会将其当成一个普通的字符串。

### `undefined` 的特殊处理

一般情况下，`undefined` 并不是一个可以被转换成 Schema 的类型，但是在作为对象的属性值时， Typescript 会将这个属性标注为一个可选属性。插件做了一些特殊处理来兼容这种写法（但是我们依旧推荐你在编写类型时使用可选标记`?`）；但是在其他的场景下使用 `undefined` 则会触发转换错误。

✅：

```ts
interface IApi {
  name: string | undefined;
}

// 等同于
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
