const app = require('./app');
const port = require('./configs/key').port;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));