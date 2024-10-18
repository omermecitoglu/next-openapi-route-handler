# Next OpenAPI Route Handler

[![npm version](https://img.shields.io/npm/v/@omer-x/next-openapi-route-handler?logo=npm&logoColor=CB3837&color=CB3837)](https://www.npmjs.com/package/@omer-x/next-openapi-route-handler)
[![npm downloads](https://img.shields.io/npm/dm/@omer-x/next-openapi-route-handler?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNi4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTI4OCAzMmMwLTE3LjctMTQuMy0zMi0zMi0zMnMtMzIgMTQuMy0zMiAzMmwwIDI0Mi43LTczLjQtNzMuNGMtMTIuNS0xMi41LTMyLjgtMTIuNS00NS4zIDBzLTEyLjUgMzIuOCAwIDQ1LjNsMTI4IDEyOGMxMi41IDEyLjUgMzIuOCAxMi41IDQ1LjMgMGwxMjgtMTI4YzEyLjUtMTIuNSAxMi41LTMyLjggMC00NS4zcy0zMi44LTEyLjUtNDUuMyAwTDI4OCAyNzQuNyAyODggMzJ6TTY0IDM1MmMtMzUuMyAwLTY0IDI4LjctNjQgNjRsMCAzMmMwIDM1LjMgMjguNyA2NCA2NCA2NGwzODQgMGMzNS4zIDAgNjQtMjguNyA2NC02NGwwLTMyYzAtMzUuMy0yOC43LTY0LTY0LTY0bC0xMDEuNSAwLTQ1LjMgNDUuM2MtMjUgMjUtNjUuNSAyNS05MC41IDBMMTY1LjUgMzUyIDY0IDM1MnptMzY4IDU2YTI0IDI0IDAgMSAxIDAgNDggMjQgMjQgMCAxIDEgMC00OHoiIGZpbGw9IiMwMDc4MjAiIC8+PC9zdmc+&color=007820)](https://www.npmjs.com/package/@omer-x/next-openapi-route-handler)
[![codecov](https://codecov.io/gh/omermecitoglu/next-openapi-route-handler/branch/main/graph/badge.svg)](https://codecov.io/gh/omermecitoglu/next-openapi-route-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNi4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTM4NCAzMmwxMjggMGMxNy43IDAgMzIgMTQuMyAzMiAzMnMtMTQuMyAzMi0zMiAzMkwzOTguNCA5NmMtNS4yIDI1LjgtMjIuOSA0Ny4xLTQ2LjQgNTcuM0wzNTIgNDQ4bDE2MCAwYzE3LjcgMCAzMiAxNC4zIDMyIDMycy0xNC4zIDMyLTMyIDMybC0xOTIgMC0xOTIgMGMtMTcuNyAwLTMyLTE0LjMtMzItMzJzMTQuMy0zMiAzMi0zMmwxNjAgMCAwLTI5NC43Yy0yMy41LTEwLjMtNDEuMi0zMS42LTQ2LjQtNTcuM0wxMjggOTZjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzJsMTI4IDBjMTQuNi0xOS40IDM3LjgtMzIgNjQtMzJzNDkuNCAxMi42IDY0IDMyem01NS42IDI4OGwxNDQuOSAwTDUxMiAxOTUuOCA0MzkuNiAzMjB6TTUxMiA0MTZjLTYyLjkgMC0xMTUuMi0zNC0xMjYtNzguOWMtMi42LTExIDEtMjIuMyA2LjctMzIuMWw5NS4yLTE2My4yYzUtOC42IDE0LjItMTMuOCAyNC4xLTEzLjhzMTkuMSA1LjMgMjQuMSAxMy44bDk1LjIgMTYzLjJjNS43IDkuOCA5LjMgMjEuMSA2LjcgMzIuMUM2MjcuMiAzODIgNTc0LjkgNDE2IDUxMiA0MTZ6TTEyNi44IDE5NS44TDU0LjQgMzIwbDE0NC45IDBMMTI2LjggMTk1Ljh6TS45IDMzNy4xYy0yLjYtMTEgMS0yMi4zIDYuNy0zMi4xbDk1LjItMTYzLjJjNS04LjYgMTQuMi0xMy44IDI0LjEtMTMuOHMxOS4xIDUuMyAyNC4xIDEzLjhsOTUuMiAxNjMuMmM1LjcgOS44IDkuMyAyMS4xIDYuNyAzMi4xQzI0MiAzODIgMTg5LjcgNDE2IDEyNi44IDQxNlMxMS43IDM4MiAuOSAzMzcuMXoiIGZpbGw9IiNEMEE4MUMiIC8+PC9zdmc+)](https://opensource.org/licenses/MIT)
[![GitHub last commit](https://img.shields.io/github/last-commit/omermecitoglu/next-openapi-route-handler?color=c977be&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNi4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTMyMCAzMzZhODAgODAgMCAxIDAgMC0xNjAgODAgODAgMCAxIDAgMCAxNjB6bTE1Ni44LTQ4QzQ2MiAzNjEgMzk3LjQgNDE2IDMyMCA0MTZzLTE0Mi01NS0xNTYuOC0xMjhMMzIgMjg4Yy0xNy43IDAtMzItMTQuMy0zMi0zMnMxNC4zLTMyIDMyLTMybDEzMS4yIDBDMTc4IDE1MSAyNDIuNiA5NiAzMjAgOTZzMTQyIDU1IDE1Ni44IDEyOEw2MDggMjI0YzE3LjcgMCAzMiAxNC4zIDMyIDMycy0xNC4zIDMyLTMyIDMybC0xMzEuMiAweiIgZmlsbD0iI0M5NzdCRSIgLz48L3N2Zz4=)](https://github.com/omermecitoglu/next-openapi-route-handler/commits/main/)
[![GitHub issues](https://img.shields.io/github/issues/omermecitoglu/next-openapi-route-handler?color=a38eed&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij4KICA8cGF0aCBkPSJNOCA5LjVhMS41IDEuNSAwIDEgMCAwLTMgMS41IDEuNSAwIDAgMCAwIDNaIiBmaWxsPSIjQTM4RUVEIj48L3BhdGg+CiAgPHBhdGggZD0iTTggMGE4IDggMCAxIDEgMCAxNkE4IDggMCAwIDEgOCAwWk0xLjUgOGE2LjUgNi41IDAgMSAwIDEzIDAgNi41IDYuNSAwIDAgMC0xMyAwWiIgZmlsbD0iI0EzOEVFRCI+PC9wYXRoPgo8L3N2Zz4=)](https://github.com/omermecitoglu/next-openapi-route-handler/issues)
[![GitHub stars](https://img.shields.io/github/stars/omermecitoglu/next-openapi-route-handler?style=social)](https://github.com/omermecitoglu/next-openapi-route-handler)

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
| handleErrors  | (errorType: string, issues?: [ZodIssues](https://zod.dev/ERROR_HANDLING?id=zodissue)[]) => Response | `(Optional)` Custom error handler can be provided to replace the default behavior. [See below](#example) |

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
  // optional 👇👇👇
  handleErrors: (errorType, issues) => {
    console.log(issues);
    switch (errorType) {
      "PARSE_FORM_DATA":
      "PARSE_REQUEST_BODY":
      "PARSE_SEARCH_PARAMS":
        return new Response(null, { status: 400 });
      "PARSE_PATH_PARAMS":
        return new Response(null, { status: 404 });
      "UNNECESSARY_PATH_PARAMS":
      "UNKNOWN_ERROR":
        return new Response(null, { status: 500 });
    }
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
