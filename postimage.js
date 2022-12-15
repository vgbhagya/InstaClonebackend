const mongoose= require('mongoose');
const postimage=new mongoose.Schema({
    imagename:{type:String},
    imagedata:{type:String}
})

const model = mongoose.model('Postimage',postimage);
module.exports=model;