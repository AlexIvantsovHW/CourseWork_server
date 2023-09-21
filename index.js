const express=require('express');
const app=express();
const cors = require('cors')
const port=process.env.PORT||3001
const bodyParser=require('body-parser')
const authRoute=require("./routes/auth")
const multer = require("multer");
const upload = multer({ dest: "./upload/" });
const cloudinary=require('cloudinary').v2
const cookieSession = require('cookie-session')
require('dotenv').config()


cloudinary.config({ 
  cloud_name: 'dj4jyuhfj', 
  api_key: '388474939987269', 
  api_secret: '7M6wy_ScXslriuAFZryRwBypHXc' 
});
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })
app.use(cors({origin:"*"}));
app.use(require('./routes'))

app.use("/auth",authRoute);

app.listen(port,()=>{console.log(`App is started, port: ${port}`)})

