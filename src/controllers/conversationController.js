const Conversation = require("../models/Conversation");

// 📌 Create a Conversation (Client & Lawyer)
exports.createConversation = async (req, res) => {
  try {
    const { client, lawyer } = req.body;

    if (!client || !lawyer) {
      return res.status(400).json({ success: false, message: "Client and Lawyer are required" });
    }

    // Check if conversation exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [client, lawyer] }
    });

    if (existingConversation) {
      return res.status(200).json({ success: true, conversation: existingConversation });
    }

    // Create new conversation
    const conversation = await Conversation.create({ participants: [client, lawyer] });
    res.status(201).json({ success: true, conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Get Conversations for a User
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name email role");

    res.json({ success: true, conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
