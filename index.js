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
const passport = require('passport');
require('dotenv').config()
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;


cloudinary.config({ 
  cloud_name: 'dj4jyuhfj', 
  api_key: '388474939987269', 
  api_secret: '7M6wy_ScXslriuAFZryRwBypHXc' 
});
passport.use("auth-github",new GitHubStrategy({
  clientID: 'e56ca00f281133c136bd',
  clientSecret: '7e9e35fba444b39a2e74899a41828935eee27d81',
  callbackURL: 'https://coursework-server.onrender.com/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {

  // В этой функции можно сохранить данные пользователя или выполнить другие действия после авторизации
  console.log(profile);
  done(null, profile);
}));

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

app.use(session({ // Add this middleware
  secret: '7e9e35fba444b39a2e74899a41828935eee27d81',
  resave: true,
  saveUninitialized: true
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/github',passport.authenticate("auth-github", {
  scope: ["user:email"],
  session: false,
})
);

app.get('/auth/github/callback', passport.authenticate("auth-github", {
  scope: ["user:email"],
  session: false,
}),
(req, res) => {
  const user = JSON.stringify(req.user)
  res.status(200).send(`<!DOCTYPE html>
  <html lang="en">
    <body>
    </body>
    <script>
      window.opener.postMessage(${user}, 'https://itransionuser.000webhostapp.com/')
    </script>
  </html>`);
}
);

app.listen(port,()=>{console.log(`App is started, port: ${port}`)})

