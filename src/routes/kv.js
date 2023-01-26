const router = require("express").Router();

var data = new Map();

router.put("/", async(req, res) =>{
    try{
        k = req.body.key
        v = req.body.val
        if(k == undefined || v == undefined){
            res.status(400).json({"error": "bad PUT"})
        }
        if(k.length > 200 || v.length > 200){
            res.status(400).json({"error": "key or val too long"})
        }
        if(data.has(k)){
            let prev = data.get(k)
            data.set(k,v)
            res.status(200).json({"replaced": true, "prev": prev})
        }else{
            data.set(k,v)
            res.status(200).json({"replaced": false})
        }
    }catch(err){
        res.status(500).json(err);
    }
})

router.get("/", async(req, res) =>{
    try{
        k = req.body.key
        if(k == undefined){
            res.status(400).json({"error": "bad GET"})
        }
        if(data.has(k)){
            res.status(200).json({"val": data.get(k)})
        }else{
            res.status(200).json({"error": "not found"})
        }
    }catch(err){
        res.status(500).json(err);
    }
})

router.delete("/", async(req, res) =>{
    try{
        k = req.body.key
        if(k == undefined){
            res.status(400).json({"error": "bad DELETE"})
        }
        if(data.has(k)){
            prev = data.get(k)
            data.delete(k)
            res.status(200).json({"prev": prev})
        }else{
            res.status(200).json({"error": "not found"})
        }
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router