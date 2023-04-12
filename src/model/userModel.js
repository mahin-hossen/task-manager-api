const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const Task = require("./taskModel")

const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required: true
    },
    password:{
        type:String,
        required:true,
        minLength:7,
        validate(value){
            if(!validator.isStrongPassword(value,{minLength:7}))
                throw new Error(`Password isn't strong enough`)
        }
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("Email isn't valid")
        }
    },
    age:{
        type:Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error("Age must be a positive Number")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual("userTasks",{
    ref:"Task",
    localField:"_id",
    foreignField:"owner"
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const _id = user._id

    const token = jwt.sign({_id:_id},process.env.SECRET)

    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const publicProfile = user.toObject()

    delete publicProfile.tokens
    delete publicProfile.password
    delete publicProfile.avatar

    return publicProfile
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("Unable to login")
    } 

    return user
}




//hashing password
userSchema.pre("save",async function(next){
    const user = this
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})



const User = mongoose.model("User",userSchema)
module.exports = User
