async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/generate-page-descriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: "restaurant", packageType: "Regular", requiredPages: 3, optionalPages: 1 })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
test();
