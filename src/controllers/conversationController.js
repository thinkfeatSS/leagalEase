const Conversation = require("../models/Conversation");

// 📌 Create a Conversation (Client & Lawyer)
exports.createConversation = async (req, res) => {
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
    res.status(500).json({ error: "Server error" });
  }
}