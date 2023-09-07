const express=require('express')
const app=express();
const cors = require('cors')
const port=process.env.PORT||3001
const bodyParser=require('body-parser')

/* //
var multer = require("multer");
var upload = multer({ dest: "./upload/" });
const mysql=require('mysql')

const conn=mysql.createConnection({
    host:'bblqpq3zqeki4vqkexwc-mysql.services.clever-cloud.com',
    user:'ueedenphzx2yvgfe',
    database:'bblqpq3zqeki4vqkexwc',
    password:'Hea5c7Ksi0Ls7h3kyZzp'
})
// */

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



/* conn.connect(function(err) {
  if (err) throw err;
  conn.query("SELECT name,id_user,id_r,date_upload,comment FROM comment JOIN Users ON comment.id_user=Users.id;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
}); */

app.listen(port,()=>{console.log(`App is started, port: ${port}`)})

