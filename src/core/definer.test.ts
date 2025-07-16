import { afterEach, describe, expect, it, vi } from "vitest";
import z from "zod";
import type { RouteMethodHandler } from "~/types/next";
import defineRoute from "./definer";

describe("defineRoute", () => {
  const mockAction = vi.fn();
  const mockRequest = {
    url: "https://example.com/test",
    json: vi.fn(),
    formData: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
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
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve({}) });

    expect(mockAction).toHaveBeenCalledWith({
      pathParams: null,
      queryParams: null,
      body: null,
    }, mockRequest);

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
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve({ id: "123" }) });

    expect(mockAction).toHaveBeenCalledWith({
      pathParams: { id: "123" },
      queryParams: null,
      body: { name: "Test" },
    }, mockRequest);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(201);
  });

  it("should return 400 on bad request (invalid body)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { /* do nothing */ });

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
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve({}) });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(400);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should return 400 on bad request (invalid form body)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { /* do nothing */ });

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
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve({}) });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(400);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should return 500 on internal server error", async () => {
    const route = defineRoute({
      operationId: "getExample",
      method: "GET",
      summary: "Get Example",
      description: "Fetches example data",
      tags: ["example"],
      action: () => {
        // eslint-disable-next-line no-constant-condition
        if (1 + 1 === 2) {
          throw new Error("Internal Error");
        }
        return Response.json({ message: "Internal Error" }, { status: 500 });
      },
      responses: {
        200: { description: "OK" },
      },
    });

    const nextJsRouteHandler = route.GET;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve({}) });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
  });

  it("should return 404 when pathParams are missing", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { /* do nothing */ });

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
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve(invalidParams) });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(404);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
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
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { /* do nothing */ });

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

    const fakeContext = { params: Promise.resolve(undefined as unknown as { id: string }) };
    await nextJsRouteHandler(mockRequest as unknown as Request, fakeContext);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("You tried to add pathParams to a route"));
    consoleSpy.mockRestore();
  });

  it("should use custom error handler correctly for an expected error", async () => {
    mockRequest.json.mockRejectedValue(new SyntaxError("Unexpected end of JSON input"));

    const route = defineRoute({
      operationId: "postExample",
      method: "POST",
      summary: "Post Example",
      description: "Posts example data",
      tags: ["example"],
      requestBody: z.object({ name: z.string() }),
      action: mockAction,
      responses: {
        200: { description: "OK" },
        418: { description: "I'm a teapot" },
      },
      handleErrors: (_errorType, _cause) => {
        return new Response("I'm a teapot", { status: 418 });
      },
    });

    const nextJsRouteHandler = route.POST;

    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve({}) });
    const bodyText = await response.text();

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(418);
    expect(bodyText).toBe("I'm a teapot");
  });

  it("should use custom error handler correctly for an unexpected error", async () => {
    const route = defineRoute({
      operationId: "getExample",
      method: "GET",
      summary: "Get Example",
      description: "Fetches example data",
      tags: ["example"],
      action: () => {
        throw new Error("Critical error");
      },
      responses: {
        200: { description: "OK" },
        418: { description: "I'm a teapot" },
        500: { description: "Backend developer is gonna get fired" },
      },
      handleErrors: (errorType, _cause) => {
        if (errorType === "UNKNOWN_ERROR") {
          return new Response("Backend developer is gonna get fired", { status: 500 });
        }
        return new Response(errorType, { status: 418 });
      },
    });

    const nextJsRouteHandler = route.GET;

    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve({}) });
    const bodyText = await response.text();

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    expect(bodyText).toBe("Backend developer is gonna get fired");
  });

  it("should apply middleware to the route handler", async () => {
    type Handler = RouteMethodHandler<unknown, Request, Response>;
    const mockMiddleware = vi.fn((handler: Handler) => async (request: Request, context: { params: Promise<unknown> }) => {
      await Promise.resolve();
      return handler(request, context);
    });

    const route = defineRoute({
      operationId: "middlewareExample",
      method: "GET",
      summary: "Middleware Example",
      description: "Example route with middleware applied",
      tags: ["example"],
      action: (source, _request) => {
        // Confirm middleware effect in action
        expect(source).toHaveProperty("pathParams", null);
        return new Response("Middleware success", { status: 200 });
      },
      responses: {
        200: { description: "OK" },
      },
      middleware: mockMiddleware,
    });

    const nextJsRouteHandler = route.GET;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve({}) });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Middleware success");
    expect(mockMiddleware).toHaveBeenCalled();
  });

  it("should handle undefined context", async () => {
    const route = defineRoute({
      operationId: "noContextExample",
      method: "GET",
      summary: "No Context Example",
      description: "Example route without context",
      tags: ["example"],
      action: mockAction,
      responses: {
        200: { description: "OK" },
      },
    });

    mockAction.mockResolvedValue(new Response("Success"));

    const nextJsRouteHandler = route.GET;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, undefined as unknown as {
      params: Promise<unknown>,
    });

    expect(mockAction).toHaveBeenCalledWith({
      pathParams: null,
      queryParams: null,
      body: null,
    }, mockRequest);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });

  it("should handle null context params", async () => {
    const route = defineRoute({
      operationId: "nullParamsExample",
      method: "GET",
      summary: "Null Params Example",
      description: "Example route with null context params",
      tags: ["example"],
      action: mockAction,
      responses: {
        200: { description: "OK" },
      },
    });

    mockAction.mockResolvedValue(new Response("Success"));

    const nextJsRouteHandler = route.GET;
    const response = await nextJsRouteHandler(mockRequest as unknown as Request, { params: Promise.resolve(null) });

    expect(mockAction).toHaveBeenCalledWith({
      pathParams: null,
      queryParams: null,
      body: null,
    }, mockRequest);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });
});
