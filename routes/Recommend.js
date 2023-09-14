/* const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "./upload/" });

router.post("/delete", upload.array(), (req, res) => {
    id_r=JSON.parse(req.body);
    console.log(id_r)
    let sql="DELETE FROM `Recommendation` WHERE `id_r` IN ?"
  
    conn.query(sql,[id], (err, result) => {
      if (err) {
        console.log(err);
      } else{
      let requestSQL = "SELECT * FROM Recommendation";
      conn.query(requestSQL, [id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.send(result);
        }
      });}
  
    });
  }); */