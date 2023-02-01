const app = require('express')();
var bodyParser = require('body-parser') 
const port = process.env.PORT || 13800;
const kvsRoute = require("./routes/kvs")
const cors = require("cors")
// const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res ) => 
    res.json({ message: 'Docker is easy 🐳' }) 
);

app.use("/kvs", kvsRoute)

app.listen(port, ()=> {
    console.log(`app listening on http://localhost:${port}`)
    // console.log(process.env.FORWARDING_ADDRESS)
});