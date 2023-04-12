require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task")

const app = express();
app.use(express.json());

app.use(userRouter);
app.use(taskRouter)

//connect
mongoose.connect(process.env.MONGO_URI).then(()=>{
  app.listen(process.env.PORT, () => {
    console.log("listening on port 3000");
  });
})