import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  image: {
    url: {
      type: String,
      required: [true, "image is required"]
    },
    public_id: {
      type: String,
    }
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);