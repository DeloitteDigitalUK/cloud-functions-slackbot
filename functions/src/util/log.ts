/* eslint-disable @typescript-eslint/no-explicit-any */
export function log(message?: any, ...optionalParams: any[]): void {
  console.log(message, optionalParams.length === 0 ? '' : optionalParams);
}

export function error(message?: any, ...optionalParams: any[]): void {
  console.error('ERROR: ' + message, optionalParams.length === 0 ? '' : optionalParams);
}

export function logErrorAndThrow(err: Error) {
  error(err);
  throw err;
}
