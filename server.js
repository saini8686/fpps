require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Webflow webhook endpoint
app.post("/get-a-quote", async (req, res) => {
  try {
    // Webflow form data
    const formData = req.body;
    const currentDate = new Date().getTime();

    // Map Webflow form fields to ClickUp task fields
    const taskData = {
      name: `Form Submission: ${formData.data["name"]}`, // Use the form's "Name" field
      description: `**Email**: ${formData.data["email"]}
      **Phone**: ${formData.data["phone"]}
      **Company/Business Name**: ${formData.data["company"]}
      **Add your project goals and requirements here**: ${formData.data["message"]}`,
      status: "open",
      // Adjust the status as per your ClickUp workspace
      assignees: null,
      priority: 2,
      start_date: currentDate,
      due_date: null,
    };

    // ClickUp API details
    const listId = "901601671053"; // Replace with your ClickUp List ID
    const apiToken = "pk_5431942_F1SRFXKXPU9X1CLG8HAAPBH385TD0TQL"; // Replace with your ClickUp API token

    // Send data to ClickUp
    const response = await axios.post(
      `https://api.clickup.com/api/v2/list/${listId}/task`,
      taskData,
      {
        headers: {
          Authorization: apiToken,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response, "response");
    res
      .status(200)
      .send({ success: true, message: "Task created in ClickUp!" });
  } catch (error) {
    console.error(
      "Error creating task in ClickUp:",
      error.response?.data || error.message
    );
    res.status(500).send({ success: false, message: req.body });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
