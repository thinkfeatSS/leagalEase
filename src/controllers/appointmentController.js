const Appointment = require("../models/Appointment");
const User = require("../models/User");

// 📌 Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const { client, lawyer, date } = req.body;
    if (!client || !lawyer || !date) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate client and lawyer
    const clientExists = await User.findById(client);
    const lawyerExists = await User.findById(lawyer);
    if (!clientExists || !lawyerExists || lawyerExists.role !== "lawyer") {
      return res.status(404).json({ success: false, message: "Client or Lawyer not found" });
    }

    // Check for duplicate appointment
    const existingAppointment = await Appointment.findOne({ client, lawyer, date });
    if (existingAppointment) {
      return res.status(400).json({ success: false, message: "Appointment already exists" });
    }

    const newAppointment = await Appointment.create({ client, lawyer, date });
    res.status(201).json({ success: true, message: "Appointment created", appointment: newAppointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Get All Appointments (with Pagination & Filtering)
exports.getAppointments = async (req, res) => {
  try {
    const { client, lawyer, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (client) query.client = client;
    if (lawyer) query.lawyer = lawyer;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate("client", "name email")
      .populate("lawyer", "name email")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ date: 1 });

    const total = await Appointment.countDocuments(query);
    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Get Single Appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("client", "name email")
      .populate("lawyer", "name email");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Update Appointment Status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Status updated", appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
