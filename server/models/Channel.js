import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        url:{ type: String, required: true},
        public_id:{ type: String}
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
}, { timestamps: true });

// channelSchema.pre("save", function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// channelSchema.pre("findOneAndUpdate", function (next) {
//     this.set({updatedAt: Date.now()}) ;
//     next();
// });

export default mongoose.model("Channel", channelSchema);