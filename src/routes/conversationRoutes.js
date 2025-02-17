const express = require("express");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const router = express.Router();

router.post("/conversation", async (req, res) => {
  try {
    const { userId, lawyerId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, lawyerId] },
    });

    if (!conversation) {
      conversation = new Conversation({ participants: [userId, lawyerId] });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/send", async (req, res) => {
    try {
      const { senderId, receiverId, message } = req.body;
  
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });
  
      if (!conversation) {
        conversation = new Conversation({ participants: [senderId, receiverId] });
        await conversation.save();
      }
  
      const newMessage = new Message({
        conversationId: conversation._id,
        senderId,
        message,
      });
      await newMessage.save();
  
      // Update last message in conversation
      conversation.lastMessage = message;
      conversation.lastMessageTime = Date.now();
      await conversation.save();
  
      res.status(201).json({ success: true, message: "Message sent!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.get("/inbox/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      const conversations = await Conversation.find({ participants: userId })
        .populate("participants", "name email")
        .sort({ lastMessageTime: -1 });
  
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  router.get("/messages/:conversationId", async (req, res) => {
    try {
      const { conversationId } = req.params;
  
      const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
      // console.log(messages);
      res.json(messages); 
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });



module.exports = router;
