import type { HttpMethod } from "~/types/http";
import type { RouteHandler, RouteMethodHandler } from "~/types/next";
import type { ResponseDefinition } from "~/types/response";
import { parseRequestBody, resolveRequestBody } from "./body";
import { resolveParams } from "./params";
import parsePathParams from "./path-params";
import { addBadRequest, bundleResponses } from "./responses";
import parseSearchParams from "./search-params";
import type { ZodType, ZodTypeDef } from "zod";

type ActionSource<PathParams, QueryParams, RequestBody> = {
  pathParams: PathParams,
  queryParams: QueryParams,
  body: RequestBody,
};

type RouteWithoutBody = {
  method: Extract<HttpMethod, "GET" | "DELETE" | "HEAD">,
  requestBody?: null,
  hasFormData?: boolean,
};

type RouteWithBody<I, O> = {
  method: Exclude<HttpMethod, "GET" | "DELETE" | "HEAD">,
  requestBody?: ZodType<O, ZodTypeDef, I> | string,
  hasFormData?: boolean,
};

type RouteOptions<
  Method,
  PathParamsInput,
  PathParamsOutput,
  QueryParamsInput,
  QueryParamsOutput,
  RequestBodyInput,
  RequestBodyOutput,
> = {
  operationId: string,
  method: Method,
  summary: string,
  description: string,
  tags: string[],
  pathParams?: ZodType<PathParamsOutput, ZodTypeDef, PathParamsInput>,
  queryParams?: ZodType<QueryParamsOutput, ZodTypeDef, QueryParamsInput>,
  action: (source: ActionSource<PathParamsOutput, QueryParamsOutput, RequestBodyOutput>) => Response | Promise<Response>,
  responses: Record<string, ResponseDefinition>,
} & (RouteWithBody<RequestBodyInput, RequestBodyOutput> | RouteWithoutBody);

function defineRoute<M extends HttpMethod, PPI, PPO, QPI, QPO, RBI, RBO>(input: RouteOptions<M, PPI, PPO, QPI, QPO, RBI, RBO>) {
  const handler: RouteMethodHandler<PPI> = async (request, props) => {
    try {
      const { searchParams } = new URL(request.url);
      const pathParams = parsePathParams(props.params, input.pathParams) as PPO;
      const queryParams = parseSearchParams(searchParams, input.queryParams) as QPO;
      const body = await parseRequestBody(request, input.method, input.requestBody ?? undefined, input.hasFormData) as RBO;
      return await input.action({ pathParams, queryParams, body });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "PARSE_FORM_DATA":
          case "PARSE_REQUEST_BODY":
          case "PARSE_SEARCH_PARAMS":
            return new Response(null, { status: 400 });
          case "PARSE_PATH_PARAMS":
            return new Response(null, { status: 404 });
          case "UNNECESSARY_PATH_PARAMS": {
            if (process.env.NODE_ENV !== "production") {
              // eslint-disable-next-line no-console
              console.log([
                "[Next OpenAPI Route Handler]",
                "You tried to add pathParams to a route which doesn't have any dynamic params.",
                "Maybe you meant queryParams instead?",
              ].join(" "));
            }
          }
        }
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
    requestBody: resolveRequestBody(input.requestBody ?? undefined, input.hasFormData),
    responses: responses,
  };

  return { [input.method]: handler } as RouteHandler<M, PPI>;
}

export default defineRoute;
