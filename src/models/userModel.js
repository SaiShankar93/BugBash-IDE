import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true,'Name is required'] ,
        unique : true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'Password is required']
    },
    token : String,
    tokenExpiry : Date
});

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;