async function test() {
    const payload = {
        action: 'select',
        table: 'User_Information',
        filters: [
            { type: 'or', cond: 'email.eq.testuser123,username.eq.testuser123' }
        ]
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
