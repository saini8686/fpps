require("dotenv").config();
const express = require("express");
const axios = require("axios"); // For making API calls
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Webflow webhook endpoint
app.post("/webflow-form", async (req, res) => {
  try {
    // Webflow form data
    const formData = req.body;
    const currentDate = new Date().getTime();

    // Map Webflow form fields to ClickUp task fields
    const taskData = {
      name: `Form Submission: ${formData.data["Name"]}`, // Use the form's "Name" field
      description: `**Email**: ${formData.data["Email"]}
      **Phone**: ${formData.data["Phone"]}
      **Message**: ${formData.data["Message"]}`,
      status: "to do", // Adjust the status as per your ClickUp workspace
      assignees: [5496465],
      priority: 2,
      start_date: currentDate,
      due_date: currentDate,
    };

    // ClickUp API details
    const listId = "901604956254"; // Replace with your ClickUp List ID
    const apiToken = "pk_55289378_CMDSU7G0B4GOPHB83WVV92JOL73ELHDC"; // Replace with your ClickUp API token

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

    res
      .status(200)
      .send({ success: true, message: "Task created in ClickUp!" });
  } catch (error) {
    console.error(
      "Error creating task in ClickUp:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .send({ success: false, message: "Error creating task in ClickUp." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
