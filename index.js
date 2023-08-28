const express=require('express')
const app=express();
const cors = require('cors')
const port=process.env.PORT||3001
const bodyParser=require('body-parser')

//
var multer = require("multer");
var upload = multer({ dest: "./upload/" });
const mysql=require('mysql')

const conn=mysql.createConnection({
    host:'bblqpq3zqeki4vqkexwc-mysql.services.clever-cloud.com',
    user:'ueedenphzx2yvgfe',
    database:'bblqpq3zqeki4vqkexwc',
    password:'Hea5c7Ksi0Ls7h3kyZzp'
})
//

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
/* let sql="INSERT INTO Recommendation WHERE (`id_r`,`id_user`,`image`,`title`,`name`,`group`,`category`,`text`,`tag`,`score`,`id_comment`,`date_upload`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    conn.query(sql,[null,id_user,image,title,name,group,category,text,tag,0,0,date_upload] */

/*     let image=null;
    const title='NFS';
    const id_user=1;
    const name='needforspeed';
    const group='action';
    const category='film';
    const text='new comment';
    const tag='speed';
    const date_upload='2023-08-28 15:58:56';

  conn.connect(function(err) {
    if (err) throw err;
    conn.query("INSERT INTO `Recommendation` (`id_r`,`id_user`,`image`,`title`,`name`,`group`,`category`,`text`,`tag`,`score`,`id_comment`,`date_upload`) VALUES (null,'1','image','title','name','group','category','text','tag',0,0,'2023-08-28 15:58:56')", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  }); */

app.listen(port,()=>{console.log(`App is started, port: ${port}`)})