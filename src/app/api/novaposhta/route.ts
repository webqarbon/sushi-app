import { NextResponse } from "next/server";

const ALLOWED_METHODS: Record<string, string[]> = {
  Address: ["searchSettlements", "getWarehouses"],
};

function sanitizeMethodProperties(method: string, props: Record<string, unknown>): Record<string, unknown> {
  type Transformer = (v: unknown) => unknown;
  const allowed: Record<string, Record<string, Transformer>> = {
    searchSettlements: {
      CityName: (v) => (typeof v === "string" ? v.slice(0, 200) : ""),
      Limit: (v) => Math.min(500, Math.max(1, Number(v) || 10)),
    },
    getWarehouses: {
      CityRef: (v) => (typeof v === "string" && v.length <= 50 ? v : ""),
      Page: (v) => Math.max(1, Number(v) || 1),
      Limit: (v) => Math.min(500, Math.max(1, Number(v) || 100)),
    },
  };
  const schema = allowed[method];
  if (!schema) return {};
  const out: Record<string, unknown> = {};
  for (const [key, fn] of Object.entries(schema)) {
    if (key in props) out[key] = fn(props[key]);
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NOVA_POSHTA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Nova Poshta API Key not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { modelName, calledMethod, methodProperties } = body;

    const allowed = ALLOWED_METHODS[modelName];
    if (!allowed?.includes(calledMethod)) {
      return NextResponse.json({ error: "Method not allowed" }, { status: 400 });
    }

    const safeProps = sanitizeMethodProperties(calledMethod, methodProperties || {});

    const npReqBody = {
      apiKey,
      modelName,
      calledMethod,
      methodProperties: safeProps,
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
