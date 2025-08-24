import mongoose from "mongoose";
//Mongoose lets us define schemas (rules) for documents and easily interact with MongoDB.
import bcrypt from "bcryptjs";
//It encrypts passwords so even if someone hacks your database, they can’t directly read the real password.

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    walletBalance: {
        type: Number,
        default:1000
    },
    savedCoupons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }] 

  
},{ timestamps: true}
  );

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User; 