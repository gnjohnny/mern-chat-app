import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    }, 
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    imageId: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
});

const Message = mongoose.model('Message', messageSchema);9

export default Message;