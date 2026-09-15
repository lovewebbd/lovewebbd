async function test() {
    const payload = {
        action: 'insert',
        table: 'User_Information',
        data: [{
            full_name: 'Test User',
            username: 'testuser123',
            email: 'test@example.com',
            phone: '01711111111',
            password: 'encodedpassword',
            created_at: new Date().toISOString()
        }]
    };
    try {
        const res = await fetch('http://localhost:3000/api/db-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log(await res.json());
    } catch(e) {
        console.error(e);
    }
}
test();
