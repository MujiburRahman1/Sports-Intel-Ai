// Shared types for Netlify functions

export interface NetlifyEvent {
  httpMethod: string;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  body?: string | null;
}
