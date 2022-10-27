var express = require("express");
var db = require("../config/connection");
var router = express.Router();
var productHelpers = require("../Helpers/productHelpers");
var adminHelpers = require("../Helpers/AdminHelpers");
var collection = require("../config/collection");
var userHelpers=require('../Helpers/userHelpers');
const { ObjectId } = require("mongodb");


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


router.post('/search',(req,res)=>{


  var searchDetails=req.body.search

console.log("////",req.body.search)


 db.get().collection(collection.USER_COLLECTION).findOne({name:searchDetails}).then((searched)=>{

  console.log('OP:',searched)

  res.render('admin/filterUser',{admin:true,searched})
 })


})


router.get('/add-user',(req,res)=>{

res.render('admin/addUser')

})

router.get('/add-user',(req,res)=>{

  res.render('admin/addUser')
  
  })

  router.post('/add-user',(req,res)=>{

    let newUser=req.body
    console.log("new user",req.body)

    db.get().collection(collection.USER_COLLECTION).insertOne(newUser).then((x)=>{
       console.log(x);


    

      res.redirect('/admin/allUsers')

    })
    
    })


    router.get('/deleteuser/:id',(req,res)=>{


      console.log('***',req.params.id)
      let deleteId=req.params.id

      db.get().collection(collection.USER_COLLECTION).deleteOne({_id:ObjectId(deleteId)}).then((y)=>{

        console.log(y);

        res.redirect('/admin/allusers')


      })

    })

    router.get('/edituser/:id',(req,res)=>{

      let editUser=req.params.id

      db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectId(editUser)}).then((z)=>{

     console.log("zzz",z)

      console.log("<>",editUser)

      res.render('admin/editUser',{admin:true,z,editUser})

    })
  })

    router.post('/edituser/:id',(req,res)=>{

      

      console.log("userv..",req.params.id)
      let userDetail=req.body
      let userId=req.params.id
    
      adminHelpers.updateUser(userId,userDetail).then(()=>{
        console.log("updated succesfully")
         res.redirect('/admin/allUsers')
        })
    })




  




module.exports = router;
