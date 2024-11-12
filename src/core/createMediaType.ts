import type { Entry } from "~/types/entry";
import type { MediaTypeObject } from "@omer-x/openapi-types/media-type";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export default function createMediaType(
  schema: SchemaObject,
  example?: MediaTypeObject["example"],
  examples?: MediaTypeObject["examples"],
) {
  const mediaTypeEntries = [] as Entry<MediaTypeObject>[];
  mediaTypeEntries.push(["schema", schema]);
  if (example) {
    mediaTypeEntries.push(["example", example]);
  }
  if (examples) {
    mediaTypeEntries.push(["examples", examples]);
  }
  return Object.fromEntries(mediaTypeEntries) as MediaTypeObject;
}
