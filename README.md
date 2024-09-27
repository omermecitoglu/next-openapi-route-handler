# Next OpenAPI Route Handler

[![npm version](https://img.shields.io/npm/v/@omer-x/next-openapi-route-handler)](https://www.npmjs.com/package/@omer-x/next-openapi-route-handler)
[![npm downloads](https://img.shields.io/npm/dm/@omer-x/next-openapi-route-handler)](https://www.npmjs.com/package/@omer-x/next-openapi-route-handler)
[![codecov](https://codecov.io/gh/omermecitoglu/next-openapi-route-handler/branch/main/graph/badge.svg)](https://codecov.io/gh/omermecitoglu/next-openapi-route-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`Next OpenAPI Route Handler` is an open-source, lightweight, and easy-to-use Next.js plugin designed to build type-safe, self-documented APIs. It leverages TypeScript and Zod to create and validate route handlers, automatically generating OpenAPI documentation from your code. This package aims to simplify the process of building and documenting REST APIs with Next.js, ensuring your API endpoints are well-defined and compliant with OpenAPI specifications.

**Key Features:**
- **Type-Safe API Endpoints**: Ensure your requests and responses are strongly typed with TypeScript.
- **Schema Validation**: Use Zod schemas for object validation, automatically converted to JSON schema for OpenAPI.
- **Auto-Generated Documentation**: Generate OpenAPI JSON specs from your route handlers.
- **Integration with Next.js**: Works seamlessly with Next.js App Directory features.
- **Customizable**: Compatible with existing Next.js projects and fully customizable to suit your needs.

> **Note:** This package has a peer dependency on [`Next OpenAPI JSON Generator`](https://www.npmjs.com/package/@omer-x/next-openapi-json-generator) for extracting the generated OpenAPI JSON.

## Requirements

To use `@omer-x/next-openapi-route-handler`, you'll need the following dependencies in your Next.js project:

- [Next.js](https://nextjs.org/) >= v13
- [Zod](https://zod.dev/) >= v3
- [Next OpenAPI JSON Generator](https://www.npmjs.com/package/@omer-x/next-openapi-json-generator)

## Installation

To install this package, along with its peer dependency, run:

```sh
npm install @omer-x/next-openapi-route-handler @omer-x/next-openapi-json-generator
```

## Usage

The `defineRoute` function is used to define route handlers in a type-safe and self-documenting way. Below is a description of each property of the input parameter:

| Property      | Type                                                         | Description                                                                              |
| ------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| operationId   | `string`                                                     | Unique identifier for the operation.                                                     |
| method        | `string`                                                     | HTTP method for the route (e.g., `GET`, `POST`, `PUT`, `PATCH`, `DELETE`).               |
| summary       | `string`                                                     | Short summary of the operation.                                                          |
| description   | `string`                                                     | Detailed description of the operation.                                                   |
| tags          | `string[]`                                                   | Tags for categorizing the operation.                                                     |
| pathParams    | [ZodType](https://zod.dev)                                   | `(Optional)` Zod schema for validating path parameters.                                  |
| queryParams   | [ZodType](https://zod.dev)                                   | `(Optional)` Zod schema for validating query parameters.                                 |
| requestBody   | [ZodType](https://zod.dev)                                   | Zod schema for the request body (required for `POST`, `PUT`, `PATCH`).                   |
| hasFormData   | `boolean`                                                    | Is the request body a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) |
| action        | (source: [ActionSource](#action-source)) => Promise<[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)> | Function handling the request, receiving pathParams, queryParams, and requestBody. |
| responses     | Record<`number`, [ResponseDefinition](#response-definition)> | Object defining possible responses, each with a description and optional content schema. |

### Action Source

| Property      | Type                        | Description                                  |
| ------------- | --------------------------- | -------------------------------------------- |
| pathParams    | [ZodType](https://zod.dev)  | Parsed parameters from the request URL path. |
| queryParams   | [ZodType](https://zod.dev)  | Parsed parameters from the request query.    |
| body          | [ZodType](https://zod.dev)  | Parsed request body.                         |

### Response Definition

| Property      | Type                        | Description                                    |
| ------------- | --------------------------- | ---------------------------------------------- |
| description   | `string`                    | Description of the response.                   |
| content       | [ZodType](https://zod.dev)  | `(Optional)` Zod schema for the response body. |
| isArray       | `boolean`                   | `(Optional)` Is the content an array?          |

## Example

Here's an example of how to use `defineRoute` to define route handlers:

```typescript
import defineRoute from "@omer-x/next-openapi-route-handler";
import z from "zod";

export const { GET } = defineRoute({
  operationId: "getUser",
  method: "GET",
  summary: "Get a specific user by ID",
  description: "Retrieve details of a specific user by their ID",
  tags: ["Users"],
  pathParams: z.object({
    id: z.string().describe("ID of the user"),
  }),
  action: async ({ pathParams }) => {
    const results = await db.select().from(users).where(eq(users.id, pathParams.id));
    const user = results.shift();
    if (!user) return new Response(null, { status: 404 });
    return Response.json(user);
  },
  responses: {
    200: { description: "User details retrieved successfully", content: UserDTO },
    404: { description: "User not found" },
  },
});
```

This will generate an OpenAPI JSON like this:

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "User Service",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        ...
      },
      "post": {
        ...
      }
    },
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "summary": "Get a specific user by ID",
        "description": "Retrieve details of a specific user by their ID",
        "tags": [
          "Users"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "description": "ID of the user",
            "schema": {
              "type": "string",
              "description": "ID of the user"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User details retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserDTO"
                }
              }
            }
          },
          "404": {
            "description": "User not found"
          }
        }
      },
      "patch": {
        ...
      },
      "delete": {
        ...
      }
    }
  },
  "components": {
    "schemas": {
      "UserDTO": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "description": "Unique identifier of the user"
          },
          "name": {
            "type": "string",
            "description": "Display name of the user"
          },
          "email": {
            "type": "string",
            "description": "Email address of the user"
          },
          "password": {
            "type": "string",
            "maxLength": 72,
            "description": "Encrypted password of the user"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Creation date of the user"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "description": "Modification date of the user"
          }
        },
        "required": [
          "id",
          "name",
          "email",
          "password",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false,
        "description": "Represents the data of a user in the system."
      },
      "NewUserDTO": {
        ...
      },
      "UserPatchDTO": {
        ...
      }
    }
  }
}
```

> **Important:** This package cannot extract the OpenAPI JSON by itself. Use [Next OpenAPI JSON Generator](https://www.npmjs.com/package/@omer-x/next-openapi-json-generator) to extract the generated data as JSON.

[An example can be found here](https://github.com/omermecitoglu/example-user-service)

## Screenshots

| <a href="https://i.imgur.com/ru3muBc.png" target="_blank"><img src="https://i.imgur.com/ru3muBc.png" alt="screenshot-1"></a> | <a href="https://i.imgur.com/utHaZ6X.png" target="_blank"><img src="https://i.imgur.com/utHaZ6X.png" alt="screenshot-2"></a> | <a href="https://i.imgur.com/2f24kPE.png" target="_blank"><img src="https://i.imgur.com/2f24kPE.png" alt="screenshot-3"></a> | <a href="https://i.imgur.com/z3KIJQ1.png" target="_blank"><img src="https://i.imgur.com/z3KIJQ1.png" alt="screenshot-4"></a> |
|:--------------:|:--------------:|:--------------:|:--------------:|
| <a href="https://i.imgur.com/IFKXOiX.png" target="_blank"><img src="https://i.imgur.com/IFKXOiX.png" alt="screenshot-5"></a> | <a href="https://i.imgur.com/xzVjAPq.png" target="_blank"><img src="https://i.imgur.com/xzVjAPq.png" alt="screenshot-6"></a> | <a href="https://i.imgur.com/HrWuHOR.png" target="_blank"><img src="https://i.imgur.com/HrWuHOR.png" alt="screenshot-7"></a> |  |

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
