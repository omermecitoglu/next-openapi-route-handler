import type { HttpMethod } from "./http";
import type { OperationObject } from "@omer-x/openapi-types/operation";

type RouteHandlerContext<PathParams> = {
  params: PathParams,
};

export type RouteMethodHandler<PathParamsInput, Req, Res> = ((
  request: Req,
  context?: RouteHandlerContext<PathParamsInput>
) => Promise<Res>) & {
  apiData?: OperationObject,
};

export type RouteHandler<
  HM extends HttpMethod,
  PathParamsInput,
  Req,
  Res,
> = Record<
  HM,
  RouteMethodHandler<PathParamsInput, Req, Res>
>;
