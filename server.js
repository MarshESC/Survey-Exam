const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // Replace with your actual password if needed
  database: "semioutput",
};

// Endpoint to handle form submission
app.post("/api/submit", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Destructure form data from the request body
    const { name, email, age, recommend, device, referrer, bio } = req.body;

    // Check if the device field has any selected values, if not set to NULL
    const devicesStr = device && device.length > 0 ? device.join(",") : null;

    // Insert the survey data into the correct table (survrespon)
    const [result] = await connection.execute(
      "INSERT INTO survrespon (name, email, age, recommend, device, referrer, bio) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, age, recommend, devicesStr, referrer, bio]
    );

    await connection.end();

    // Respond to the client with a success message
    res.json({ success: true, message: "Survey data saved successfully!" });
    console.log("Insert Result:", result); // Log the result of the insert query
  } catch (error) {
    console.error("Error saving survey data:", error.message); // More detailed error message
    res
      .status(500)
      .json({ success: false, message: "Error saving survey data" });
  }
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
