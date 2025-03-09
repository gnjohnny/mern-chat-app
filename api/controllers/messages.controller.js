import Message from "../models/messages.model.js";
import { io } from "../index.js";

import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: selectedUserId },
                { sender: selectedUserId, receiver: req.user.id },
            ],
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        console.log("Error in get messages controller", error.message);
        return res
            .status(500)
            .json({ success: false, msg: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const userId = req.user.id;
        const { message, media } = req.body;

        if (!message)
            return res.status(400).json({
                success: false,
                msg: "Message is required",
            });

        let image;
        let imageId;

        if (media) {
            if (media.startsWith("data:image") && typeof media == "string") {
                const uploadRes = await uploadToCloudinary(media, "image");
                if (uploadRes.success === true) {
                    image = uploadRes.secure_url;
                    imageId = uploadRes.public_id;
                }
            }
        }

        const newMessage = new Message({
            sender: userId,
            receiver: selectedUserId,
            message,
            image,
            imageId,
        });

        await newMessage.save();

        // TODO: add socket io
        io.to(selectedUserId).emit("newMessage", newMessage);

        return res.status(200).json({
            success: true,
            msg: "Message sent successfully",
            newMessage,
        });
    } catch (error) {
        console.log("Error in send message controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

export const updateMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const { editedMessage } = req.body;

        if (!editedMessage)
            return res.status(400).json({
                success: false,
                msg: "message is required",
            });

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { message: editedMessage },
            {
                new: true,
            },
        );

        if (!updatedMessage)
            return res.status(404).json({
                success: false,
                msg: "message not found",
            });
        await updatedMessage.save();

        //todo add socket io

        return res.status(200).json({
            success: true,
            msg: "message updated successfully",
            updatedMessage,
        });
    } catch (error) {
        console.log("Error in update message controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;

        await Message.findByIdAndDelete(messageId);

        //todo add socket io

        return res.status(200).json({
            success: true,
            msg: "Message deleted successfully",
        });
    } catch (error) {
        console.log("Error in delete message controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};
