const axios = require('axios');

const router = require("express").Router();
require('dotenv').config();

var data = new Map();

router.put("/", async (req, res) => {
    // console.log(req.query.key)
    if (process.env.FORWARDING_ADDRESS) {
        try {
            k = req.body.key
            v = req.body.val
            const forward = await axios({
                method: 'put',
                url: `http://${process.env.FORWARDING_ADDRESS}/kvs`,
                data: {
                    "key": k,
                    "val": v
                },
                timeout: 10000
            })
            res.status(forward.status).json(forward.data)
        } catch (err) {
            if (err.response && (err.response.status == 404 || err.response.status == 400)) {
                res.status(err.response.status).json(err.response.data)
            } else {
                res.status(503).json({ "error": "upstream down", "upstream": process.env.FORWARDING_ADDRESS })
            }
        }
    } else {
        try {
            k = req.body.key
            v = req.body.val
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
        } catch (err) {
            res.status(err.response.status).json(err.response.data)
        }
    }
})

router.get("/", async (req, res) => {
    if (process.env.FORWARDING_ADDRESS) {
        try {
            k = req.body.key
            const forward = await axios({
                method: 'get',
                url: `http://${process.env.FORWARDING_ADDRESS}/kvs`,
                data: {
                    "key": k
                },
                timeout: 10000
            })
            res.status(forward.status).json(forward.data)
        } catch (err) {
            // console.log("2. forwarding error")
            // console.log(err)
            // console.log(err.response)
            // console.log(err.response.status)
            // console.log(err.response.data)
            if (err.response && (err.response.status == 404 || err.response.status == 400)) {
                res.status(err.response.status).json(err.response.data)
            } else {
                res.status(503).json({ "error": "upstream down", "upstream": process.env.FORWARDING_ADDRESS })
            }
        }
    } else {
        try {
            k = req.body.key
            if (k == undefined) {
                res.status(400).json({ "error": "bad GET" })
            } else if (data.has(k)) {
                res.status(200).json({ "val": data.get(k) })
            } else {
                // console.log("1: 404 error")
                res.status(404).json({ "error": "not found" })
            }
        } catch (err) {
            // res.status(500).json(err);
            // res.status(503).json({"error": "upstream down", "upstream": process.env.FORWARDING_ADDRESS})
            // console.log("3, not good. somehow erroring when key finding")
            res.status(err.response.status).json(err.response.data)
            // res.status(503).json({"error": "upstream down"})
        }
    }
})

router.delete("/", async (req, res) => {
    if (process.env.FORWARDING_ADDRESS) {
        try {
            k = req.body.key
            // console.log(k)
            const forward = await axios({
                method: 'delete',
                url: `http://${process.env.FORWARDING_ADDRESS}/kvs`,
                data: {
                    "key": k
                },
                timeout: 10000
            })
            res.status(forward.status).json(forward.data)
        } catch (err) {
            if (err.response && (err.response.status == 404 || err.response.status == 400)) {
                res.status(err.response.status).json(err.response.data)
            } else {
                res.status(503).json({ "error": "upstream down", "upstream": process.env.FORWARDING_ADDRESS })
            }
        }
    } else {
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
            res.status(err.response.status).json(err.response.data)
        }
    }
})

module.exports = router