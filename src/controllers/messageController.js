const Message = require("../models/Message");

// 📌 Send a Message
exports.sendMessage = async (req, res) => {
  try {
    const { conversation, sender, text } = req.body;

    if (!conversation || !sender || !text) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const message = await Message.create({ conversation, sender, text });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Get Messages for a Conversation
exports.getConversationMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email");

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
