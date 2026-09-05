import WebSocket from 'ws';
const ws = new WebSocket('ws://localhost:3000/live');
ws.on('open', () => {
    console.log('connected');
    setTimeout(() => { ws.close(); process.exit(0); }, 1000);
});
ws.on('error', (err) => {
    console.error('error', err);
    process.exit(1);
});
