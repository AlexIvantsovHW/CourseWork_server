const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./upload/" });
const mysql = require("mysql");
const passport = require('passport');
const cloudinary=require('cloudinary').v2

cloudinary.config({ 
  cloud_name: 'dj4jyuhfj', 
  api_key: '388474939987269', 
  api_secret: '7M6wy_ScXslriuAFZryRwBypHXc' 
});
const conn = mysql.createConnection({
  host: "bblqpq3zqeki4vqkexwc-mysql.services.clever-cloud.com",
  user: "ueedenphzx2yvgfe",
  database: "bblqpq3zqeki4vqkexwc",
  password: "Hea5c7Ksi0Ls7h3kyZzp",
});

//=====================================REQUESTS=============================
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}
router.get("/", (req, res) => {
  res.send("Hi world!");
});
router.get("/users", (req, res) => {
  let sql = "SELECT * FROM Users";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
//=====================================REGISTRATION PAGE=============================
router.post("/registration", upload.array(), (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.pass;
  const _name='%'+name+'%';
  const _email='%'+email+'%';
  const _password='%'+password+'%';
  let sql="select * from `Users` where `name` like ? AND `email` like ? AND `password` like ?";
  conn.query(sql,[_name, _email, _password],(err,result)=>{
    if (err) {
      console.log(err);
    } else if(result.length!=0){
      console.log('------------------------------');
      res.send('dublicate');
    } else{
      let qUpdate = "INSERT INTO `Users`(`name`,`email`,`password`) VALUES(?,?,?)";
      conn.query(qUpdate, [name, email, password], (err) => {
        if(err){
          console.log(err);
          res.send(err);
        }else{
          console.log('200')
          res.send('200');
        }
        
  });
    }
  })   
});
router.post("/login", upload.array(), (req, res) => {
  const name = req.body.name;
  console.log(name)
  const password = req.body.pass;
  let sql = "SELECT * FROM  Users WHERE `name`=?";
  conn.query(sql, [name], function (err, result) {
    if (err) throw err;
    if (result[0].name === name) {
      if (result[0].password === password) {
        console.log(result[0].password === password);
        res.send({
          name: result[0].name,
          password: result[0].password,
          id: result[0].id,
          id_r: result[0].id_r,
          auth: true,
        });
      } else {
        res.send("Password is wrong!");
      }
    } else {
      console.log(result[0].password === password);
      res.send("User undefined");
    }
  });
});
router.post("/checkGitUser", upload.array(), (req, res) => {
  const name = req.body.name;
  const password = req.body.id;
  const email=req.body.email;
  let sql = "SELECT EXISTS(SELECT * FROM  Users WHERE `name`=?) AS `user`";
  conn.query(sql, [name], function (err, result) {
    if (err) throw err;
      const existUser=result[0].user;
  res.send(result);});
});
router.post("/recommendation", upload.array(), (req, res) => {
  const id = req.body.id;
  let sql = "SELECT * FROM Recommendation WHERE `id_user`=?";
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
// Main page
router.get("/db", (req, res) => {
  let sql = "SELECT * FROM Recommendation";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
router.post("/sort", upload.array(), (req, res) => {
  const sort = req.body.sort;
  const field=req.body.field;
  let sql;
  if(sort==='DESC'&&field==='date_upload'){
     sql = "SELECT * FROM Recommendation ORDER BY date_upload DESC";}
  else if(sort==='ASC'&&field==='date_upload'){
     sql = "SELECT * FROM Recommendation ORDER BY date_upload ASC";}
  else if(sort==='DESC'&&field==='score'){
    sql = "SELECT * FROM Recommendation JOIN rating_user ON Recommendation.id_r = rating_user.id_r ORDER BY rating_user.rate DESC";}
  else if(sort==='ASC'&&field==='score'){
    sql = "SELECT * FROM Recommendation JOIN rating_user ON Recommendation.id_r = rating_user.id_r ORDER BY rating_user.rate ASC";}      
  conn.query(sql,(err, result) => {if (err) {console.log(err);} else {res.send(result);}});
});
//===========================Main Page===========================
router.get("/score", (req, res) => {
  let sql = "SELECT id_r, COUNT(id_r) AS Amount FROM score_user GROUP BY id_r";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
router.get("/score_user", (req, res) => {
  let sql = "SELECT DISTINCT id_user, id_r AS userLikes FROM score_user";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      function countIdUserOccurrences(data) {
        const countObj = {};
        data.forEach((row) => {
          const id_r = row.id_r;
          const id_user = row.id_user;
          if (countObj.hasOwnProperty(id_user)) {
            countObj[id_user]++;
          } else {
            countObj[id_user] = 1;
          }
        });
        let resultArray = Object.keys(countObj).map((id_user) => ({
          id_user: parseInt(id_user),
          userLikes: countObj[id_user],
        }));
        (resultArray.length===0?resultArray=[{id_user:null,userLikes:null}]:resultArray)
        return resultArray;
      }
      console.log((result))
      console.log(countIdUserOccurrences(result))
      res.send(countIdUserOccurrences(result));
    }
  });
});
router.get("/likeList",  (req, res) => {
let requestSQL = "SELECT DISTINCT id_r,id_user FROM score_user";
conn.query(requestSQL, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
    res.send(result);
  }
});}),
router.post("/like", upload.array(), (req, res) => {
  id_r=req.body.id_r;
  id_user=req.body.id_user;
  like=+req.body.like;
  console.log('id_r',id_r)
  console.log('id_user',id_user)
  console.log('like',like)
  let sql;
  if(like===1){
    sql="INSERT INTO score_user (`id_r`,`id_user`) VALUES (?,?)"
  }else if(like===0){
    sql="DELETE FROM `score_user` WHERE `id_r`=? AND `id_user`=?"
  }
  conn.query(sql,[id_r,id_user], (err, result) => {
    if (err) {
      console.log(err);
    } else{
    let requestSQL = "SELECT * FROM score_user WHERE `id_user`=?";
    conn.query(requestSQL, [id_user], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result);
      }
    });}

  });
});
router.post("/rate", upload.array(), (req, res) => {
  id_r=req.body.id_r;
  id_user=req.body.id_user;
  rate=+req.body.rate;
  action=+req.body.action;
  console.log('id_r',id_r)
  console.log('id_user',id_user)
  console.log('rate',rate)
  let sql;
  if(action===1){
    sql="INSERT INTO rating_user (`id_r`,`id_user`,`rate`) VALUES (?,?,?)"
  }else if(action===0){
    sql="DELETE FROM rating_user WHERE `id_r`=? AND `id_user`=? AND `rate`=?"
  }
  conn.query(sql,[id_r,id_user,rate], (err, result) => {
    if (err) {
      console.log(err);
    } else{
    let requestSQL = "SELECT DISTINCT `id_r`,`id_user`,`rate` FROM rating_user";
    conn.query(requestSQL, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result);
      }
    });}

  });
});
router.get("/ratedb", (req, res) => {
      let requestSQL = "SELECT DISTINCT `id_r`,`id_user`,`rate` FROM rating_user";
    conn.query(requestSQL, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result);
      }
    });})
