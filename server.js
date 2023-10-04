// Name: GAO QIANXI
// Class: DIT/FT/1B/06
// Admin No.: 2241434

const app = require('./controller/app');

const PORT = 8081;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server started and accessible via http://${HOST}:${PORT}`);
});