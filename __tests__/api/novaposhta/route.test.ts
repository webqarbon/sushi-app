/**
 * Unit tests for Nova Poshta API route
 */

const MOCK_API_KEY = "test-api-key-12345";

const mockFetch = jest.fn();

describe("POST /api/novaposhta", () => {
  beforeEach(() => {
    jest.resetModules();
    mockFetch.mockReset();
    (global as unknown as { fetch: typeof fetch }).fetch = mockFetch;
    process.env.NOVA_POSHTA_API_KEY = MOCK_API_KEY;
  });

  afterEach(() => {
    delete process.env.NOVA_POSHTA_API_KEY;
  });

  async function callRoute(body: Record<string, unknown>) {
    const { POST } = await import("@/app/api/novaposhta/route");
    const req = new Request("http://localhost/api/novaposhta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return POST(req);
  }

  it("returns 500 when NOVA_POSHTA_API_KEY is not configured", async () => {
    delete process.env.NOVA_POSHTA_API_KEY;
    const { POST } = await import("@/app/api/novaposhta/route");
    const req = new Request("http://localhost/api/novaposhta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: { CityName: "Київ", Limit: 10 },
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("returns 400 for invalid modelName", async () => {
    const res = await callRoute({
      modelName: "InvalidModel",
      calledMethod: "searchSettlements",
      methodProperties: {},
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid calledMethod", async () => {
    const res = await callRoute({
      modelName: "Address",
      calledMethod: "invalidMethod",
      methodProperties: {},
    });
    expect(res.status).toBe(400);
  });

  it("searchSettlements: forwards request to Nova Poshta with sanitized props", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    const res = await callRoute({
      modelName: "Address",
      calledMethod: "searchSettlements",
      methodProperties: {
        CityName: "Київ",
        Limit: 50,
      },
    });

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.novaposhta.ua/v2.0/json/",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.modelName).toBe("Address");
    expect(callBody.calledMethod).toBe("searchSettlements");
    expect(callBody.methodProperties.CityName).toBe("Київ");
    expect(callBody.methodProperties.Limit).toBe(50);
    expect(callBody.apiKey).toBe(MOCK_API_KEY);
  });

  it("getWarehouses: maps SettlementRef to CityRef when CityRef is empty", async () => {
    const settlementRef = "eb94d822-0ac4-11e4-8c21-0050568002cf";
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [{ Ref: "1", Description: "Відділення №1" }] }),
    });

    const res = await callRoute({
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties: {
        SettlementRef: settlementRef,
        Page: 1,
        Limit: 500,
      },
    });

    expect(res.status).toBe(200);
    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.methodProperties.CityRef).toBe(settlementRef);
    expect(callBody.methodProperties.SettlementRef).toBe(settlementRef);
  });

  it("getWarehouses: keeps CityRef when provided", async () => {
    const cityRef = "existing-city-ref";
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    await callRoute({
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityRef: cityRef,
        Page: 1,
        Limit: 100,
      },
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.methodProperties.CityRef).toBe(cityRef);
  });

  it("returns 400 when Nova Poshta API returns success: false", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        errors: ["Invalid CityRef"],
      }),
    });

    const res = await callRoute({
      modelName: "Address",
      calledMethod: "searchSettlements",
      methodProperties: { CityName: "xxx", Limit: 10 },
    });

    expect(res.status).toBe(400);
  });

  it("returns 500 when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const res = await callRoute({
      modelName: "Address",
      calledMethod: "searchSettlements",
      methodProperties: { CityName: "Київ", Limit: 10 },
    });

    expect(res.status).toBe(500);
  });
});
