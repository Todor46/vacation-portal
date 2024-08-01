/**
 * Singleton Server-Side Pattern.
 */
export function singleton<Value>(name: string, value: () => Value): Value {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalStore = global as any;

  globalStore.__singletons ??= {};
  globalStore.__singletons[name] ??= value();

  return globalStore.__singletons[name];
}

// How to make a generic optional?
export type Maybe<T> = T | null | undefined;
export type SuccessResponse<T> = {
  success: true;
  data?: T;
};

export type ErrorResponse = {
  success: false;
  message: string;
};

export type Response<T> = SuccessResponse<T> | ErrorResponse;
