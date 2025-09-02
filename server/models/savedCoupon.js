import mongoose from 'mongoose'

const savedCouponSchema = mongoose.Schema({
   userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true },

    couponId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        required:true },

        isUsed: { type: Boolean, default: false },
        
savedAt:{
    type:Date,
    default:Date.now
}
} 
)

const SavedCoupon = mongoose.model("SavedCoupon",savedCouponSchema)
export default SavedCoupon;