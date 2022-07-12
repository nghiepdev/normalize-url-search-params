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
