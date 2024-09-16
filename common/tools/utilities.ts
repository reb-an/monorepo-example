import { Params } from "../interfaces/general";

export const buildFullPath = (basePath: string, query?: Params) => {
  let fullPath = basePath;

  const addedProps: string[] = [];

  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      // FIXME: Could be simplified / Was adapted for specific need
      // useful to handle request queries that have nested objects or arrays
      addedProps.push(
        convertObjectParam(query[key], key)
          .map((pair) => pair.join("="))
          .join("&")
      );
    }
  }

  if (addedProps.length > 0) {
    fullPath += `?${addedProps.join("&")}`;
  }

  return fullPath;
};

/**
 * Extract simplified data from request queries
 * @param obj
 * @param parentKey
 * @returns
 */
export const convertObjectParam = (
  obj: any,
  parentKey?: string
): string[][] => {
  if (obj.constructor.toString().indexOf("Array") != -1) {
    return obj.map((arr: string[]) => [parentKey, arr.join(":")]);
  } else if (typeof obj === "object") {
    return Object.entries(obj).map(([key, value]) =>
      recursiveKeyStringify(value, [parentKey, key].join("."))
    );
  }
  return [[parentKey, obj]];
};

/**
 * Simplify nested objects in queries
 * @param obj
 * @param parentKey
 * @param lvl
 * @returns
 */
export const recursiveKeyStringify = (
  obj: any,
  parentKey: string,
  lvl: number = 0
): string[] => {
  if (
    typeof obj === "object" &&
    obj.constructor.toString().indexOf("Array") === -1
  ) {
    const result = Object.entries(obj)
      .map(([key, value]) =>
        recursiveKeyStringify(value, [parentKey, key].join("."), lvl++)
      )
      .flat();

    return result;
  }
  return [parentKey, obj];
};

export const isEmpty = (value: any): boolean => {
  if (typeof value === "undefined" || value === undefined || value === null)
    return true;
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return false;
};
