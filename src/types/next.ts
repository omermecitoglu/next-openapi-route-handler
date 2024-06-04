import type { HttpMethod } from "./http";
import type { FixedRequest } from "./request";
import type { OperationObject } from "@omer-x/openapi-types/operation";

type RouteHandlerProps<PathParams> = {
  params?: PathParams,
};

export type RouteMethodHandler<RequestBody, PathParams> = ((
  request: FixedRequest<RequestBody>,
  props: RouteHandlerProps<PathParams>
) => Promise<Response>) & {
  apiData?: OperationObject,
};

export type RouteHandler<HM extends HttpMethod, RequestBody, PathParams> = {
  [key in HM]: RouteMethodHandler<RequestBody, PathParams>;
};
