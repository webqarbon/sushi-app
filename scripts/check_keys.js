
const fs = require('fs');
const path = require('path');

// Basic manual parsing of .env.local since dotenv is not available
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.trim().match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

async function checkNP() {
  console.log('--- Checking Nova Poshta ---');
  const key = env.NOVA_POSHTA_API_KEY;
  if (!key) { console.log('NP Key missing'); return; }
  
  try {
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: key,
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: { CityName: "Київ", Limit: 1 }
      }),
    });
    const data = await res.json();
    console.log('NP Status:', data.success ? 'OK' : 'FAIL');
    if (!data.success) console.log('NP Errors:', data.errors);
  } catch (e) {
    console.log('NP Request Failed:', e.message);
  }
}

async function checkMono() {
  console.log('--- Checking MonoBank ---');
  const key = env.MONOBANK_API_KEY;
  if (!key) { console.log('Mono Key missing'); return; }
  
  try {
    const res = await fetch("https://api.monobank.ua/api/merchant/invoice/create", {
      method: "POST",
      headers: { 
        "X-Token": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 100,
        ccy: 980,
        merchantPaymInfo: { reference: "test", destination: "test" }
      }),
    });
    const text = await res.text();
    console.log('Mono Status:', res.status);
    console.log('Mono Body:', text);
  } catch (e) {
    console.log('Mono Request Failed:', e.message);
  }
}

(async () => {
  await checkNP();
  await checkMono();
})();
