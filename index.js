const express=require('express')
const app=express();
const cors = require('cors')
const port=process.env.PORT||3001
const bodyParser=require('body-parser')
const mysql=require('mysql')
var multer = require("multer");
var upload = multer({ dest: "./upload/" });

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use(cors());
app.get('/',(req,res)=>{
    res.send('Hi world!')
})
const conn=mysql.createConnection({
    host:'bblqpq3zqeki4vqkexwc-mysql.services.clever-cloud.com',
    user:'ueedenphzx2yvgfe',
    database:'bblqpq3zqeki4vqkexwc',
    password:'Hea5c7Ksi0Ls7h3kyZzp'
})
app.get('/users',(req,res)=>{   
    let sql="SELECT * FROM Users";
    conn.query(sql,(err,result)=>{
        if(err){console.log(err);
        }else{res.send(result)}
    })
})
app.post('/registration',upload.array(),(req,res)=>{  
    const name=req.body.name;
    const email=req.body.email;
    const pass=req.body.password;

    let qUpdate="INSERT INTO `Users`(`name`,`email`,`password`) VALUES(?,?,?)"
    conn.query(qUpdate,[name,email,pass],(err)=>{console.log(err);})
})


/* app.post('/create',upload.array(),(req,res)=>{  
    const name=req.body.name;
    const text=req.body.text;
    const tag=req.body.tag;
    const time=req.body.time;
    let qInsert="INSERT INTO `chat`(`name`, `text`, `tag`,`time`) VALUES (?,?,?,?)"
    conn.query(qInsert,[name,text,tag,time],(err)=>{console.log(err);})
})
 */
//
app.listen(port,()=>{console.log(`App is started, port: ${port}`)})