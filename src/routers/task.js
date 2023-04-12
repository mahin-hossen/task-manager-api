const express = require("express");
const router = new express.Router();
const authMiddleware = require("../middleware/auth")
const Task = require("../model/taskModel");

router.post("/tasks", authMiddleware,async (req, res) => {
  const task = new Task({
    ...req.body,
    owner:req.user._id
  })
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//tasks?sortBy=createdAt_desc
router.get("/tasks",authMiddleware, async (req, res) => {
  const _id = req.user._id
  const match = {}
  const sort = {}

  if(req.query.completed){
    match.completed = req.query.completed === "true"
  }

  if(req.query.sortBy){
    const parts = req.query.sortBy.split("_")
    sort[parts[0]] = parts[1]=== "desc" ? -1 : 1
  }


  try {    

    await req.user.populate({
      path:"userTasks",
      match,
      options:{
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    })
    res.status(200).send(req.user.userTasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id",authMiddleware, async (req, res) => {
  const _id = req.params.id;
  
  try {    
    const task = await Task.findOne({_id:_id,owner:req.user._id})

    if (!task) return res.status(400).send(task);

    res.status(201).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id",authMiddleware, async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);

  const isValidUpdates = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidUpdates)
    return res.status(404).send({ error: "Not valid Inputs" });

  try {
    const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
    
    if (!task) return res.status(404).send();

    updates.forEach((update)=>{
      task[update]=req.body[update]
    })
    await task.save()
    
    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.delete("/tasks/:id",authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})

    if (!task) res.status(404).send();

    res.status(200).send(task);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router