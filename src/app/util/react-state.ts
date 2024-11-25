export function ifDefined<T>(values: { [key in keyof T]?: any }): object {
  const result = {};
  Object.keys(values).forEach(key => {
    const value = values[key];
    if (value !== undefined) {
      result[key] = value;
    }
  })
  return result;
}