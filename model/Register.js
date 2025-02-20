const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    Id: { type: Number, required: true, unique: true },
    Name: { type: String, required: true, trim: true },
    Age : {type : Number , required : true},
    Dob : {type : String , required : true},
    Gender : {type : String , required : true},
    Role: { type: String, default : "User"},
    Contact: { type: Number, required: true, trim: true },
    Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    Password: { type: String, required: true }, // Fixed the spelling
    


}, { timestamps: true });



const RegisterModel = mongoose.model("FOOTUSER", RegisterSchema);

module.exports = RegisterModel;