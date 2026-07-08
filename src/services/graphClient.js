const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

/**
 * Thin Microsoft Graph fetch wrapper. `getAccessToken` is supplied by AuthProvider
 * and must return a valid bearer token (it silently refreshes as needed).
 */
export function createGraphClient(getAccessToken) {
  async function request(path, options = {}) {
    const token = await getAccessToken();
    const res = await fetch(`${GRAPH_BASE}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Graph ${options.method || 'GET'} ${path} → ${res.status}: ${body}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async function getAllPages(path) {
    let items = [];
    let next = path;
    while (next) {
      const page = await request(next.startsWith('http') ? next.replace(GRAPH_BASE, '') : next);
      items = items.concat(page.value || []);
      next = page['@odata.nextLink'] || null;
    }
    return items;
  }

  return { request, getAllPages };
}
