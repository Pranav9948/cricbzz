var express = require("express");
var db = require("../config/connection");
var router = express.Router();
var productHelpers = require("../Helpers/productHelpers");
var adminHelpers = require("../Helpers/AdminHelpers");
var collection = require("../config/collection");
var userHelpers=require('../Helpers/userHelpers')

/* GET home page. */

//

router.get("/", (req, res) => {
  productHelpers.getAllProduct().then((matches) => {
    console.log(matches);

    res.render("admin/admins", { admin: true, matches });
  });
});

router.get("/add-match", (req, res) => {
  res.render("admin/addMatch");
});

router.post("/add-match", (req, res) => {
  console.log(req.body);
  console.log(req.files.image);

  let image = req.files.image;

  productHelpers.addProduct(req.body).then((id) => {
    console.log("pro?", id);

    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.render("admin/addMatch");
      } else {
        console.log(err);
      }
    });
  });
});



router.get('/login',(req,res)=>{

  res.render('admin/login')
})

router.post('/login',(req,res)=>{

  adminHelpers.doLogin(req.body).then((response)=>{

    if(response.status){

     
      req.session.admin=response.admin
      req.session.adminLoggedIn=true;

      console.log("logged in successfully")
                  
      res.redirect('/admin')
    }
    
    else{

      
      console.log("not logged in")
     req.session.adminLoginErr="invalid username and password"
     var loginErr=req.session.adminLoginErr
      res.render('admin/login',{loginErr});

    }

  })

})

router.get('/logout',(req,res)=>{

  req.session.admin=null
  
    res.render('admin/login')
  
  })
  
router.get('/allusers',(req,res)=>{

  adminHelpers.getAllUsers().then((userList)=>{

    console.log(userList)

    res.render('admin/allUsers',{userList,admin:true})
  })

})




module.exports = router;
