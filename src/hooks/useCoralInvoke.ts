import { useState, useCallback } from 'react';

interface CoralInvokeOptions {
  timeout?: number;
}

interface CoralInvokeResult {
  data?: any;
  error?: string;
  source?: string;
}

export function useCoralInvoke() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invoke = useCallback(async (
    agentId: string, 
    params: any = {}, 
    options: CoralInvokeOptions = {}
  ): Promise<CoralInvokeResult> => {
    setLoading(true);
    setError(null);

    try {
      const timeout = options.timeout || 10000; // 10 second default timeout
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Try direct backend call first (since Netlify dev is not running)
      console.log(`Calling agent: ${agentId} with params:`, params);
      const backendUrl = `http://127.0.0.1:8001/tools/${agentId}`;
      console.log(`Backend URL: ${backendUrl}`);
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setLoading(false);
      return {
        data: data,
        source: 'coral-api'
      };

    } catch (err) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      console.error(`Coral invoke error for agent ${agentId}:`, err);
      
      return {
        error: errorMessage,
        source: 'error'
      };
    }
  }, []);

  return {
    invoke,
    loading,
    error
  };
}
