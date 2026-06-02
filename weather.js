
document
  .getElementById("weatherForm")
  .addEventListener("submit", async function (e) {

    e.preventDefault();


    const people = document.getElementById("people").value;
    const city = document.getElementById("city").value.trim();
    const date = document.getElementById("date").value;

    const resultDiv = document.getElementById("result");

    // FETCHING FROM WEATHER OPENAPI
    resultDiv.style.display = "block";
    resultDiv.innerHTML = "<p>Fetching weather...</p>";

    try {

    const response = await fetch(
        `/api/weather?city=${city}`
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
        throw new Error(
            data.error ||
            data.message ||
            "Unable to fetch weather"
        );
    }

    resultDiv.style.display = "block";

    resultDiv.innerHTML = `
        <h2>🌤 Weather in ${data.name}</h2>

        <div class="weather-card">
            <p><strong>👥 Travellers:</strong> ${people}</p>
            <p><strong>📅 Arrival Date:</strong> ${date}</p>
            <p><strong>🌡 Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>☁ Condition:</strong> ${data.weather[0].description}</p>
            <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>💨 Wind Speed:</strong> ${data.wind.speed} m/s</p>
        </div>
    `;

} catch(error) {

    console.error(error);

    resultDiv.style.display = "block";

    resultDiv.innerHTML = `
        <h2> Error</h2>
        <p>${error.message}</p>
    `;
});
