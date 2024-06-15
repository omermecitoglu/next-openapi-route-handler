export interface FixedRequest<RequestBodyInput> {
  url: string,
  json: () => Promise<RequestBodyInput>,
  formData: () => Promise<FormData>,
}
