import type { HttpMethod } from "./http";
import type { OperationObject } from "@omer-x/openapi-types/operation";

type RouteHandlerProps<PathParams> = {
  params?: PathParams,
};

export type RouteMethodHandler<PathParams> = ((
  request: Request,
  props: RouteHandlerProps<PathParams>
) => Promise<Response>) & {
  apiData?: OperationObject,
};

export type RouteHandler<HM extends HttpMethod, PathParams> = {
  [key in HM]: RouteMethodHandler<PathParams>;
};
