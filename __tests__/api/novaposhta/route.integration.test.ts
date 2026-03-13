/**
 * Integration tests for Nova Poshta API - calls real Nova Poshta API
 * Requires NOVA_POSHTA_API_KEY in env. Run with: NOVA_POSHTA_API_KEY=xxx npm test -- route.integration
 */

describe("Nova Poshta API Integration", () => {
  const hasApiKey = !!process.env.NOVA_POSHTA_API_KEY;
  const itOrSkip = hasApiKey ? it : it.skip;

  async function callRoute(body: Record<string, unknown>) {
    const { POST } = await import("@/app/api/novaposhta/route");
    const req = new Request("http://localhost/api/novaposhta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const res = await POST(req);
    return res.json();
  }

  itOrSkip("searchSettlements Київ returns addresses", async () => {
    const data = await callRoute({
      modelName: "Address",
      calledMethod: "searchSettlements",
      methodProperties: { CityName: "Київ", Limit: 10 },
    });
    expect(data.error).toBeUndefined();
    expect(data.data).toBeDefined();
    const addresses = Array.isArray(data.data)
      ? data.data.flatMap((item: { Addresses?: unknown[] }) => item.Addresses || [])
      : [];
    expect(addresses.length).toBeGreaterThan(0);
    const first = addresses[0] as { Ref?: string; Present?: string };
    expect(first.Ref).toBeDefined();
    expect(first.Present || (first as { Description?: string }).Description).toBeDefined();
  });

  const cities = ["Дніпро", "Львів", "Одеса", "Харків"];
  cities.forEach((cityName) => {
    itOrSkip(`searchSettlements ${cityName} returns addresses`, async () => {
      const data = await callRoute({
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: { CityName: cityName, Limit: 10 },
      });
      expect(data.error).toBeUndefined();
      const addresses = Array.isArray(data.data)
        ? data.data.flatMap((item: { Addresses?: unknown[] }) => item.Addresses || [])
        : [];
      expect(addresses.length).toBeGreaterThan(0);
    });
  });

  itOrSkip("getWarehouses returns branches and postomats for Kyiv", async () => {
    const searchRes = await callRoute({
      modelName: "Address",
      calledMethod: "searchSettlements",
      methodProperties: { CityName: "Київ", Limit: 5 },
    });
    const addresses = Array.isArray(searchRes.data)
      ? searchRes.data.flatMap((item: { Addresses?: { Ref: string }[] }) => item.Addresses || [])
      : [];
    expect(addresses.length).toBeGreaterThan(0);
    const kyivRef = (addresses[0] as { Ref: string }).Ref;

    const whRes = await callRoute({
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties: { SettlementRef: kyivRef, Page: 1, Limit: 500 },
    });
    expect(whRes.error).toBeUndefined();
    expect(Array.isArray(whRes.data)).toBe(true);
    expect(whRes.data.length).toBeGreaterThan(0);
    const first = whRes.data[0] as { Description: string; Ref: string };
    expect(first.Description).toBeDefined();
    expect(first.Ref).toBeDefined();
    const has447 = whRes.data.some((w: { Description: string }) =>
      /№\s*447|447/.test(w.Description)
    );
    expect(has447).toBe(true);
  });
});
