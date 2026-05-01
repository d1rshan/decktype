export async function onRequest(context) {
  const { request } = context;

  const backendBase = "https://decktype-be.vercel.app";

  const targetUrl = new URL(request.url);

  const proxyUrl = new URL(backendBase);
  proxyUrl.pathname = targetUrl.pathname;
  proxyUrl.search = targetUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const proxyRequest = new Request(proxyUrl.toString(), {
    method: request.method,
    headers: headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? null
        : request.body,
    redirect: "manual",
  });

  try {
    const response = await fetch(proxyRequest);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err) {
    return new Response("Proxy Error: " + err.message, {
      status: 502,
    });
  }
}
