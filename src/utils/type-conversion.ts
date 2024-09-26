import { deserializeArray } from "./array-serialization";
import { getTrueBoolean } from "./boolean";

export function convertStringToNumber(input: Record<string, unknown>, keys: string[]) {
  return keys.reduce((mutation, key) => {
    return { ...mutation, [key]: parseFloat(mutation[key] as string) } as Record<string, unknown>;
  }, input);
}

export function convertStringToBoolean(input: Record<string, unknown>, keys: string[]) {
  return keys.reduce((mutation, key) => {
    return { ...mutation, [key]: getTrueBoolean(mutation[key] as string) } as Record<string, unknown>;
  }, input);
}

export function convertStringToArray(input: Record<string, unknown>, keys: string[]) {
  return keys.reduce((mutation, key) => {
    return { ...mutation, [key]: deserializeArray(mutation[key] as string) } as Record<string, unknown>;
  }, input);
}
