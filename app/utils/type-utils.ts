import Store from '@ember-data/store';
import Route from '@ember/routing/route';

export type ModelFrom<R extends Route> = Awaited<ReturnType<R['model']>>;

/**
 * A hacky workaround to distinguish between two identical types, but where one
 * is readonly and the other is not.
 * See: https://2ality.com/2025/02/mapped-types-typescript.html#detecting-if-a-property-is-read-only
 * and an open issue to make this less stupid:
 * https://github.com/microsoft/TypeScript/issues/31581
 */
export type StrictEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

export type Not<B extends boolean> = B extends true ? false : true;

/**
 * A way to tell if a property is readonly or not
 */
export type IsReadonly<
  T extends Record<string, unknown>,
  K extends keyof T,
> = Not<
  StrictEqual<
    { [_ in K]: T[K] }, // (A)
    { -readonly [_ in K]: T[K] } // (B)
  >
>;

/**
 * Get all properties of type T which have a value to which you can assign a P
 */
export type ExtractPropsOfType<T, P> = {
  [K in keyof T as P extends T[K] ? K : never]: T[K];
};
/**
 * Get all non-readonly properties of a type
 */
export type ExtractModifiable<T extends Record<string, unknown>> = {
  [K in keyof T as IsReadonly<T, K> extends false ? K : never]: T[K];
};
/**
 * Get all readonly properties of a type
 */
export type ExtractReadonly<T extends Record<string, unknown>> = {
  [K in keyof T as IsReadonly<T, K> extends true ? K : never]: T[K];
};
/**
 * Get all keys from a type T which have a value to which you can assign a P
 */
export type KeysOfType<T, P> = keyof ExtractPropsOfType<T, P>;
/**
 * Get all keys from a type T which have a value to which you can assign a P,
 * and  which are not readonly
 */
export type ModifiableKeysOfType<T, P> = keyof ExtractModifiable<
  ExtractPropsOfType<T, P>
>;

declare const _Query: Store['query'];

export type Collection<K> = Awaited<ReturnType<typeof _Query<K>>>;

export type MetaParams = {
  count: number;
  pagination: {
    first: {
      number: number;
    };
    last: {
      number: number;
    };
    prev?: {
      number: number;
    };
    next?: {
      number: number;
    };
  };
};

export function assertNever(toTest: never) {
  if (toTest) {
    console.warn(
      'Typescript expects us never to get a value here but we got:',
      toTest,
      new Error().stack,
    );
  }
}
