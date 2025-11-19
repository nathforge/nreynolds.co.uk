import { env } from "$env/dynamic/private";

import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const baseUrl = env.POPULAR_TIMES_URL;

  if (!baseUrl) {
    return new Response(JSON.stringify({ error: "URL not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const urlSearchParams = new URLSearchParams({
    address: "Nuffield gym, Barrack St, Norwich NR3 1TS",
    ttl: (5 * 60).toString(),
  });

  const url = `${baseUrl}/by-address?${urlSearchParams}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Unexpected HTTP ${res.status}` }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const data = await res.json();
    const liveActivity = data.data.current_popularity;
    return new Response(JSON.stringify(liveActivity), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.trace(err);
    return new Response(JSON.stringify({ error: "Request failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
