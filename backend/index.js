require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Newsletter = require('./model/Newsletter');
const Schedule = require('./model/Schedule');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// --------- Routes ---------


// Newsletter signup
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already subscribed!" });

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Schedule requests
app.post('/api/schedule', async (req, res) => {
  try {
    const { name, email, date, time, type, notes } = req.body;

    const newSchedule = new Schedule({ name, email, date, time, type, notes });
    await newSchedule.save();

    res.json({ message: "Schedule request submitted!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
