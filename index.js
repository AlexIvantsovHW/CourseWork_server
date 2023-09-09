/* import {config} from 'dotenv'; */
const express=require('express')
const app=express();
const cors = require('cors')
const port=process.env.PORT||3001
const passport = require('passport');
const bodyParser=require('body-parser')
const cookieSession = require('cookie-session')
require('dotenv').config()
require('./passport-setup');

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
app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}
app.use(passport.initialize());
app.use(passport.session());

app.listen(port,()=>{console.log(`App is started, port: ${port}`)})

