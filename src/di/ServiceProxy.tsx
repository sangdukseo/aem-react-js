import {Cache} from '../store/Cache';
import {Locator} from './Locator';

/**
 * This class is a proxy that wraps a java object of type JsProxy.
 * The proxy put all calls into the cache.
 */
export class ServiceProxy {
  private readonly cache: Cache;
  private readonly name: string;
  private readonly locator: Locator;

  public constructor(cache: Cache, locator: Locator, name: string) {
    this.cache = cache;
    this.locator = locator;
    this.name = name;
  }

  /**
   * Call a method on the proxied object. returns the cached value if available.
   *
   * @param name of java method to call
   * @param args to java method
   * @returns {T}
   */
  public invoke<T>(method: string, ...args: any[]): T {
    const cacheKey: string = this.cache.generateServiceCacheKey(
      this.name,
      method,
      args
    );

    return this.cache.wrapServiceCall(cacheKey, () => {
      const result = this.locator().invoke(method, args);

      if (result == null) {
        return null;
      }

      return JSON.parse(result);
    });
  }

  public get<T>(name: string): T {
    const cacheKey: string = this.cache.generateServiceCacheKey(
      this.name,
      name,
      []
    );

    return this.cache.wrapServiceCall(cacheKey, () => {
      const result = this.locator().get(name);

      if (result == null) {
        return null;
      }

      return JSON.parse(result);
    });
  }

  public getObject<T extends object>(): T {
    const cacheKey: string = this.cache.generateServiceCacheKey(
      this.name,
      '',
      []
    );

    return this.cache.wrapServiceCall(cacheKey, () => {
      const result = this.locator().getObject();

      if (result == null) {
        return null;
      }

      return JSON.parse(result);
    });
  }
}