// Function to render search results
const renderResults = (results) => {
    // Checks if results array is empty and alerts user if so.
    if (results.length === 0) {
        alert("No results found.");
        return;
    } else {
        // Gets the search results container and clears it
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";

        // Loops through the results array and creates a card for each result
        results.forEach((result) => {
            // Creates a new div element and populates it with the result data
            const resultElement = document.createElement("div");
            resultElement.innerHTML = `
                <a href="${result.url}" target="_blank" class="result-card">
                    <img src="${result.image}" alt="${result.title}" class="result-image">    
                    <div class="result-info">
                        <h3 class="result-title">${result.title}</h3>
                        <p class="result-text">Rating: ${result.rating} / 5 ⭐ (${result.reviews} reviews)</p>
                    </div>
                </a>
                `;
            // Appends the new div element to the search results container
            resultsContainer.appendChild(resultElement);
        });
    }
};

// Function to fetch search results from the backend
const search = async () => {
    // Gets the search input value and checks if it is empty, alerts user if so.
    const searchInput = document.querySelector(".search-input");
    const searchValue = searchInput.value.trim();

    if (!searchValue) {
        return alert("Please enter a search term.");
    }

    // Sends a GET request to the backend with the search value as a query parameter
    try {
        const response = await fetch(`http://localhost:7250/api/scrape?keyword=${encodeURIComponent(searchValue)}`);
        // Checks if the response is ok, throws an error if not
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        // Converts the response to JSON and passes it to the renderResults function
        const data = await response.json();
        renderResults(data);
    } catch (error) {
        // Logs any errors to the console
        console.error("Error fetching data:", error);
    }
};

// Event listener for the search button
document.querySelector(".search-button").addEventListener("click", search);