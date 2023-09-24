const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db.js')
const users = require('./api/users.js');
const items = require('./api/items.js');
const notifs = require('./api/notifications.js');

const app = express();
const jsonParser = bodyParser.json();
app.use(cors());

// Users Endpoint
app.post('/users', jsonParser, async (req, res) => await users.createUser(req, res));
app.post('/users/auth', jsonParser, async (req, res) => await users.auth(req, res));
app.get('/users', async (req, res) => {
    let uuid = getUserUuid(req, res);
    if(!uuid) return;
    await users.getSelfUser(uuid, res);
});

// Items Endpoint
app.post('/items', jsonParser, async (req, res) => {
    let uuid = getUserUuid(req, res);
    if(!uuid) return;
    await items.createItem(uuid, req, res);
});
app.patch('/items/:uuid', jsonParser, async(req, res) => {
    let uuid = getUserUuid(req, res);
    if(!uuid) return;
    await items.editItem(uuid, req, res);
});
app.delete('/items/:uuid', async(req, res) => {
    let uuid = getUserUuid(req, res);
    if(!uuid) return;
    await items.deleteItem(uuid, req, res);
})
app.get('/items', async (req, res) => {
    let uuid = getUserUuid(req, res);
    if(!uuid) return;
    await items.getSelfItems(uuid, res);
});
app.get('/items/:uuid', async (req, res) => {
    let uuid = getUserUuid(req, res, false);
    await items.getItem(uuid, req, res);
});

// Notifications Endpoint
app.post('/notifications', jsonParser, async (req, res) => {
    await notifs.createNotif(req, res);
});
app.patch('/notifications/:uuid', jsonParser, async (req, res) => {
    let uuid = getUserUuid(req, res);
    if(!uuid) return;
    await notifs.editNotif(uuid, req, res);
});
app.get('/notifications', async (req, res) => {
    let uuid = getUserUuid(req, res);
    if(!uuid) return;
    await notifs.getSelfNotifs(uuid, res);
})

// Global Utils
function getUserUuid(req, res, error=true) {
    if(req.headers["authorization"] === undefined) {
        if(error) sendUnauthorized(res);
        return false;
    }

    let token = req.headers["authorization"].split(" ")[1];

    if(token === null || users.accessTokens[token] === undefined) {
        if(error) sendUnauthorized(res);
        return false;
    }

    return users.accessTokens[token];
}

function sendUnauthorized(res) {
    res.status(401).json({
        status: 401,
        error: "Unauthorized request"
    });
}

// Start REST API
const port = 9090;
app.listen(port, async () => {
    await db.init();

    console.log(`Listening on ${port}...`);
});