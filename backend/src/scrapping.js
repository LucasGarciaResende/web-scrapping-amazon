import axios from "axios";
import jsdom from "jsdom";

// Generate a random user agent to prevent scraping detection.
const generateUserAgent = () => {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
  ];

  // Selects a random user agent from the list.
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Function to scrape Amazon search results.
const scrapping = async (search) => {
  // Sends a GET request to Amazon's search page with the search keyword as a query parameter.
  try {
    const response = await axios.get(`https://www.amazon.com/s?k=${search}`, {
      // Sets the headers for the request to prevent scraping detection.
      headers: {
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': generateUserAgent(),
        'Referer': 'https://www.amazon.com/',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      responseType: "text",
    });

    // Returns the HTML content of the response.
    const html = response.data;

    return html;
  } catch (error) {
    // Logs any errors to the console and throws the error.
    console.error("Error fetching HTML:", error.message);
    throw error;
  }
};

// Function to transform Amazon search results into an array of objects.
const results = async (search) => {
  // Receives the html from the scrapping function.
  try {
    const html = await scrapping(search);

    // Checks if the html is empty, throws an error if so.
    if (!html) {
      throw new Error("Empty HTML received.");
    }

    // Uses jsdom to parse the HTML and extract the search results.
    const dom = new jsdom.JSDOM(html);
    // Selects all the search result divs.
    const results = dom.window.document.querySelectorAll(
      'div.s-main-slot > div[data-component-type="s-search-result"]'
    );

    // Initializes an empty array to store the results.
    let resultsArray = [];

    // Loops through the search results and extracts the required data.
    for (const result of results) {
      // Tries to obtain the required data, throws an error if not.
      try {
        // Getting a proper selector for the search contents was a challenge, but this works.
        let titleElement = result.querySelector("a h2 span");
        let ratingElement = result.querySelector("div.a-row.a-size-small span");
        let reviewsElement = result.querySelector(
          "div.a-row.a-size-small span.a-size-base.s-underline-text"
        );
        let imageElement = result.querySelector(
          "div.a-section.aok-relative.s-image-fixed-height img"
        );
        let urlElement = result.querySelector(
          "div.a-section.aok-relative.s-image-fixed-height a"
        );
        let linkElement = result.querySelector('div div a');

        // Checks if the required data is available, throws an error if not and skips the item.
        if (titleElement && ratingElement && reviewsElement && imageElement) {
          // Extracts the title, rating, reviews, image and url.
          let title = titleElement.textContent.trim();
          // Extracts the rating and slices it to get only the first 3 digits.
          let rating = ratingElement.textContent.trim().slice(0, 3);
          let reviews = reviewsElement.textContent.trim();
          let image = imageElement.getAttribute("src");
          // Replaces the original image with a higher quality one.
          image = image.replace("AC_UY218", "SL1500");
          let url = `https://www.amazon.com${linkElement.getAttribute('href')}`;
          // Pushes the extracted data to the results array.
          resultsArray.push({ title, rating, reviews, image, url });
        }
      } catch (itemErr) {
        console.warn(
          "Skipping one result due to parsing error:",
          itemErr.message
        );
      }
    }

    return resultsArray;
  } catch (err) {
    // Logs any errors to the console and returns an empty array as a fallback.
    console.error("Error processing search results:", err.message);
    return [];
  }
};

export default results;
