export function as<T>(val: unknown): T {
  return (val as unknown) as T;
}
