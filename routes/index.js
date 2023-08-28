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

  // Profile page
  router.post('/addRecommendation',upload.array(),(req,res)=>{   
    const id_user=req.body.id_user;
    let image;
    if(req.body.image===undefined?image=null:image=req.body.image);
    const title=req.body.title;
    const name=req.body.name;
    const group=req.body.group;
    const category=req.body.category;
    const text=req.body.text;
    const tag=req.body.tag;
    const date_upload=req.body.date_upload;

     console.log(req.body)   
    let sql="INSERT INTO `Recommendation` (`id_r`,`id_user`,`image`,`title`,`name`,`group`,`category`,`text`,`tag`,`score`,`id_comment`,`date_upload`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    conn.query(sql,[null,id_user,image,title,name,group,category,text,tag,0,0,date_upload],(err,result)=>{
        if(err){console.log(err)}
      
    let requestSQL="SELECT * FROM Recommendation WHERE `id_user`=?";
    conn.query(requestSQL,[id_user],(err,result)=>{
        if(err){console.log(err);
        }else{
            console.log(result)
            res.send(result)}
    })
    })
  }) 


  router.post('/updateRecommendation',upload.array(),(req,res)=>{  
    id_user=req.body.id_user;
    let qUpdate="UPDATE `Recommendation` SET `recommendation`=? WHERE `id_user` IN (?)"
    conn.query(qUpdate,['Active',req.body],(err)=>{console.log(err);})
    let sql="SELECT * FROM Recommendation";
    conn.query(sql,(err,result)=>{
        if(err){console.log(err);
        }else{res.send(result)}
    })
})



module.exports=router;