var express = require('express');
var router = express.Router();

var db=require('../config/connection')
var collection=require('../config/collection')
var productHelpers=require('../Helpers/productHelpers')
var userHelpers=require('../Helpers/userHelpers')

/* GET users listing. */



  
  



router.get('/', function(req, res,next) {


  let user=req.session.user

  console.log(user);

productHelpers.getAllProduct().then((matches)=>{


  console.log("called");
   res.render('users/users',{matches,admin:false,user})

   console.log("ended");
}); 
});

//users login and signup//

router.get('/signup',(req,res)=>{

  res.render('users/signup')
  
})

router.post('/signup',(req,res)=>{

  console.log("???",req.body)


  userHelpers.doSignup(req.body).then((x)=>{

    
    console.log(x);
    console.log("added successfully")

  })

  // req.session.user=response.user
  // req.session.user.loggedIn=true

  res.render('users/users')
})



router.get('/login',(req,res)=>{


if(req.session.userLoggedIn){

  res.render('users/users')
  
}

else{
   var loginErr =req.session.userLoginErr

  res.render('users/login',{loginErr})
  req.session.userLoginErr=false;

}



})

router.post('/login',(req,res)=>{

  userHelpers.doLogin(req.body).then((response)=>{

    if(response.status){

     
      req.session.user=response.user
      req.session.userLoggedIn=true;

      console.log("logged in successfully")
                  
      res.redirect('/users')
    }
    
    else{

      
      console.log("not logged in")
     req.session.userLoginErr="invalid username and password"
     var loginErr=req.session.userLoginErr
      res.render('users/login',{loginErr});

    }

  })

})

router.get('/logout',(req,res)=>{

req.session.user=null

  res.render('users/login')

})









module.exports = router;
