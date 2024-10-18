import z from "zod";

const ZOD_ISSUE_BASE = z.object({
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
});

const INVALID_TYPE = z.object({
  code: z.literal("invalid_type"),
  expected: z.any(), // ZodParsedType
  received: z.any(), // ZodParsedType
});

const INVALID_LITERAL = z.object({
  code: z.literal("invalid_literal"),
  expected: z.unknown(),
  received: z.unknown(),
});

const CUSTOM = z.object({
  code: z.literal("custom"),
  keys: z.string().array(),
  params: z.record(z.string(), z.any()).optional(),
});

const INVALID_UNION = z.object({
  code: z.literal("invalid_union"),
  unionErrors: z.unknown().array(), // ZodError[]
});

const INVALID_UNION_DISCRIMINATOR = z.object({
  code: z.literal("invalid_union_discriminator"),
  options: z.union([
    z.string(),
    z.number(),
    z.symbol(),
    z.bigint(),
    z.boolean(),
    z.null(),
    z.undefined(),
  ]).array(),
});

const INVALID_ENUM_VALUE = z.object({
  code: z.literal("invalid_enum_value"),
  received: z.union([z.string(), z.number()]),
  options: z.union([z.string(), z.number()]).array(),
});

const UNRECOGNIZED_KEYS = z.object({
  code: z.literal("unrecognized_keys"),
  keys: z.string().array(),
});

const INVALID_ARGUMENTS = z.object({
  code: z.literal("invalid_arguments"),
  argumentsError: z.unknown(), // ZodError
});

const INVALID_RETURN_TYPE = z.object({
  code: z.literal("invalid_return_type"),
  returnTypeError: z.unknown(), // ZodError
});

const INVALID_DATE = z.object({
  code: z.literal("invalid_date"),
});

const INVALID_STRING = z.object({
  code: z.literal("invalid_string"),
  validation: z.union([
    z.enum([
      "email",
      "url",
      "emoji",
      "uuid",
      "nanoid",
      "regex",
      "cuid",
      "cuid2",
      "ulid",
      "datetime",
      "date",
      "time",
      "duration",
      "ip",
      "base64",
    ]),
    z.object({
      includes: z.string(),
      position: z.number().optional(),
    }),
    z.object({
      startsWith: z.string(),
    }),
    z.object({
      endsWith: z.string(),
    }),
  ]),
});

const TOO_SMALL = z.object({
  code: z.literal("too_small"),
  minimum: z.union([z.number(), z.bigint()]),
  inclusive: z.boolean(),
  exact: z.boolean().optional(),
  type: z.enum(["array", "string", "number", "set", "date", "bigint"]),
});

const TOO_BIG = z.object({
  code: z.literal("too_big"),
  maximum: z.union([z.number(), z.bigint()]),
  inclusive: z.boolean(),
  exact: z.boolean().optional(),
  type: z.enum(["array", "string", "number", "set", "date", "bigint"]),
});

const INVALID_INTERSECTION_TYPES = z.object({
  code: z.literal("invalid_intersection_types"),
});

const NOT_MULTIPLE_OF = z.object({
  code: z.literal("not_multiple_of"),
  multipleOf: z.union([z.number(), z.bigint()]),
});

const NOT_FINITE = z.object({
  code: z.literal("not_finite"),
});

export const ZOD_ISSUE = z.discriminatedUnion("code", [
  INVALID_TYPE.merge(ZOD_ISSUE_BASE),
  INVALID_LITERAL.merge(ZOD_ISSUE_BASE),
  CUSTOM.merge(ZOD_ISSUE_BASE),
  INVALID_UNION.merge(ZOD_ISSUE_BASE),
  INVALID_UNION_DISCRIMINATOR.merge(ZOD_ISSUE_BASE),
  INVALID_ENUM_VALUE.merge(ZOD_ISSUE_BASE),
  UNRECOGNIZED_KEYS.merge(ZOD_ISSUE_BASE),
  INVALID_ARGUMENTS.merge(ZOD_ISSUE_BASE),
  INVALID_RETURN_TYPE.merge(ZOD_ISSUE_BASE),
  INVALID_DATE.merge(ZOD_ISSUE_BASE),
  INVALID_STRING.merge(ZOD_ISSUE_BASE),
  TOO_SMALL.merge(ZOD_ISSUE_BASE),
  TOO_BIG.merge(ZOD_ISSUE_BASE),
  INVALID_INTERSECTION_TYPES.merge(ZOD_ISSUE_BASE),
  NOT_MULTIPLE_OF.merge(ZOD_ISSUE_BASE),
  NOT_FINITE.merge(ZOD_ISSUE_BASE),
]);
