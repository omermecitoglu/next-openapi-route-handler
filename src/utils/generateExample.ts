import { ZodArray, ZodBigInt, ZodBoolean, ZodEnum, ZodNull, ZodNullable, ZodNumber, ZodObject, ZodOptional, ZodString, type ZodType, type ZodTypeDef, ZodUndefined, ZodUnion } from "zod";

type ExampleGeneratorOptions = {
  keyName?: string,
  nullable: boolean,
};

export default function generateExample<I, O>(
  schema: ZodType<O, ZodTypeDef, I>,
  ignoreOptionals: boolean,
  generatorOptions: ExampleGeneratorOptions = { nullable: false },
): O {
  if ("defaultValue" in schema._def && typeof schema._def.defaultValue === "function") {
    return schema._def.defaultValue() as unknown as O;
  }
  if (schema instanceof ZodOptional) {
    const innerSchema = schema.unwrap();
    if (ignoreOptionals) {
      return undefined as unknown as O;
    }
    return generateExample(innerSchema, ignoreOptionals, generatorOptions);
  }
  if (schema instanceof ZodNullable) {
    const innerSchema = schema.unwrap();
    return (generateExample(innerSchema, ignoreOptionals, { ...generatorOptions, nullable: true }) ?? null) as unknown as O;
  }
  if (schema instanceof ZodObject) {
    const entries = Object.entries(schema.shape).map(([keyName, childSchema]) => {
      return [keyName, generateExample(childSchema as ZodType, ignoreOptionals, { ...generatorOptions, keyName })] as const;
    }).filter(([_, value]) => typeof value !== "undefined");
    return Object.fromEntries(entries) as unknown as O;
  }
  if (schema instanceof ZodEnum) {
    const values = schema.options;
    if (values.length) {
      return values[0] as unknown as O;
    }
  }
  if (schema instanceof ZodNumber) {
    if (schema.minValue) {
      return schema.minValue as unknown as O;
    }
    if (schema._def.checks.length) {
      for (const check of schema._def.checks) {
        if (check.kind === "max" && check.value < 1) {
          return -1 as unknown as O;
        }
        if (check.kind === "multipleOf") {
          return check.value as unknown as O;
        }
      }
    }
    return 1 as unknown as O;
  }
  if (schema instanceof ZodBigInt) {
    return 1n as unknown as O;
  }
  if (schema instanceof ZodBoolean) {
    return false as unknown as O;
  }
  if (schema instanceof ZodUndefined) {
    return undefined as unknown as O;
  }
  if (schema instanceof ZodNull) {
    return null as unknown as O;
  }
  if (schema instanceof ZodString) {
    if (schema.isEmail) {
      return "john.doe@example.com" as unknown as O;
    }
    if (schema.isURL) {
      return "https://example.com" as unknown as O;
    }
    if (schema.isEmoji) {
      return "😀" as unknown as O;
    }
    if (schema.isUUID) {
      return "aa35d4a1-8f23-4cee-847c-2bfe89dc87c1" as unknown as O;
    }
    if (schema.isIP) {
      return "192.168.1.1" as unknown as O;
    }
    if (schema.isDatetime) {
      return "2024-11-06T07:00:00.137Z" as unknown as O;
    }
    if (schema._def.checks.length) {
      const example = ["example"];
      for (const check of schema._def.checks) {
        if (check.kind === "startsWith") {
          example.unshift(check.value);
        }
        if (check.kind === "endsWith") {
          example.push(check.value);
        }
      }
      return example.join("") as unknown as O;
    }
    if (generatorOptions.keyName) {
      return `example ${generatorOptions.keyName}` as unknown as O;
    }
    if (generatorOptions.nullable) {
      return "example nullable string" as unknown as O;
    }
    return "example string" as unknown as O;
  }
  if (schema instanceof ZodArray) {
    if (schema._def.type instanceof ZodUnion) {
      const unionOptions = schema._def.type.options as ZodType[];
      return unionOptions.map(o => generateExample(o, ignoreOptionals, generatorOptions)) as unknown as O;
    }
    return [generateExample(schema._def.type, ignoreOptionals, generatorOptions)] as unknown as O;
  }
  if (schema instanceof ZodUnion) {
    const unionOptions = schema.options as ZodType[];
    const firstItem = unionOptions[0];
    if (firstItem) {
      return generateExample(firstItem, ignoreOptionals, generatorOptions);
    }
    return undefined as unknown as O;
  }
  throw new Error("Unknown zod schema");
}
