import type { HttpMethod } from "./http";
import type { OperationObject } from "@omer-x/openapi-types/operation";

type RouteHandlerProps<PathParams> = {
  params?: PathParams,
};

export type RouteMethodHandler<PathParamsInput> = ((
  request: Request,
  props: RouteHandlerProps<PathParamsInput>
) => Promise<Response>) & {
  apiData?: OperationObject,
};

export type RouteHandler<HM extends HttpMethod, PathParamsInput> = {
  [key in HM]: RouteMethodHandler<PathParamsInput>;
};
