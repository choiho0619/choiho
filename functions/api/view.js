export async function onRequest(context) {
    const { env } = context;
    if (!env.VISITOR_KV) {
      return new Response(JSON.stringify({ value: 0 }), { 
        headers: { "content-type": "application/json" } 
      });
    }
    const current = await env.VISITOR_KV.get("main_count") || 0;
    const nextValue = parseInt(current, 10) + 1;
    await env.VISITOR_KV.put("main_count", nextValue.toString());
    return new Response(JSON.stringify({ value: nextValue }), {
      headers: { "content-type": "application/json" }
    });
  }