//===========================Profile Page===========================
router.post("/addRecommendation", upload.array(), (req, res) => {
  const id_user = req.body.id_user;
  let image;
  if (req.body.image === undefined ? (image = null) : (image = req.body.image));
  const title = req.body.title;
  const name = req.body.name;
  const group = req.body.group;
  const category = req.body.category;
  const text = req.body.text;
  const tag = req.body.tag;
  const date_upload = req.body.date_upload;
  console.log(image)
  console.log(title)
  console.log(name)
  let sql =
    "INSERT INTO `Recommendation` (`id_r`,`id_user`,`image`,`title`,`name`,`group`,`category`,`text`,`tag`,`Amount`,`comment`,`date_upload`,`AuthorScore`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
  conn.query(
    sql,
    [
      null,
      id_user,
      image,
      title,
      name,
      group,
      category,
      text,
      tag,
      0,
      0,
      date_upload,
      0
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      }

      let requestSQL = "SELECT * FROM Recommendation WHERE `id_user`=?";
      conn.query(requestSQL, [id_user], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
    }
  );
});
router.post("/update", upload.array(), (req, res) => {
   const id_r = req.body.id_r;
  let image;
  if (req.body.image === undefined ? (image = null) : (image = req.body.image));
  const title = req.body.title;
  const name = req.body.name;
  const group = req.body.group;
  const category = req.body.category;
  const text = req.body.text;
  const tag = req.body.tag;
  const date_upload = req.body.date_upload;
  let qUpdate =
    "UPDATE `Recommendation` SET `image`=?,`title`=?,`name`=?,`group`=?,`category`=?,`text`=?,`tag`=?,`date_upload`=? WHERE `id_r` IN (?)";
  conn.query(qUpdate, [image, title,name,group,category,text,tag,date_upload,id_r], (err) => {
    console.log(err);
  });
  let sql = "SELECT * FROM Recommendation";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
//===========================COMMENTS===============================
router.get("/comment", (req, res) => {
  let sql = "SELECT name,id_user,id_r,date_upload,comment FROM comment JOIN Users ON comment.id_user=Users.id";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});
router.post("/setComment",upload.array(), (req, res) => {
  let id_r=req.body.id_r,
      id_user=req.body.id_user,
      comment=req.body.comment;
      date_upload=req.body.date_upload;

    console.log(comment)
      sql="INSERT INTO comment (`id_r`,`id_user`,`comment`,`date_upload`) VALUES (?,?,?,?)"
      
      conn.query(sql,[id_r,id_user,comment,date_upload], (err, result) => {
        if (err) {
          console.log(err);
        } else{

  let sql = "SELECT name,id_user,id_r,date_upload,comment FROM comment JOIN Users ON comment.id_user=Users.id";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })};
})});
router.post("/setAuthorScore",upload.array(), (req, res) => {
  let id_r=req.body.id_r,
      id_user=req.body.id_user,
      AuthorScore=req.body.AuthorScore;
      sql="UPDATE Recommendation SET `AuthorScore`=? WHERE `id_r`=? AND`id_user`=?;"
      
      conn.query(sql,[AuthorScore,id_r,id_user], (err, result) => {
        if (err) {
          console.log(err);
        } else{

  let sql = "SELECT * FROM Recommendation";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })};
})});

