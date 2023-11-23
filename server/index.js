import  {Auth} from './middleware/auth.js'
import  express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'; 
import User from "./model/User.js";
import jwt from 'jsonwebtoken'
import cors from 'cors'


const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
dotenv.config({ path: '.env' });

const app = express();
app.use(cors(corsOption));
app.use(express.json())
app.use(morgan('tiny'))


const MONGODB_SERVER = process.env.MONGODB_SERVER;
const PORT = process.env.PORT || 5001
mongoose.connect(MONGODB_SERVER).then(()=>{
app.listen(PORT, ()=>{
    console.log("server is listing in "+PORT)
})
})
.catch(err=>{
    console.log(err);
})




app.post('/registre',(req,res)=>{
    try{
        const {username,email,password} =req.body;
        if(!username || !email || !password){
            res.send(404).json({ status: "failed", message: "Invalid data." });}

        bcrypt.hash(password,10).then((hashPassword) =>{
            const user = new User({username,email,password:hashPassword})
            user.save()
            const token = jwt.sign({email: user.email},process.env.JWT_SCRET,{ expiresIn: "15s" })
            const refreshToken = jwt.sign({email: user.email},process.env.JWT_SCRET_REFRESH,{ expiresIn: "1m" })
            const {password, ...restParams} = user._doc 
            return res.status(200).send({user : restParams,token,refreshToken})
            
                })
        
    }catch(err){
        
        return res.status(500).send(err)
    }}
)

app.post('/login',(req,res)=>{
    try {
        const {email,password} = req.body;
        User.findOne({email}).then((user)=>{
            bcrypt.compare(password,user.password,(err,result)=>
            {
                if(err || !result) return res.status(401).send(err || "wrong password")
                const token = jwt.sign({email: user.email},process.env.JWT_SCRET,{ expiresIn: "5s" })
                const refreshToken = jwt.sign({email: user.email},process.env.JWT_SCRET_REFRESH,{ expiresIn: "15S" })
                const {password, ...restParams} = user._doc 
                return res.status(200).send({user : restParams,token,refreshToken})

            })
        })
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.get('/refreshToken',Auth,(req,res)=>{
    try {

        const user = req.user;
        console.log(user)

        const token = jwt.sign({ email: user.email }, process.env.JWT_SCRET, { expiresIn: '10s' });
        const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_SCRET_REFRESH, { expiresIn: '15S' });

        return res.status(200).send({ token, refreshToken });
    } catch (error) {
        return res.status(500).send(error)
    }

})

app.get('/Protected',Auth,(req,res)=>{
   try {
    return res.status(200).send("protected route !")
   } catch (error) {
    return res.status(500).send(error)
   }
})