const express = require("express")
const router = new express.Router()
const User = require("../model/userModel")
const Task = require("../model/taskModel")
const authMiddleware = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try{    

    await user.save()
    const token = await user.generateAuthToken()

    res.status(201).send({user,token})
  }catch(err){
    res.status(400).send(err);
  }
});

router.post("/users/login",async (req,res)=>{
  try{
    const user = await User.findByCredentials(req.body.email,req.body.password)
    const token = await user.generateAuthToken()

    res.status(200).send({user,token})
  }catch(err){
    res.status(400).send()
  }
})

router.post("/users/logout",authMiddleware, async(req,res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((item)=>{
      return item.token !== req.token
    })
    
    await req.user.save()
    res.send()
  }catch(err){
    res.status(500).send()
  }
})

router.post("/users/logoutAll",authMiddleware, async(req,res)=>{
  try{
    req.user.tokens = []
    await req.user.save()
    res.status(200).send()
  }catch(err){
    res.status(500).send(err)
  }
  

})

router.get("/users/me",authMiddleware, async (req, res) => {
  res.status(200).send(req.user);
});

router.patch("/users/me",authMiddleware,async(req,res)=>{
  const updates = Object.keys(req.body)
  const allowedUpdates = ["name","email","password","age"]
  const isValidOperation = updates.every((update)=>{
    return allowedUpdates.includes(update)
  })

  if(!isValidOperation) return res.status(400).send({error:"Invalid updates!!"})

  try{
    const user = req.user

    updates.forEach((update)=>{
      user[update] = req.body[update]
    })

    await user.save()
    
    if(!user) return res.status(404).send()
    res.status(201).send(user)
  }catch(err){
    res.status(400).send(err)
  }
})

router.delete("/users/me",authMiddleware,async(req,res)=>{
  try{

    await User.findByIdAndDelete(req.user._id)
    
    //deleting user tasks when user is removed
    await Task.deleteMany({owner:req.user._id})

    res.status(200).send(req.user)
  }catch(err){
    res.status(404).send(err)
  }
  
})

const upload = multer({
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){

    //allowing only jpg,jpeg,png
    if(!file.originalname.endsWith("jpg")&&!file.originalname.endsWith("jpeg")&&!file.originalname.endsWith("png"))
    {
      return cb(new Error("Only JPEG/JPG/PNG formats are allowed"))
    }

    cb(undefined,true)
  }
})

router.post("/users/me/avatar",authMiddleware, upload.single("avatar"),async (req,res)=>{    
  
  const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

  req.user.avatar = buffer
  await req.user.save()

  res.send()

},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

router.delete("/users/me/avatar",authMiddleware,async (req,res)=>{
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get("/users/:id/avatar",async (req,res)=>{
  try{
    const user = await User.findById(req.params.id) 

    if(!user || !user.avatar){
      throw new Error()
    }

    res.set("Content-Type","image/png")
    res.send(user.avatar)
  }catch(err){
    res.status(404).send()
  }
})

module.exports = router