const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Hier speichern wir den Status (In-Memory für den Prototyp)
let dashboardData = {
    status: "Active",
    lastUpdate: new Date().toISOString(),
    tokens: {
        input: 102928,
        output: 0,
        total: 102928
    },
    tasks: [
        { time: "Mo 09:00", text: "Engelschalking Flyeralarm" },
        { time: "Mo 09:05", text: "Akkus – Botnang & Velly" }
    ]
};

const server = http.createServer((req, res) => {
    // CORS Header, damit das GitHub Dashboard zugreifen kann
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/stats' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(dashboardData));
    } else if (req.url === '/api/update' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const newData = JSON.parse(body);
                dashboardData = { ...dashboardData, ...newData, lastUpdate: new Date().toISOString() };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Clawd-Relay Dashboard Server läuft auf http://localhost:${PORT}`);
});
