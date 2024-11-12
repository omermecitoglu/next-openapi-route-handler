import { customErrorTypes } from "~/types/error";
import type { HttpMethod } from "~/types/http";
import type { RouteHandler, RouteMethodHandler } from "~/types/next";
import type { ResponseCollection } from "~/types/response";
import { parseRequestBody, resolveRequestBody } from "./body";
import { resolveParams } from "./params";
import parsePathParams from "./path-params";
import { addBadRequest, bundleResponses } from "./responses";
import parseSearchParams from "./search-params";
import type { ExampleObject } from "@omer-x/openapi-types/example";
import type { OperationObject } from "@omer-x/openapi-types/operation";
import type { ZodIssue, ZodType, ZodTypeDef } from "zod";

type ActionSource<PathParams, QueryParams, RequestBody> = {
  pathParams: PathParams,
  queryParams: QueryParams,
  body: RequestBody,
};

type RouteWithoutBody = {
  method: Extract<HttpMethod, "GET" | "DELETE" | "HEAD">,
  requestBody?: undefined,
  requestBodyExample?: undefined,
  requestBodyExamples?: undefined,
  hasFormData?: boolean,
};

type RouteWithBody<I, O> = {
  method: Exclude<HttpMethod, "GET" | "DELETE" | "HEAD">,
  requestBody?: ZodType<O, ZodTypeDef, I> | string,
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
  pathParams?: ZodType<PathParamsOutput, ZodTypeDef, PathParamsInput>,
  queryParams?: ZodType<QueryParamsOutput, ZodTypeDef, QueryParamsInput>,
  action: (
    source: ActionSource<PathParamsOutput, QueryParamsOutput, RequestBodyOutput>,
    request: Req
  ) => Res | Promise<Res>,
  responses: ResponseCollection<ResponseDefinitions>,
  handleErrors?: (
    errorType: typeof customErrorTypes[number] | "UNKNOWN_ERROR",
    issues?: ZodIssue[]
  ) => Res,
  middleware?: (
    hander: RouteMethodHandler<PathParamsInput, Req, Res>
  ) => RouteMethodHandler<PathParamsInput, Req, Res>,
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
>) {
  const handler: RouteMethodHandler<PPI, MwReq, MwRes> = async (request, context) => {
    try {
      const { searchParams } = new URL(request.url);
      const pathParams = parsePathParams(context?.params, input.pathParams) as PPO;
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
    requestBody: resolveRequestBody(input.requestBody, input.hasFormData, input.requestBodyExample, input.requestBodyExamples),
    responses: responses,
    security: input.security,
  };

  if (input.middleware) {
    return { [input.method]: input.middleware(handler) } as RouteHandler<M, PPI, MwReq, MwRes>;
  }

  return { [input.method]: handler } as RouteHandler<M, PPI, MwReq, MwRes>;
}

export default defineRoute;
