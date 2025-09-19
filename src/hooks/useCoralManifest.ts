import { useState, useEffect, useCallback } from 'react';

interface CoralAgent {
  agent_id: string;
  agent_name: string;
  description: string;
  methods: string[];
  input_schema: Record<string, unknown>;
  http_endpoint: string;
}

interface CoralManifest {
  agents: CoralAgent[];
  version: string;
  timestamp: string;
}

export function useCoralManifest() {
  const [manifest, setManifest] = useState<CoralManifest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchManifest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/coral-manifest');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setManifest(data);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch manifest';
      setError(errorMessage);
      console.error('Coral manifest error:', err);
    }
  }, []);

  useEffect(() => {
    fetchManifest();
  }, [fetchManifest]);

  return {
    manifest,
    loading,
    error,
    refetch: fetchManifest
  };
}
