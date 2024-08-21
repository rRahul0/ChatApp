import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    user2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

// chatSchema.post("save", function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// chatSchema.pre("findOneAndUpdate", function (next) {
//     this.set({updatedAt: Date.now()}) ;
//     next();
// });

export default mongoose.model("Chat", chatSchema);