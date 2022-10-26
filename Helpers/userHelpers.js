const bcrypt = require("bcrypt");
const collection = require("../config/collection");
const db = require("../config/connection");


module.exports = {
  doSignup: (userDetails) => {
    console.log("recieved", userDetails);
    return new Promise(async (resolve, reject) => {
      userDetails.password = await bcrypt.hash(userDetails.password, 10);

      console.log(">>>", userDetails);
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(userDetails)
        .then((x) => {
          console.log("+",x);
          resolve(x.insertedId);
        });
    });
  },

  doLogin: (loginDetails) => {
    console.log("//", loginDetails);

    return new Promise(async (resolve, reject) => {
      let response = {};
    

      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({email: loginDetails.email});

      if (user) {
        console.log("user>>>",user);
        //  let newpass= await bcrypt.hash('oginDetails',10);
     
        bcrypt.compare(loginDetails.password,user.password).then((status) => {
          if (status) {
            console.log("login successfull");
            response.user = user;
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
};
