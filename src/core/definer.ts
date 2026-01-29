import { customErrorTypes } from "~/types/error";
import type { HttpMethod } from "~/types/http";
import type { RouteHandler, RouteMethodHandler } from "~/types/next";
import type { FixPathParams } from "~/types/path-params";
import type { Prettify } from "~/types/prettify";
import type { ResponseCollection } from "~/types/response";
import { parseRequestBody, resolveRequestBody } from "./body";
import { resolveParams } from "./params";
import parsePathParams from "./path-params";
import { addBadRequest, bundleResponses } from "./responses";
import parseSearchParams from "./search-params";
import type { ExampleObject } from "@omer-x/openapi-types/example";
import type { OperationObject } from "@omer-x/openapi-types/operation";
import type { ZodIssue, ZodType } from "zod";

type ActionSource<PathParams, QueryParams, RequestBody> = {
  pathParams: PathParams,
  queryParams: QueryParams,
  body: RequestBody,
};

type RouteWithoutBody = {
  method: Extract<HttpMethod, "GET" | "DELETE" | "HEAD">,
  requestBody?: never,
  requestBodyExample?: never,
  requestBodyExamples?: never,
  hasFormData?: never,
};

type RouteWithBody<I, O> = {
  method: Exclude<HttpMethod, "GET" | "DELETE" | "HEAD">,
  requestBody?: ZodType<O, I> | string,
  requestBodyExample?: NoInfer<O>,
  requestBodyExamples?: Record<string, ExampleObject<NoInfer<O>>>,
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
  Req extends Request,
  Res extends Response,
  ResponseDefinitions extends Record<string, unknown>,
> = {
  operationId: string,
  method: Method,
  summary: string,
  description: string,
  tags: string[],
  pathParams?: ZodType<PathParamsOutput, PathParamsInput>,
  queryParams?: ZodType<QueryParamsOutput, QueryParamsInput>,
  action: (
    source: ActionSource<PathParamsOutput, QueryParamsOutput, RequestBodyOutput>,
    request: Req,
  ) => Res | Promise<Res>,
  responses: ResponseCollection<ResponseDefinitions>,
  handleErrors?: (
    errorType: typeof customErrorTypes[number] | "UNKNOWN_ERROR",
    issues?: ZodIssue[],
  ) => Res,
  middleware?: (
    hander: RouteMethodHandler<FixPathParams<PathParamsInput>, Req, Res>,
  ) => RouteMethodHandler<FixPathParams<PathParamsInput>, Req, Res>,
  security?: OperationObject["security"],
} & (RouteWithBody<RequestBodyInput, RequestBodyOutput> | RouteWithoutBody);

function defineRoute<
  M extends HttpMethod,
  PPI,
  PPO,
  QPI,
  QPO,
  RBI,
  RBO,
  MwReq extends Request,
  MwRes extends Response,
  ResDef extends Record<string, unknown>,
>(input: RouteOptions<
  M, PPI, PPO, QPI, QPO, RBI, RBO, MwReq, MwRes, ResDef
>): RouteHandler<M, Prettify<FixPathParams<PPI>>, MwReq, MwRes> {
  const handler: RouteMethodHandler<FixPathParams<PPI>, MwReq, MwRes> = async (request, context) => {
    try {
      const { searchParams } = new URL(request.url);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const nextSegmentParams = context ? (await context.params) as PPI : undefined;
      const pathParams = parsePathParams(nextSegmentParams, input.pathParams) as PPO;
      const queryParams = parseSearchParams(searchParams, input.queryParams) as QPO;
      const body = await parseRequestBody(request, input.method, input.requestBody, input.hasFormData) as RBO;
      return await input.action({ pathParams, queryParams, body }, request) as MwRes;
    } catch (error) {
      if (input.handleErrors) {
        if (error instanceof Error) {
          const errorMessage = error.message as typeof customErrorTypes[number];
          if (customErrorTypes.includes(errorMessage)) {
            return input.handleErrors(errorMessage, error.cause as ZodIssue[]) as MwRes;
          }
        }
        return input.handleErrors("UNKNOWN_ERROR") as MwRes;
      }
      if (error instanceof Error) {
        switch (error.message) {
          case "PARSE_FORM_DATA":
          case "PARSE_REQUEST_BODY":
          case "PARSE_SEARCH_PARAMS":
            return new Response(null, { status: 400 }) as MwRes;
          case "PARSE_PATH_PARAMS":
            return new Response(null, { status: 404 }) as MwRes;
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
      return new Response(null, { status: 500 }) as MwRes;
    }
  };

  const parameters = [
    ...resolveParams("path", input.pathParams),
    ...resolveParams("query", input.queryParams),
  ];

  const responses = bundleResponses(input.responses);
  if (!input.responses["400"]) {
    const response400 = addBadRequest(input.queryParams, input.requestBody);
    if (response400) {
      responses["400"] = response400;
    }
  }
  if (!input.responses["500"]) {
    responses["500"] = { description: "Internal Server Error" };
  }

  handler.apiData = {
    operationId: input.operationId,
    summary: input.summary,
    description: input.description,
    tags: input.tags,
    parameters: parameters.length ? parameters : undefined,
    requestBody: resolveRequestBody(input.requestBody, input.hasFormData, input.requestBodyExample, input.requestBodyExamples),
    responses: responses,
    security: input.security,
  };

  if (input.middleware) {
    const alteredHandler = input.middleware(handler);
    alteredHandler.apiData = handler.apiData;
    return { [input.method]: alteredHandler } as RouteHandler<M, FixPathParams<PPI>, MwReq, MwRes>;
  }

  return { [input.method]: handler } as RouteHandler<M, FixPathParams<PPI>, MwReq, MwRes>;
}

export default defineRoute;
