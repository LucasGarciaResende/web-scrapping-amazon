import express from "express";
import results from "./scrapping.js";
import cors from "cors";

// Create an Express app.
const app = express();
// Enable CORS to allow requests from any origin.
app.use(cors());
const port = 7250;

// Start the server and log a message to the console.
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});

// Define base GET route.
app.get("/", (req, res) => {
  res.send("The server is running.");
});

// Define /api/scrape endpoint to fetch search results.
app.get("/api/scrape", async (req, res) => {
  // Get the search keyword from the query parameters.
  const keyword = req.query.keyword;

  // Check if the search keyword is provided, return a 400 status code with an error if not.
  if (!keyword) {
    return res.status(400).json({ error: "Missing search keyword!" });
  }

  // Call the results function to fetch the search results.
  try {
    // Pass the search keyword to the results function.
    const resultsArray = await results(keyword);
    res.json(resultsArray);
    // If an error occurs, return a 500 status code with the error message.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
