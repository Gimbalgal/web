

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');


const Newsletter = require('./model/Newsletter');
const Schedule = require('./model/Schedule');
const Contact = require('./model/Contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('frontend'));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Reusable Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --------- Routes ---------

// Newsletter signup
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "You are already subscribed." });
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    // Notify you (optional)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Newsletter Subscription",
      html: `<p>New subscriber: <b>${email}</b></p>`
    });

    // Confirmation email to subscriber (optional)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to WebBrainForge Newsletter 🎉",
      html: `<p>Thanks for subscribing to WebBrainForge! 🚀</p>`
    });

    return res.status(200).json({ success: true, message: "Subscribed successfully!" });

  } catch (error) {
    console.error("Newsletter error:", error);
    return res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

// Schedule requests
app.post('/api/schedule', async (req, res) => {
  try {
    const { name, email, date, time, notes } = req.body;

    // Save to DB
    const newSchedule = new Schedule({ name, email, date, time, notes });
    await newSchedule.save();

    // Notify YOU
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Demo Booking from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Date: ${date}
        Time: ${time}
        Notes: ${notes || "No additional notes"}
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Demo Booking Confirmation",
     text: `Hello ${name},\n\nYour demo has been scheduled on ${date} at ${time}.\n\nThank you!\n- WebBrainForge`
    });

    return res.status(200).json({ success: true, message: "Demo booked successfully!" });

  } catch (error) {
    console.error("Schedule error:", error);
    return res.status(500).json({ success: false, message: "Failed to book demo. Try again." });
  }
});

// Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // Save to DB
    const newContact = new Contact({ firstName, lastName, email, message });
    await newContact.save();

    // Notify YOU (admin)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Message from ${firstName} ${lastName}`,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Message: ${message}
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ We received your message",
      text: `Hello ${firstName},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nYour message:\n"${message}"\n\n- WebBrainForge`
    });

    // Respond to frontend (for your showMessage)
    return res.status(200).json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({ success: false, message: "Failed to send message. Try again." });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
