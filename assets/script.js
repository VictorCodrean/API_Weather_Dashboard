// WHEN I view current weather conditions for acity
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature,
// the humidity, the wind speed, and the UV index.
var searchBtnEl = document.querySelector(".search-btn");
var cityInfoEl = document.querySelector("#city-content")
var apiKey = "a9e49bbfb982db505e4157a83863ddcc";
var timeStampsCount = 4;

function getWeatherData(cityNameInput, lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${apiKey}&units=imperial`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            cityInfoEl.setAttribute("class", "card");
            var cityHeader = $("<h5>").addClass("card-header").text(data.name);
            //  + data.weather[0].icon
            var cardBody = $("<div>").addClass("card-body");
            var cardTitle = $("<h4>").addClass("card-title").text("Weather Conditions:");
            var cityTemp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
            var cityHumidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var cityWindSpeed = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " miles/hour");

            var lat = data.coord.lat;
            var long = data.coord.lon;
            uvIndex(lat, long, timeStampsCount, apiKey)

            $("#city-content").append(cityHeader);
            $("#city-content").append(cardBody);
            cardBody.append(cardTitle);
            cardBody.append(cityTemp);
            cardBody.append(cityHumidity);
            cardBody.append(cityWindSpeed);
        });

};

function uvIndex(lat, long, timeStampsCount, apiKey) {
    // got the UV index for 4 days "might include for 4 days forecast"...
    var requestUrlUvIndex = `http://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${long}&cnt=${timeStampsCount}&appid=${apiKey}`
    fetch(requestUrlUvIndex)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            var cityUvIndex = $("<p>").addClass("card-text").text("UV index: " + data[0].value);

            $("#city-content .card-body").append(cityUvIndex);

        });
};

$(".search-btn").on("click", function () {
    var cityNameInput = $("#search-input").val();
    getWeatherData(cityNameInput);
    console.log(cityNameInput)
});


// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history


// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5 - day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city