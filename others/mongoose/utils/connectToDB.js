const {default : mongoose} = require('mongoose')

async function ConnectToDB(){

   if(mongoose.connections[0].readyState) {
      console.log('data base is already connected!') 
   }else{
     console.log('connecting ... ') 
     await mongoose.connect('mongodb://localhost:27017/');
     console.log('successful connection ') 
   }
}

module.exports = ConnectToDB;