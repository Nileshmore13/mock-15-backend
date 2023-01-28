const express= require("express");
const cors = require("cors");

const { connection } = require("./Config/db");
const { userRoutes } = require("./Routes/User.routes");
const { UserModel } = require("./Models/User.model");


const app = express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Home")
})

app.use("/",userRoutes)

//created basic connection
app.get("/getProfile",async(req,res)=>{
    const email = req.headers?.info?.split(" ")[1];
    const data = await UserModel.findOne({email:email});
    res.send({"userinfo":data});
});

app.post("/calculateBMI", (req,res)=>{
    const data = req.body;
    const bmi = Number(data.weight)/Number(data.height);
     res.send({"bmi":bmi});
});

app.listen(8000, async ()=>{
    try{
        await connection;
        console.log({"msg":"connected to mongodb atlas successfull"});
    }
    catch(err){
        console.log(err);
        console.log({"msg":"error while connecting to atlas db"});
    }
    console.log("Listrning on port 8000");
})