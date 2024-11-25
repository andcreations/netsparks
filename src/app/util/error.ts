/** */
export function errorToString(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}