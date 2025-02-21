const {Schema , model , models} = require('mongoose');


const UserSchema = new Schema({
    text : {type : String , require : true},
    status : {type : Boolean , require : true},
    age : {type : Number , require : true},
    id : {type : Number , require : true},
    email : {type : String},
    postId : {type : Number}
} , {
    timestamps : true
});

const BlogsSchema = new Schema({
    title : {type : String , require : true},
    body : {type : String , require : true},
    postId : {type : Number , require : true},
    id : {type : Number , require : true},
} , {
    timestamps : true
});

const BlogsModel = models[0] || model('blogs' , BlogsSchema);
const UserModel = models[0] || model('user' , UserSchema);

const Models = {
    UserModel ,
    BlogsModel
}

module.exports = Models;