const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files (like CSS) from the "public" directory
app.use(express.static("public"));

// Homepage route
app.get("/", (req, res) => {
  res.render("index", { joke: null, name: null });
});

// Fetch a personalized joke
app.get("/get-joke", async (req, res) => {
  const { name } = req.query; // Get the name from query parameters
  const baseURL = "https://v2.jokeapi.dev/joke/Any";

  try {
    // Fetch a joke from JokeAPI
    const response = await axios.get(baseURL, {
      params: {
        blacklistFlags: "nsfw,religious,racist,sexist",
        type: "single", // Only single-line jokes
      },
    });

    let joke = response.data.joke;

    // Personalize the joke with the user's name
    if (name) {
      joke = joke.replace(/Chuck Norris|John Doe|someone/gi, name); // Replace default placeholders
    }

    // Render the joke with EJS
    res.render("index", { joke, name });
  } catch (err) {
    console.error(err.message);
    res.render("index", { joke: "Failed to fetch a joke. Try again later!", name: null });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
