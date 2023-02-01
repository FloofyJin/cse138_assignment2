const axios = require('axios');

const router = require("express").Router();
require('dotenv').config();

var data = new Map();

router.put("/", async (req, res) => {
    try {
        k = req.body.key
        v = req.body.val
        // console.log(req.query.key)
        if (process.env.FORWARDING_ADDRESS) {
            console.log("forwardin..."+process.env.FORWARDING_ADDRESS)
            try{
                const forward = await axios( {
                    method: 'put',
                    url: `http://${process.env.FORWARDING_ADDRESS}`,
                    data: {
                        key: k,
                        val: v
                    }
                })
                res.status(forward.status).json(forward.data)
            }catch(err){
                console.log("forwarding error")
                console.log(err)
                res.status(500).json(err)
            }
        } else {
            if (k == undefined || v == undefined) {
                res.status(400).json({ "error": "bad PUT" })
            } else if (k.length > 200 || v.length > 200) {
                res.status(400).json({ "error": "key or val too long" })
            } else if (data.has(k)) {
                let prev = data.get(k)
                data.set(k, v)
                res.status(200).json({ "replaced": true, "prev": prev })
            } else {
                data.set(k, v)
                res.status(201).json({ "replaced": false })
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/", async (req, res) => {
    try {
        if (process.env.FORWARDING_ADDRESS) {
            try{
                const forward = await axios( {
                    method: 'get',
                    url: process.env.FORWARDING_ADDRESS,
                    data: {
                        key: k
                    }
                })
                res.status(forward.status).json(forward.data)
            }catch(err){
                console.log("forwarding error")
                res.status(500).json(err)
            }
        } else {
            k = req.body.key
            if (k == undefined) {
                res.status(400).json({ "error": "bad GET" })
            } else if (data.has(k)) {
                res.status(200).json({ "val": data.get(k) })
            } else {
                res.status(404).json({ "error": "not found" })
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete("/", async (req, res) => {
    try {
        k = req.body.key
        if (k == undefined) {
            res.status(400).json({ "error": "bad DELETE" })
        } else if (data.has(k)) {
            prev = data.get(k)
            data.delete(k)
            res.status(200).json({ "prev": prev })
        } else {
            res.status(404).json({ "error": "not found" })
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router