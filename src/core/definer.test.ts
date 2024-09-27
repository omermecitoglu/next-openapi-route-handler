/* eslint-disable no-console */
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import z from "zod";
import defineRoute from "./definer";

describe("defineRoute", () => {
  const mockAction = jest.fn() as jest.Mock<() => Promise<Response>>;
  const mockRequest = {
    url: "https://example.com/test",
    json: jest.fn() as jest.Mock<() => Promise<unknown>>,
    formData: jest.fn() as jest.Mock<() => Promise<FormData>>,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle a route without pathParams and body for GET method", async () => {
    const route = defineRoute({
      operationId: "getExample",
      method: "GET",
      summary: "Get Example",
      description: "Fetches example data",
      tags: ["example"],
      action: mockAction,
      responses: {
        200: { description: "OK" },
      },
    });

    mockAction.mockResolvedValue(new Response("Success"));

    const nextJsRouteHandler = route.GET;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, {});

    expect(mockAction).toHaveBeenCalledWith({
      pathParams: null,
      queryParams: null,
      body: null,
    });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });

  it("should handle a POST route with pathParams and body", async () => {
    const pathSchema = z.object({ id: z.string() });
    const bodySchema = z.object({ name: z.string() });

    mockRequest.json.mockResolvedValue({ name: "Test" });

    const route = defineRoute({
      operationId: "postExample",
      method: "POST",
      summary: "Create Example",
      description: "Creates example data",
      tags: ["example"],
      pathParams: pathSchema,
      requestBody: bodySchema,
      action: mockAction,
      responses: {
        201: { description: "Created" },
      },
    });

    mockAction.mockResolvedValue(new Response("Created", { status: 201 }));

    const nextJsRouteHandler = route.POST;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: { id: "123" } });

    expect(mockAction).toHaveBeenCalledWith({
      pathParams: { id: "123" },
      queryParams: null,
      body: { name: "Test" },
    });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(201);
  });

  it("should return 400 on bad request (invalid body)", async () => {
    const originalLog = console.log;
    console.log = jest.fn(); // Mock console.log to verify error logging

    const bodySchema = z.object({ name: z.string() });

    mockRequest.json.mockResolvedValue({});

    const route = defineRoute({
      operationId: "postExample",
      method: "POST",
      summary: "Create Example",
      description: "Creates example data",
      tags: ["example"],
      requestBody: bodySchema,
      action: mockAction,
      responses: {
        201: { description: "Created" },
      },
    });

    const nextJsRouteHandler = route.POST;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, {});

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(400);

    expect(console.log).toHaveBeenCalled();
    console.log = originalLog; // Restore original console.log
  });

  it("should return 400 on bad request (invalid form body)", async () => {
    const originalLog = console.log;
    console.log = jest.fn(); // Mock console.log to verify error logging

    const invalidFormData = new FormData();
    mockRequest.formData.mockResolvedValue(invalidFormData);

    const route = defineRoute({
      operationId: "uploadFile",
      method: "PUT",
      summary: "Upload a file",
      description: "Uploads a file to the storage service",
      tags: ["Upload"],
      requestBody: z.object({
        file: z.instanceof(File).describe("File object to be uploaded"),
      }),
      hasFormData: true,
      action: mockAction,
      responses: {
        201: { description: "File uploaded successfully" },
      },
    });

    const nextJsRouteHandler = route.PUT;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, {});

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(400);
    expect(console.log).toHaveBeenCalled();
    console.log = originalLog; // Restore original console.log
  });

  it("should return 500 on internal server error", async () => {
    const route = defineRoute({
      operationId: "getExample",
      method: "GET",
      summary: "Get Example",
      description: "Fetches example data",
      tags: ["example"],
      action: () => {
        throw new Error("Internal Error");
      },
      responses: {
        200: { description: "OK" },
      },
    });

    const nextJsRouteHandler = route.GET;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, {});

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
  });

  it("should return 404 when pathParams are missing", async () => {
    const originalLog = console.log;
    console.log = jest.fn();

    const pathSchema = z.object({ id: z.string() });

    const route = defineRoute({
      operationId: "getExample",
      method: "GET",
      summary: "Get Example",
      description: "Fetches example data",
      tags: ["example"],
      pathParams: pathSchema,
      action: mockAction,
      responses: {
        200: { description: "OK" },
      },
    });

    const invalidParams = {} as unknown as z.infer<typeof pathSchema>;
    const nextJsRouteHandler = route.GET;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: invalidParams });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(404);
    expect(console.log).toHaveBeenCalled();
    console.log = originalLog; // Restore original console.log
  });

  it("should add 400 Bad Request response if queryParams or requestBody exists", () => {
    const queryParams = z.object({ search: z.string() });

    const route = defineRoute({
      operationId: "getExample",
      method: "GET",
      summary: "Get Example",
      description: "Fetches example data",
      tags: ["example"],
      queryParams,
      action: mockAction,
      responses: {
        200: { description: "OK" },
      },
    });

    const nextJsRouteHandler = route.GET;

    expect(nextJsRouteHandler.apiData).not.toBeUndefined();
    if (!nextJsRouteHandler.apiData) throw new Error("TEST ERROR");
    expect(nextJsRouteHandler.apiData.responses).not.toBeUndefined();
    if (!nextJsRouteHandler.apiData.responses) throw new Error("TEST ERROR");
    expect(nextJsRouteHandler.apiData.responses["400"]).toEqual({
      description: "Bad Request",
    });
  });

  it("should log a message when unnecessary pathParams are provided in non-production environments", async () => {
    const originalLog = console.log;
    console.log = jest.fn(); // Mock console.log

    const route = defineRoute({
      operationId: "getExample",
      method: "GET",
      summary: "Get Example",
      description: "Fetches example data",
      tags: ["example"],
      pathParams: z.object({ id: z.string() }),
      action: mockAction,
      responses: {
        200: { description: "OK" },
      },
    });

    const nextJsRouteHandler = route.GET;

    await nextJsRouteHandler(mockRequest as unknown as Request, {});

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("You tried to add pathParams to a route"));

    console.log = originalLog;
  });
});
