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
                res.send({name:result[0].name,password:result[0].password,id:result[0].id,id_r:result[0].id_r,auth:true});
            }else{
                res.send('Password is wrong!')}
        }else
            {   console.log(result[0].password===password);
                res.send('User undefined')}});
})
router.post('/recommendation',upload.array(),(req,res)=>{   
    const id=req.body.id
    let sql="SELECT * FROM Recommendation WHERE `id_user`=?";
    conn.query(sql,[id],(err,result)=>{
        if(err){console.log(err);
        }else{
            console.log(result)
            res.send(result)}
    })
  })
  let qUpdate="INSERT INTO `dataTable`(`name`,`email`,`tReg`,`status`,`password`) VALUES(?,?,?,?,?)"
  conn.query(qUpdate,[name,email,tReg,'Active',pass],(err)=>{console.log(err);})

  router.post('/addRecommendation',upload.array(),(req,res)=>{   
    const id_user=req.body.id_user;
    const recommendation=req.body.recommendation;
    const group_name=req.body.group_name;
    const recommend_name=req.body.recommend_name;
    const recommend_category=req.body.recommend_category;
        
    let sql="INSERT INTO Recommendation WHERE (`id_user`,`recommendation`,`group_name`,`recommend_name`,`recommend_category`) VALUES (?,?,?,?,?)";
    conn.query(sql,[id_user,recommendation,group_name,recommend_name,recommend_category],(err,result)=>{
        if(err){console.log(err);
        }else{
            console.log(result)
            res.send(result)}
    })
  }) 
module.exports=router;