//===========================ADMIN PAGE===========================
router.post("/deleteUser", upload.array(), (req, res) => {
  const users=req.body.data.map((el)=>parseInt(el))
  let sql="DELETE FROM Users WHERE `id` IN (?)"
  conn.query(sql,[users], (err, result) => {
    if (err) {
      console.log(err);
    } else{
    let requestSQL = "SELECT * FROM Users";
    conn.query(requestSQL, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result);
      }
    });}

  });
});
//PROFILE PAGE
router.post("/deleteRecommend",upload.array(),  (req, res) => {
  const reveivedData=req.body.data.map((el)=>parseInt(el))
  console.log(reveivedData)
  let sql;
   sql="DELETE FROM Recommendation WHERE `id_r` IN (?)"
   conn.query(sql,[reveivedData], (err, result) => {if(err){console.log(err);
  }else{
    conn.query("SELECT * FROM Recommendation", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result)
        res.send(result);
      }
    })
  }}
  )}); 
router.post('/upload',upload.array(),async (req,res,next)=>{
 const images=req.body.images;
 try{
     const response= await cloudinary.uploader.upload(images[0]) 
     res.send(response)
 }catch(error){
  next(error)
 }
})
router.post('/setImg',upload.array(), (req,res,next)=>{
  const image=req.body.image;
  let sql='UPDATE Recommendation SET image = ? WHERE id_r = (SELECT max_id_r FROM (SELECT MAX(id_r) AS max_id_r FROM Recommendation) AS subquery);'
  conn.query(sql,[image], (err, result) => {if(err){console.log(err);
  }else{
    conn.query("SELECT * FROM Recommendation", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result)
        res.send(result);
      }
    })
  }}
  )}); 

   
module.exports = router;
