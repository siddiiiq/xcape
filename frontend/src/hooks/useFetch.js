import { useEffect, useState, useCallback } from "react";

/**
 * Generic data-fetching hook with loading/error/empty states baked in so
 * every page doesn't have to reimplement the same three branches.
 * `fetcher` should be a stable function (e.g. from the api/ layer) that
 * returns a promise resolving to the parsed response data.
 */
export const useFetch = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
};

export default useFetch;
