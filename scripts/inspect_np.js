
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.trim().match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

async function inspectNP() {
  const key = env.NOVA_POSHTA_API_KEY;
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
  console.log('NP Settlement Data Sample:', JSON.stringify(data.data[0].Addresses[0], null, 2));
}

inspectNP();
