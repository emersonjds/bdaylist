export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new HttpError(res.status, (errBody as { message: string }).message);
  }
  return res.json() as Promise<T>;
}

export async function apiSend<T>(
  path: string,
  options: { method: string; body?: unknown },
): Promise<T> {
  const { method, body } = options;
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new HttpError(res.status, (errBody as { message: string }).message);
  }
  return res.json() as Promise<T>;
}
