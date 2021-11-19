const express = require('express')
const router = new express.Router(); // create new router
const User = require('../models/user')
const sharp = require("sharp")
const auth = require('../middleware/auth.js')
const multer = require("multer");
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save();
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch (e) {
        res.status(400).send(e)
    }
})


router.post('/users/login', async (req, res) => {
    try{
        const foundUser = await User.findByCredentials(req.body.email, req.body.password)
        const token = await foundUser.generateAuthToken()
        res.send({foundUser, token});
    }catch(e){
        res.status(400). send()
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            return tokenObj.token !== req.token
        })
        await req.user.save();
        res.send();
    }catch (e) {
        res.status(500).send()
    }
})


router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch (e) {
        res.status(500).send()
    }
})



router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send()
        }
        res.send(user);
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/users/me', auth, async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation){
        return res.status(400).send({error: "Invalid updates!"})
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update]) // [] for dynamic properties
        await req.user.save();
        res.send(req.user)
    } catch(e) {
        return res.status(400).send();
    }
})

router.delete('/users/me', auth, async(req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.user._id) // find user that comes from auth
        await req.user.remove()
        sendWelcomeEmail(user.email, user.name)
        res.send(req.user)
    }catch(e){
        return res.status(500).send();
    }
})

const upload = multer({
    // dest: "avatars",
    limits:{
        fileSize: 1000000        
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error("Please upload a pdf file"))
        }
        callback (undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save();
    res.send();
}, (error, req, res, next) => { // handle uncaught error
    res.status(400).send({error:error.message})
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png') // res.set() function is used to set the response HTTP header field to value
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})



module.exports = router;
