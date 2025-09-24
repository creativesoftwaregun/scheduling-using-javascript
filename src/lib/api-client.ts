import { ApiResponse } from "@shared/types";
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init });
  if (!res.ok) {
    try {
      const errorJson = await res.json();
      if (errorJson && typeof errorJson.error === 'string') {
        throw new Error(errorJson.error);
      }
    } catch (e) {
      // Ignore JSON parsing errors and fall through to the generic error
    }
    throw new Error(`Request failed with status ${res.status}`);
  }
  const json = await res.json() as ApiResponse<T>;
  if (json.success) {
    return json.data;
  } else {
    throw new Error(json.error);
  }
}