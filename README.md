# Next OpenAPI Route Handler

[![npm version](https://badge.fury.io/js/%40omer-x%2Fopenapi-types.svg)](https://badge.fury.io/js/%40omer-x%2Fnext-openapi-route-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`Next OpenAPI Route Handler` is an open-source, lightweight, and easy-to-use Next.js plugin designed to build type-safe, self-documented APIs. It leverages TypeScript and Zod to create and validate route handlers, automatically generating OpenAPI documentation from your code. This package aims to simplify the process of building and documenting REST APIs with Next.js, ensuring your API endpoints are well-defined and compliant with OpenAPI specifications.

**Key Features:**
- **Type-Safe API Endpoints**: Ensure your requests and responses are strongly typed with TypeScript.
- **Schema Validation**: Use Zod schemas for object validation, automatically converted to JSON schema for OpenAPI.
- **Auto-Generated Documentation**: Generate OpenAPI JSON specs from your route handlers.
- **Integration with Next.js**: Works seamlessly with Next.js App Directory features.
- **Customizable**: Compatible with existing Next.js projects and fully customizable to suit your needs.

> **Note:** This package has a peer dependency on [`Next OpenAPI.json Generator`](https://www.npmjs.com/package/@omer-x/next-openapi-json-generator) for extracting the generated OpenAPI JSON.

## Requirements

To use `@omer-x/next-openapi-route-handler`, you'll need the following dependencies in your Next.js project:

- [Next.js](https://nextjs.org/) >= v13
- [TypeScript](https://www.typescriptlang.org/) >= v5
- [Zod](https://zod.dev/) >= v3
- [Next OpenAPI.json Generator](https://www.npmjs.com/package/@omer-x/next-openapi-json-generator)

## Installation

To install this package, along with its peer dependency, run:

```sh
npm install @omer-x/next-openapi-route-handler @omer-x/next-openapi-json-generator
```

## Usage

The `createRoute` function is used to define route handlers in a type-safe and self-documenting way. Below is a description of each property of the input parameter:

| Property      | Type                                                       | Description                                                                              |
| ------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| operationId   | `string`                                                   | Unique identifier for the operation.                                                     |
| method        | `HttpMethod`                                               | HTTP method for the route (e.g., GET, POST, PUT, PATCH, DELETE).                         |
| summary       | `string`                                                   | Short summary of the operation.                                                          |
| description   | `string`                                                   | Detailed description of the operation.                                                   |
| tags          | `string[]`                                                 | Tags for categorizing the operation.                                                     |
| pathParams    | `ZodType`                                                  | Zod schema for validating path parameters.                                               |
| queryParams   | `ZodType`                                                  | Zod schema for validating query parameters.                                              |
| requestBody   | `ZodType`                                                  | Zod schema for the request body (required for POST/PUT/PATCH).                           |
| action        | `({ pathParams, queryParams, body }) => Promise<Response>` | Function handling the request, receiving pathParams, queryParams, and requestBody.       |
| responses     | `Record<string, ResponseDefinition>`                       | Object defining possible responses, each with a description and optional content schema. |

## Example

Here's an example of how to use `createRoute` to define route handlers:

```typescript
import createRoute from "@omer-x/next-openapi-route-handler";
import z from "zod";

export const { GET } = createRoute({
  operationId: "getUser",
  method: "GET",
  summary: "Get a specific user by ID",
  description: "Retrieve detailed information about a user by their unique ID",
  tags: ["Users"],
  pathParams: z.object({
    id: z.string().describe("ID of the user"),
  }),
  action: ({ pathParams }) => {
    const userId = pathParams.id;
    // do something with userId
    return Response.json(userId);
  },
  responses: {
    200: {
      description: "Successful response",
      content: z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        email: z.string().email(),
        createdAt: z.date(),
      }),
    },
    404: { description: "User not found" },
  },
});

export const { PATCH } = createRoute({
  operationId: "updateUser",
  method: "PATCH",
  summary: "Update a specific user by ID",
  description: "Update the details of an existing user identified by their unique ID",
  tags: ["Users"],
  pathParams: z.object({
    id: z.string().describe("ID of the user"),
  }),
  action: ({ pathParams }) => {
    const userId = pathParams.id;
    // do something with userId
    return Response.json(userId);
  },
  responses: {
    200: { description: "User updated successfully" },
    404: { description: "User not found" },
    409: { description: "Email already exists" },
  },
});

export const { DELETE } = createRoute({
  operationId: "deleteUser",
  method: "DELETE",
  summary: "Delete a specific user by ID",
  description: "Remove a user from the system by their unique ID",
  tags: ["Users"],
  pathParams: z.object({
    id: z.string().describe("ID of the user"),
  }),
  action: ({ pathParams }) => {
    const userId = pathParams.id;
    // do something with userId
    return Response.json(userId);
  },
  responses: {
    204: { description: "User deleted successfully" },
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
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "summary": "Get a specific user by ID",
        "description": "Retrieve detailed information about a user by their unique ID",
        "tags": ["Users"],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "description": "ID of the user",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "email": {
                      "type": "string",
                      "format": "email"
                    },
                    "createdAt": {
                      "type": "string",
                      "format": "date-time"
                    }
                  },
                  "required": ["id", "name", "email", "createdAt"],
                  "additionalProperties": false
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
        "operationId": "updateUser",
        "summary": "Update a specific user by ID",
        "description": "Update the details of an existing user identified by their unique ID",
        "tags": ["Users"],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "description": "ID of the user",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User updated successfully"
          },
          "404": {
            "description": "User not found"
          },
          "409": {
            "description": "Email already exists"
          }
        }
      },
      "delete": {
        "operationId": "deleteUser",
        "summary": "Delete a specific user by ID",
        "description": "Remove a user from the system by their unique ID",
        "tags": ["Users"],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "description": "ID of the user",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "User deleted successfully"
          },
          "404": {
            "description": "User not found"
          }
        }
      }
    }
  }
}
```

> **Important:** This package cannot extract the OpenAPI JSON by itself. Use [Next OpenAPI.json Generator](https://www.npmjs.com/package/@omer-x/next-openapi-json-generator) to extract the generated data as JSON.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
