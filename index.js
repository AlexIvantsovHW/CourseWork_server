/* import {config} from 'dotenv'; */
const express=require('express');
const app=express();
const cors = require('cors')
const port=process.env.PORT||3001
/* const passport = require('passport'); */
const bodyParser=require('body-parser')
const authRoute=require("./routes/auth")
const multer = require("multer");
const upload = multer({ dest: "./upload/" });
const cloudinary=require('cloudinary').v2
/* const RecommenRoute=require("./routes/Recommend") */
/* const passportSetup=require('./passport') */
const cookieSession = require('cookie-session')
require('dotenv').config()
/* require('./passport'); */

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

/* app.use(cookieSession({
  name: "session",
  keys: ["cyberwolve"],
  maxAge:24*60*60*100,
}))
app.use(passport.initialize());
app.use(passport.session()); */
app.use("/auth",authRoute);
/* app.use("/recommend",RecommenRoute); */

app.listen(port,()=>{console.log(`App is started, port: ${port}`)})

