import type { Entry } from "~/types/entry";
import type { MediaTypeObject } from "@omer-x/openapi-types/media-type";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export default function createMediaType(schema: SchemaObject, example?: MediaTypeObject["example"]) {
  const mediaTypeEntries = [] as Entry<MediaTypeObject>[];
  mediaTypeEntries.push(["schema", schema]);
  if (example) {
    mediaTypeEntries.push(["example", example]);
  }
  return Object.fromEntries(mediaTypeEntries) as MediaTypeObject;
}
