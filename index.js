const express = require('express');
const mongoose = require('mongoose');
const postinfo = require('./model');
const postimage = require('./postimage');
const fs = require('fs');
const path = require('path');
const app = express();
const ImagedataURI = require('image-data-uri');
const cors = require("cors");
mongoose.connect(process.env.DATABASE_URL || "mongodb+srv://bhagyashree:bhagyashree123@cluster0.tvzw1ip.mongodb.net/test").then(() => {
    postimage.find({}).then((data) => {
        if (data.length) {
            data.forEach((ele) => {
                const filepath = path.join(__dirname, '/uploads', ele.imagename)
                if (fs.existsSync(filepath)) {
                    // Do something
                }
                else {
                    ImagedataURI.outputFile(ele.imagedata, filepath).then((data) => {
                        console.log(data)
                    })
                }
            })
        }
    }).then(() => {
        app.listen(process.env.PORT || 8001, (err) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Server is Running at 8001")
            }
        })
    })
})
app.use(express.json({ limit: '10mb' }))

app.use(cors({
    origin: '*'
}));
app.use(express.static('./uploads/'))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.get("/", (req, res) => {
    res.send("InstaClone Backend By Aadesh")
})
app.post("/post", async (req, res) => {
    try {
        const { image, author, location, description } = req.body;
        let imagename = new Date().toISOString().split('.').join('').split(':').join('');
        const filepath = path.join(__dirname, '/uploads', imagename)
        console.log(filepath)
        ImagedataURI.outputFile(image, filepath).then(async (data) => {
            // console.log(data)
            imagename = data.split('/uploads/')[1];
            console.log(imagename)
            const postregister = new postimage({
                imagename: imagename, imagedata: image
            })
            const register = new postinfo({
                imagename: imagename, author, location, description, Date: new Date().toJSON().slice(0, 10), likes: Math.floor(Math.random() * 200)
            })
            const registered = await register.save();
            const postregistered = await postregister.save();
            if (registered) {
                res.status(200).send("Uploaded Successfully")
            }
        })
    }
    catch {
        res.status(400).send("an error occured while posting")
    }
})
app.get("/posts", async (req, res) => {
    try {
        const data = await postinfo.find({})
        res.status(200).send(data)
    }
    catch {
        res.status(400).send("an error occured while getting posts")
    }
}) 