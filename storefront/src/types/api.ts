export interface ApiServerRequest {
  method: string;
  pathname: string;
  searchParams: URLSearchParams;
  headers: Record<string, string | string[] | undefined>;
  rawBody?: string;
}

export interface ApiServerResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  details?: unknown;
  timestamp: string;
}
