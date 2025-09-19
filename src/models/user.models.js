import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";    
import jwt from 'jsonwebtoken';
import crypto from "crypto";

const userSchema = new Schema({
    avatar: { 
        type: {
            url: String,
            localPath: String
            },
        default:{
            url :`https://avatar.iran.liara.run/public/44`,
            localPath: ""
        }    
    },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true , index: true},
    email: { type: String, required: true, unique: true,lowercase: true, trim: true ,},
    fullName: { type: String, required: false, trim: true },
    password: { type: String, required: /*[true, "Password is required"]*/ false},
    isEmailVerified: { type: Boolean, default: false },
    refreshToken:{type: String},
    forgotPasswordToken:{type: String},
    forgotPasswordTokenExpiration:{type: Date},
    emailVerificationToken:{type: String},
    emailVerificationTokenExpiration:{type: Date},

},{
    timestamps: true
});


userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
};


userSchema.methods.generateTemporaryToken = function(type) {
    const unhashedToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto
    .createHash('sha256')
    .update(unhashedToken)
    .digest('hex');

    const expiration = Date.now() + 20 * 60 * 1000; // 20 minutes

    return { unhashedToken, hashedToken, expiration  };
};

export const User = mongoose.model("User", userSchema);
