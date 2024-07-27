import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "sender is required"],
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        },
    },
    fileUrl: {
        name: {
            type: String,
            required: function () {
                return this.messageType === "file";
            },
        },
        url: {
            type: String,
            required: function () {
                return this.messageType === "file";
            },
        },
        public_id: {
            type: String,
            required: function () {
                return this.messageType === "file";
            },
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Message", messageSchema);