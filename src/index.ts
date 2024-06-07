import { type ZodType } from "zod";
import { parseRequestBody, resolveRequestBody } from "./core/body";
import { resolveParams } from "./core/params";
import { addBadRequest, bundleResponses } from "./core/responses";
import parseSearchParams from "./core/search-params";
import type { HttpMethod } from "./types/http";
import type { RouteHandler, RouteMethodHandler } from "./types/next";
import type { ResponseDefinition } from "./types/response";

type ActionSource<PathParams, QueryParams, RequestBody> = {
  pathParams: PathParams,
  queryParams: QueryParams,
  body: RequestBody,
};

type RouteWithoutBody = {
  method: Extract<HttpMethod, "GET" | "DELETE" | "HEAD">,
  requestBody?: null,
};

type RouteWithBody<Body> = {
  method: Exclude<HttpMethod, "GET" | "DELETE" | "HEAD">,
  requestBody?: ZodType<Body> | string,
};

type RouteOptions<Method, PathParams, QueryParams, RequestBody> = {
  operationId: string,
  method: Method,
  summary: string,
  description: string,
  tags: string[],
  pathParams?: ZodType<PathParams>,
  queryParams?: ZodType<QueryParams>,
  action: (source: ActionSource<PathParams, QueryParams, RequestBody>) => Response | Promise<Response>,
  responses: Record<string, ResponseDefinition>,
} & (RouteWithBody<RequestBody> | RouteWithoutBody);

export default function createRoute<M extends HttpMethod, PP, QP, RB>(input: RouteOptions<M, PP, QP, RB>) {
  const handler: RouteMethodHandler<PP> = async (request, props) => {
    try {
      const { searchParams } = new URL(request.url);
      const queryParams = parseSearchParams(searchParams, input.queryParams);
      const body = await parseRequestBody(request, input.method, input.requestBody ?? undefined);
      return await input.action({
        pathParams: (props.params ?? null) as PP,
        queryParams: queryParams as QP,
        body: body as RB,
      });
    } catch (error) {
      if (error instanceof Error && error.constructor.name === "ZodError") {
        return new Response(null, { status: 400 });
      }
      return new Response(null, { status: 500 });
    }
  };

  const parameters = [
    ...resolveParams("path", input.pathParams),
    ...resolveParams("query", input.queryParams),
  ];

  const responses = bundleResponses(input.responses);
  const response400 = addBadRequest(input.queryParams, input.requestBody);
  if (response400) {
    responses["400"] = response400;
  }
  responses["500"] = { description: "Internal Server Error" };

  handler.apiData = {
    operationId: input.operationId,
    summary: input.summary,
    description: input.description,
    tags: input.tags,
    parameters: parameters.length ? parameters : undefined,
    requestBody: resolveRequestBody(input.requestBody ?? undefined),
    responses: responses,
  };

  return { [input.method]: handler } as RouteHandler<M, PP>;
}
