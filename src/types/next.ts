import type { HttpMethod } from "./http";
import type { OperationObject } from "@omer-x/openapi-types/operation";

type RouteHandlerContext<PathParams extends Record<string, string>> = {
  params: Promise<PathParams>,
};

export type RouteMethodHandler<PathParamsInput extends Record<string, string>, Req, Res> = ((
  request: Req,
  context: RouteHandlerContext<PathParamsInput>,
) => Promise<Res>) & {
  apiData?: OperationObject,
};

export type RouteHandler<
  HM extends HttpMethod,
  PathParamsInput extends Record<string, string>,
  Req,
  Res,
> = Record<
  HM,
  RouteMethodHandler<PathParamsInput, Req, Res>
>;
