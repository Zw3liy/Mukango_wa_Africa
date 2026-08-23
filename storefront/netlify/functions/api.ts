import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { handleApiRequest } from "../../src/server/apiRouter";

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Normalize pathname to ensure leading /api
  let pathname = event.path;
  if (pathname.startsWith("/.netlify/functions/api")) {
    pathname = pathname.replace("/.netlify/functions/api", "/api");
  }
  if (!pathname.startsWith("/api")) {
    pathname = `/api${pathname.startsWith("/") ? "" : "/"}${pathname}`;
  }

  // Parse multi-value or single query parameters
  const searchParams = new URLSearchParams();
  if (event.queryStringParameters) {
    Object.entries(event.queryStringParameters).forEach(([key, val]) => {
      if (val !== undefined) searchParams.append(key, val);
    });
  }

  let rawBody: string | undefined = undefined;
  if (event.body) {
    if (event.isBase64Encoded) {
      rawBody = Buffer.from(event.body, "base64").toString("utf-8");
    } else {
      rawBody = event.body;
    }
  }

  try {
    const response = await handleApiRequest({
      method: event.httpMethod || "GET",
      pathname,
      searchParams,
      headers: event.headers as Record<string, string | string[] | undefined>,
      rawBody,
    });

    return {
      statusCode: response.status,
      headers: response.headers,
      body: response.body,
    };
  } catch (err) {
    console.error("Netlify API serverless function execution failure:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
      body: JSON.stringify({
        error: "Internal server error executing API handler.",
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
