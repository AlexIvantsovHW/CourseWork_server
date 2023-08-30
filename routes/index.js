const express = require("express");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "./upload/" });
const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "bblqpq3zqeki4vqkexwc-mysql.services.clever-cloud.com",
  user: "ueedenphzx2yvgfe",
  database: "bblqpq3zqeki4vqkexwc",
  password: "Hea5c7Ksi0Ls7h3kyZzp",
});

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
router.post("/registration", upload.array(), (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.pass;
  let qUpdate = "INSERT INTO `Users`(`name`,`email`,`password`) VALUES(?,?,?)";
  conn.query(qUpdate, [name, email, password], (err) => {
    console.log(err);
  });
  console.log("done");
});

router.post("/login", upload.array(), (req, res) => {
  const name = req.body.name;
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
router.post("/recommendation", upload.array(), (req, res) => {
  const id = req.body.id;
  let sql = "SELECT * FROM Recommendation WHERE `id_user`=?";
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
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
    sql = "SELECT * FROM Recommendation ORDER BY score ASC";}
  else if(sort==='ASC'&&field==='score'){
    sql = "SELECT * FROM Recommendation ORDER BY score ASC";}      
  conn.query(sql,(err, result) => {if (err) {console.log(err);} else {res.send(result);}});
});
// Main page
router.get("/score", (req, res) => {
  let sql = "SELECT id_r, COUNT(id_r) FROM score_user GROUP BY id_r";
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Profile page
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

  console.log(req.body);
  let sql =
    "INSERT INTO `Recommendation` (`id_r`,`id_user`,`image`,`title`,`name`,`group`,`category`,`text`,`tag`,`score`,`id_comment`,`date_upload`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
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
          console.log(result);
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

module.exports = router;
