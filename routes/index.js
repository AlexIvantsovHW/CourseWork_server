const express=require('express')
const router=express.Router();
var multer = require("multer");
var upload = multer({ dest: "./upload/" });
const mysql=require('mysql')

const conn=mysql.createConnection({
    host:'bblqpq3zqeki4vqkexwc-mysql.services.clever-cloud.com',
    user:'ueedenphzx2yvgfe',
    database:'bblqpq3zqeki4vqkexwc',
    password:'Hea5c7Ksi0Ls7h3kyZzp'
})

router.get('/',(req,res)=>{
    res.send('Hi world!')
})

router.get('/users',(req,res)=>{   
    let sql="SELECT * FROM Users";
    conn.query(sql,(err,result)=>{
        if(err){console.log(err);
        }else{res.send(result)}
    })
})
router.post('/registration',upload.array(),(req,res)=>{  
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.pass;
    let qUpdate="INSERT INTO `Users`(`name`,`email`,`password`) VALUES(?,?,?)"
    conn.query(qUpdate,[name,email,password],(err)=>{console.log(err);})
    console.log('done')
})

router.post('/login',upload.array(),(req,res)=>{  
    const name=req.body.name;
    const password=req.body.pass;
    let sql="SELECT * FROM  Users WHERE `name`=?";
    conn.query(sql,[name], function (err, result) {
        if (err) throw err;
        if(result[0].name===name){
            if(result[0].password===password){
                console.log(result[0].password===password);
                res.send(true);
            }else{
                res.send('Password is wrong!')}
        }else
            {   console.log(result[0].password===password);
                res.send('User undefined')}});
})

module.exports=router;