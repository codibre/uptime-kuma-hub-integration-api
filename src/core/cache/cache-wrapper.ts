export abstract class CacheWrapper {
  abstract get<T>(key: string, cb: () => Promise<T>): Promise<T>;
}
