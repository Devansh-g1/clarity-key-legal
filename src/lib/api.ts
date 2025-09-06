export const apiFetch = async (path: string, options: RequestInit = {}, idToken?: string | null) => {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
  if (idToken) headers.set('Authorization', `Bearer ${idToken}`);
  const res = await fetch(`/api${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};





