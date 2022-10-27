const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const collection = require("../config/collection");
const db = require("../config/connection");



module.exports={

doLogin: (loginDetails) => {
    console.log("/?/", loginDetails);

    return new Promise(async (resolve, reject) => {
      let response = {};
    

      let adminz = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({email: loginDetails.email});

      if (adminz) {
        console.log("admin>>>",adminz);
        //  let newpass= await bcrypt.hash('oginDetails',10);
     
        bcrypt.compare(loginDetails.password,adminz.password).then((status) => {
          if (status) {
            console.log("login successfull");
            response.admin = adminz;
            response.status = true;

            resolve(response);
          } else {
            console.log("11111");
            console.log("login failed");
            response.status=false
            resolve({ status: false });
          }
        });
      } else {
        console.log("2222222");

        console.log("login failed");
        resolve({ status: false });
      }
    });
  },

  getAllUsers:()=>{

return new Promise(async(resolve,reject)=>{

let userzz= await db.get().collection(collection.USER_COLLECTION).find().toArray()

resolve(userzz);
})


  },

  updateUser:(id,detail)=>{

    console.log("+++",id)
    console.log("^^^",detail)
return new Promise((resolve,reject)=>{

db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(id)},{$set:{name:detail.name,email:detail.email}}).then((x)=>{

  console.log("??",x)
  
  resolve()

})


})

  }
  
 




}

