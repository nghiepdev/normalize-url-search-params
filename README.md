# normalize-url-search-params

[![NPM version](https://img.shields.io/npm/v/normalize-url-search-params.svg)](https://www.npmjs.com/package/normalize-url-search-params)
[![NPM monthly download](https://img.shields.io/npm/dm/normalize-url-search-params.svg)](https://www.npmjs.com/package/normalize-url-search-params)

> Normalize a URLSearchParams

## Installation

```bash
npm install normalize-url-search-params
```

## Available Options

|      parameter      |          type           |     default     | description                                                         |
| :-----------------: | :---------------------: | :-------------: | :------------------------------------------------------------------ |
|     removeEmpty     |        `boolean`        |     `true`      | Removes params with an empty string as the value.                   |
| removeNullUndefined |        `boolean`        |     `true`      | Removes params with `null` or `undefined` as the value.             |
|   booleanAsNumber   |        `boolean`        |     `true`      | Forces the boolean value into a number is `0` or `1`.               |
|     removePage1     |        `boolean`        |     `true`      | Removes `page` param with the value is `1`.                         |
|        sort         |        `boolean`        |     `false`     | Sorts all key/value pairs, if any, by their keys.                   |
|        data         |        `Object`         |      `{}`       | A record of string keys and any values.                             |
|  removeParameters   | `Array<string\|RegExp>` | `[/^utm_\w+/i]` | Removes params that matches any of the provided strings or regexes. |

### Example:

```ts
import {normalizeUrlSearchParams} from 'normalize-url-search-params';

const {normalizeUrlSearchParams} = require('./index');

test('simple', () => {
  expect(
    normalizeUrlSearchParams('/admin/posts', {
      data: {
        page: 2,
        sort: 'created_at',
      },
    })
  ).toEqual('/admin/posts?page=2&sort=created_at');
});

test('test with booleanAsNumber', () => {
  expect(
    normalizeUrlSearchParams('/admin/posts?active=true', {
      data: {
        admin: false,
      },
      booleanAsNumber: true,
    })
  ).toEqual('/admin/posts?active=1&admin=0');
});

test('test with removePage1', () => {
  expect(
    normalizeUrlSearchParams('/admin/posts?page=2', {
      data: {
        page: 1,
      },
      removePage1: true,
    })
  ).toEqual('/admin/posts');
});

test('test with sort', () => {
  expect(
    normalizeUrlSearchParams('/admin/posts?page=2&active=true', {
      data: {
        active: false,
      },
      sort: true,
    })
  ).toEqual('/admin/posts?active=0&page=2');
});

test('test with removeParameters', () => {
  expect(
    normalizeUrlSearchParams('/admin/posts?page=2&sort=created_at&ref=123', {
      removeParameters: ['ref'],
    })
  ).toEqual('/admin/posts?page=2&sort=created_at');
});

test('test with full url', () => {
  expect(
    normalizeUrlSearchParams('http://domain.com/admin/posts?page=2', {
      data: {
        admin: true,
      },
    })
  ).toEqual('http://domain.com/admin/posts?page=2&admin=1');
});
```

## License

MIT
