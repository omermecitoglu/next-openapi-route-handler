export function serializeArray(value: string[]) {
  return value.join(",");
}

export function deserializeArray(value: string) {
  if (!value.length) return [];
  return value.split(",");
}
