const __DOMAIN = 'http://this.is.a.fake.domain';

export function normalizeUrlSearchParams(
  input: string | URL,
  data: Record<string, unknown> = {}
) {
  const url = new URL(input, __DOMAIN);

  for (const [key, value] of Object.entries(data)) {
    if (value == null || value === '') {
      url.searchParams.delete(key);
      continue;
    }

    if (key === 'page' && value === 1) {
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
      url.searchParams.set(key, String(Number(value)));
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

  return url.toString().replace(__DOMAIN, '');
}
