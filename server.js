const express = require('express');
const cors = require('cors');
const { connect } = require('./src/db');

const port = 8080;
const app = express();
connect();

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
});