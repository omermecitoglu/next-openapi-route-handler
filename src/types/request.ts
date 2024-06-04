export interface FixedRequest<RequestBody> {
  url: string,
  json: () => Promise<RequestBody>,
}
