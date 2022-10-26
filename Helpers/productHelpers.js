
const collection = require('../config/collection');
var db= require('../config/connection')

module.exports={

  addProduct : ((matchDetails)=>{

    console.log(matchDetails);

    return new Promise((resolve,reject)=>{

        db.get().collection('matches').insertOne(matchDetails).then((x)=>{
         
            console.log(x.insertedId)
    
            resolve(x.insertedId)
    
    })

    })

  }),

  getAllProduct:()=>{

    return new Promise(async(resolve,reject)=>{

        let Matches=  await db.get().collection(collection.MATCHES_COLLECTION).find().toArray()

        resolve(Matches)
    })

   
  }

}