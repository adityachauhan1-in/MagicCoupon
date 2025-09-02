import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    discountAmount: {
        type: Number,
        required: true,
        min: 0
    },
    minimumPurchase: {
        type: Number,
        required: true,
        min: 0
    },
    code: {
        type: String,
        required: true,
        // unique: true,
        uppercase: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Fashion', 'Food', 'Travel', 'Health', 'Education', 'Entertainment', 'Other']
    },
    image: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: -1 // -1 means unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    },
    store: {
        type: String,
        required: true,
        trim: true
    },
    terms: {
        type: String,
        trim: true




    },
    featured: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    }
, 
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }], 
    },
    {
    timestamps: true }
);

couponSchema.index({ category: 1, isActive: 1 });
couponSchema.index({ code: 1 });
couponSchema.index({ endDate: 1 });


couponSchema.virtual('isExpired').get(function() {
    return new Date() > this.endDate;
});

couponSchema.virtual('isAvailable').get(function() {
    const now = new Date();
    return this.isActive && 
           now >= this.startDate && 
           now <= this.endDate && 
           (this.usageLimit === -1 || this.usedCount < this.usageLimit);
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
