// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
var searchBtnEl = document.querySelector(".search-btn");
var sampleUrl = "api.openweathermap.org/data/2.5/weather?q={cityName}&appid={apiKey}"
var apiKey = "a9e49bbfb982db505e4157a83863ddcc";
var cityHeaderEl = document.querySelector("#city-content")

function getWeatherData(cityNameInput) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${apiKey}&units=imperial`
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            cityHeaderEl.setAttribute("class", "card");
            var cityHeader = $("<h5>").addClass("card-header").text("Forecast Dashboard:");
            var cardBody = $("<div>").addClass("card-body");
            var cardTitle = $("<h4>").addClass("card-title").text(data.name);
            var cityTemp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " F")

            $("#city-content").append(cityHeader);
            $("#city-content").append(cardBody);
            cardBody.append(cardTitle);
            cardBody.append(cityTemp);
        })
};


$(".search-btn").on("click", function () {
    var cityNameInput = $("#search-input").val();
    getWeatherData(cityNameInput);
    console.log(cityNameInput)
});




// function check() {
//     if (globalCityVal === "") {
//         alert("it's empty")
//     } else console.log(globalCityVal)

// }

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5 - day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city