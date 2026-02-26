import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NOVA_POSHTA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Nova Poshta API Key not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { modelName, calledMethod, methodProperties } = body;

    const npReqBody = {
      apiKey,
      modelName,
      calledMethod,
      methodProperties: methodProperties || {},
    };

    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(npReqBody),
    });

    if (!res.ok) {
        throw new Error(`Nova Poshta API responded with status ${res.status}`);
    }

    const data = await res.json();
    
    // Pass errors from Nova Poshta back to the client if the request was "successful" but returned internal errors
    if (data.success === false) {
      console.error("Nova Poshta API error detail:", data);
      return NextResponse.json({ error: data.errors?.[0] || "Unknown Nova Poshta error" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Nova Poshta Proxy Error:", err);
    return NextResponse.json({ error: (err as Error).message || "Unknown proxy error" }, { status: 500 });
  }
}
