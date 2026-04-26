const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    // Try to parse error as JSON first
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await res.json();
      // Throw the error message from the JSON response
      throw new Error(errorData.error || 'Request failed');
    } else {
      const errorText = await res.text();
      throw new Error(errorText || res.statusText);
    }
  }

  // Handle empty responses
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return {} as T;
}
