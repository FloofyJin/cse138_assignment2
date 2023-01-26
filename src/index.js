const app = require('express')();
var bodyParser = require('body-parser') 
const port = process.env.PORT || 13800;
const kvRoute = require("./routes/kv")
const cors = require("cors")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res ) => 
    res.json({ message: 'Docker is easy 🐳' }) 
);

app.use("/kv", kvRoute)

app.listen(port, ()=> {
    console.log(`app listening on http://localhost:${port}`)
});