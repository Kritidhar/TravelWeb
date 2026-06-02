const searchBtn = document.querySelector(".search-box button");
const searchInput = document.querySelector(".search-box input");

const cardContainer = document.getElementById("cardContainer");
const locationTitle = document.getElementById("locationTitle");

// API KEY 
const ACCESS_KEY = "";

// ON CLICKING SEARCH BUTTON
searchBtn.addEventListener("click", () => {

    const location = searchInput.value.trim();

    const formattedLocation = location
        .toLowerCase()
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");

    if(location === ""){
        alert("Please enter a location");
        return;
    }

    locationTitle.innerText =
        `Places To Visit In ${formattedLocation}`;

    generateCards(location, formattedLocation);

    document.getElementById("destinations")
    .scrollIntoView({
        behavior: "smooth"
    });

});

// GENERATING LOCATION AND FETCHING THEM ON CARDS
async function generateCards(location, formattedLocation){

    cardContainer.innerHTML = "<h2>Loading...</h2>";

    try {

       const response = await fetch(
    `/api/images?location=${location}`
);

        if(!response.ok){
            throw new Error("API Request Failed");
        }

        const data = await response.json();

        cardContainer.innerHTML = "";

        if(data.results.length === 0){

            cardContainer.innerHTML = `
                <h3>No images found for ${formattedLocation}</h3>
            `;

            return;
        }

        // DISPLAYING IMAGE
        data.results.forEach((photo, index) => {

            cardContainer.innerHTML += `
            
            <div class="card">

                <img
                    src="${photo.urls.regular}"
                    alt="${formattedLocation}"
                    onerror="this.src='fallback.jpg'"
                >

                <div class="card-overlay">

                    <h3>
                        ${photo.alt_description || `Attraction ${index + 1}`}
                    </h3>

                    <p>
                        Discover beautiful places in ${formattedLocation}.
                        Click below to explore your trip.
                    </p>

                </div>

            </div>

            `;
        });

    }

    // ERROR HANDLING WITH FALLBACK IMAGE
    catch(error){

        console.error("Unsplash Error:", error);

        cardContainer.innerHTML = "";

        for(let i = 1; i <= 6; i++){

            cardContainer.innerHTML += `
            
            <div class="card">

                <img
                    src="fallback.jpg"
                    alt="Fallback Destination"
                >

                <div class="card-overlay">

                    <h3>
                        Sample Destination ${i}
                    </h3>

                    <p>
                        Live images are currently unavailable.
                        Showing fallback travel image for ${formattedLocation}.
                    </p>

                </div>

            </div>

            `;
        }
    }
}