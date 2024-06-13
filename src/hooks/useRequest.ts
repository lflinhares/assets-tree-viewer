import { useState } from "react";

export function useRequest<T>() {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function request(
    url: string,
    method = "GET",
    body?: null | string,
    headers?: any
  ) {
    try {
      if (body) {
        body = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
      }
      setLoading(true);
      const response = await fetch(url, { method, body, headers });
      const data: T = await response.json();

      setData(data);
      setLoading(false);
      return data;
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }

  return { data, loading, error, request };
}
