import { ZodBigInt, ZodBoolean, ZodEnum, ZodNull, ZodNullable, ZodNumber, ZodObject, ZodOptional, ZodString, type ZodType, type ZodTypeDef, ZodUndefined } from "zod";

export default function generateExample<I, O>(
  schema: ZodType<O, ZodTypeDef, I>,
  ignoreOptionals: boolean,
  keyName?: string,
  nullable: boolean = false,
): O {
  if ("defaultValue" in schema._def && typeof schema._def.defaultValue === "function") {
    return schema._def.defaultValue() as unknown as O;
  }
  if (schema instanceof ZodOptional) {
    const innerSchema = schema._def.innerType;
    if (ignoreOptionals) {
      return undefined as unknown as O;
    }
    return generateExample(innerSchema, ignoreOptionals, keyName);
  }
  if (schema instanceof ZodNullable) {
    const innerSchema = schema._def.innerType;
    return (generateExample(innerSchema, ignoreOptionals, keyName, true) ?? null) as unknown as O;
  }
  if (schema instanceof ZodObject) {
    const entries = Object.entries(schema.shape).map(([key, childSchema]) => {
      return [key, generateExample(childSchema as ZodType, ignoreOptionals, key)] as const;
    }).filter(([_, value]) => typeof value !== "undefined");
    return Object.fromEntries(entries) as unknown as O;
  }
  if (schema instanceof ZodEnum) {
    const values = schema._def.values;
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
    if (keyName) {
      return `example ${keyName}` as unknown as O;
    }
    if (nullable) {
      return "example nullable string" as unknown as O;
    }
    return "example string" as unknown as O;
  }
  throw new Error("Unknown zod schema");
}
