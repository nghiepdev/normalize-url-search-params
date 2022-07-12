const __DOMAIN = 'http://this.is.a.fake.domain';

function testParameter(name: string, filters: (string | RegExp)[]) {
  return filters.some(filter =>
    filter instanceof RegExp ? filter.test(name) : filter === name
  );
}

export interface Options {
  /**
   Removes params with an empty string as the value.
   @default true

   @example
   ```
   normalizeUrlSearchParams('/admin/posts?empty', {page: 2}, {removeEmpty: true});
   //=> '/admin/posts?page=2'
   ```
   */
  removeEmpty?: boolean;

  /**
   Removes params with null or undefined as the value.
   @default true

   @example
   ```
   normalizeUrlSearchParams('/admin/posts', {page: 3, sort: null}, {removeNullUndefined: true});
   //=> '/admin/posts?page=3'
   ```
   */
  removeNullUndefined?: boolean;

  /**
   Forces the boolean value into a number 0 or 1.
   @default true

   @example
   ```
   normalizeUrlSearchParams('/admin/posts', {active: true});
   //=> '/admin/posts?active=1'

  normalizeUrlSearchParams('/admin/posts', {active: true}, {booleanAsNumber: false});
   //=> '/admin/posts?active=true'
   ```
   */
  booleanAsNumber?: boolean;

  /**
   Removes `page` param with {page: 1}
   @default true

   @example
   ```
   normalizeUrlSearchParams('/admin/posts?page=2', {page: 1}, {removePage1: true});
   //=> '/admin/posts'
   ```
   */
  removePage1?: boolean;

  /**
    Sorts all key/value pairs, if any, by their keys.

    @default false

    @example
    ```
    normalizeUrlSearchParams('/admin/posts', {page: 2, active: true}, {sort: true});
    //=> '/admin/posts?active=1&page=2'
    ```
   */
  sort?: boolean;

  /**
   A record of string keys and any values.

   @default {}
   */
  data?: Record<string, unknown>;

  /**
    Removes params that matches any of the provided strings or regexes.
   
    @default [/^utm_\w+/i]
    
    @example
    ```
    normalizeUrlSearchParams('/admin/posts?foo=bar&ref=test_ref', {
      removeParameters: ['ref']
    });
    //=> '/admin/posts/?foo=bar'
    ```
   */
  removeParameters: (string | RegExp)[];
}

export function normalizeUrlSearchParams(
  input: string | URL,
  options?: Options
) {
  const removeEmpty = options?.removeEmpty ?? true;
  const removeNullUndefined = options?.removeNullUndefined ?? true;
  const booleanAsNumber = options?.booleanAsNumber ?? true;
  const removePage1 = options?.removePage1 ?? false;
  const shouldSort = options?.sort ?? false;
  const data = options?.data ?? {};
  const removeParameters = options?.removeParameters ?? [/^utm_\w+/i];

  const url = new URL(input, __DOMAIN);

  const shouldNormalize = booleanAsNumber || removeParameters.length;

  for (const [key, value] of Object.entries(data)) {
    if (removeEmpty && value === '') {
      url.searchParams.delete(key);
      continue;
    }

    if (removeNullUndefined && value == null) {
      url.searchParams.delete(key);
      continue;
    }

    if (removePage1 && key === 'page' && value === 1) {
      url.searchParams.delete(key);
      continue;
    }

    if (typeof value === 'number') {
      if (Number.isFinite(value)) {
        url.searchParams.append(key, String(value));
      } else {
        continue;
      }
    }

    if (typeof value === 'boolean') {
      url.searchParams.set(
        key,
        booleanAsNumber ? String(Number(value)) : String(value)
      );
      continue;
    }

    if (typeof value === 'string') {
      url.searchParams.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        url.searchParams.append(key, val);
      }
      continue;
    }
  }

  if (shouldNormalize) {
    for (const [key, value] of new URLSearchParams(
      url.searchParams
    ).entries()) {
      if (booleanAsNumber) {
        if (value === 'true') {
          url.searchParams.set(key, '1');
          continue;
        }

        if (value === 'false') {
          url.searchParams.set(key, '0');
          continue;
        }
      }

      if (testParameter(key, removeParameters)) {
        url.searchParams.delete(key);
      }
    }
  }

  if (shouldSort) {
    url.searchParams.sort();
  }

  return url.toString().replace(__DOMAIN, '');
}
