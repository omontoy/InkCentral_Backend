const express = require('express');
const cors = require('cors');
const { connect } = require('./src/db');
const artistRouter = require('./src/routes/artist')
const clientRouter = require('./src/routes/client')

const port = 8000;
const app = express();
connect();
app.use(express.json())
app.use(cors())


app.use('/artists', artistRouter);
app.use('/clients', clientRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
});
