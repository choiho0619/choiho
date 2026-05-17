export async function onRequest(context) {
  const { env, request } = context;
  if (!env.VISITOR_KV) {
    return new Response(JSON.stringify({ value: 0 }), {
      headers: { "content-type": "application/json" }
    });
  }

  const url = new URL(request.url);
  const readonly = url.searchParams.get("readonly") === "true";
  const current = parseInt(await env.VISITOR_KV.get("main_count") || "0", 10);

  if (readonly) {
    return new Response(JSON.stringify({ value: current }), {
      headers: { "content-type": "application/json" }
    });
  }

  const nextValue = current + 1;
  await env.VISITOR_KV.put("main_count", nextValue.toString());
  return new Response(JSON.stringify({ value: nextValue }), {
    headers: { "content-type": "application/json" }
  });
}
