var cityInfoEl = document.querySelector("#city-content");
var apiKey = "a9e49bbfb982db505e4157a83863ddcc";
var timeStampsCount = 4;
var todaysDate = moment().format("MM/DD/YYYY");

function getForecastData(cityNameInput) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityNameInput}&appid=${apiKey}&units=imperial`
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            $("#five-day-forecast").empty();

            var daysForecast = $("<h2>").addClass("col-12 mt-1").text("5 Day Forecast:")
            var daysRow = $("<section>").addClass("row five-days-tabs mr-4 ml-4")

            $("#five-day-forecast").append(daysForecast, daysRow);
            // $("#dynamic").append(daysRow)

            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                    var dayColumn = $("<div>").addClass("col-md-2 m-1 card bg-primary text-white");
                    var cardBody = $("<div>").addClass("card-body p-1");
                    var date = $("<h5>").addClass("card-title").text(moment(data.list[i].dt_txt).format("M/D/YYYY"));
                    var icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`)
                    var temp = $("<p>").addClass("card-text").text("Temp: " + parseInt(data.list[i].main.temp) + " °F");
                    var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    daysRow.append(dayColumn.append(cardBody.append(date, icon, temp, humidity)));
                }
            }
        });
};

function uvIndex(lat, long, timeStampsCount, apiKey) {
    // Reset/clear input value;
    $("#search-input").val("");
    // got the UV index for 4 days "might include for 4 days forecast"...
    var requestUrlUvIndex = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${long}&cnt=${timeStampsCount}&appid=${apiKey}`
    fetch(requestUrlUvIndex)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            var cityUvIndex = $("<p>").addClass("card-text uv-index").text("UV index: ");
            var uvIndexBg = $("<span>").addClass("uv-index-bg").text(data[0].value);

            $("#city-content .card-body").append(cityUvIndex);
            $("#city-content .uv-index").append(uvIndexBg);

            // A UV Index reading of 0 to 2 means low danger 
            // A UV Index reading of 3 to 5 means moderate risk of harm
            // A UV Index reading of 6 to 7 means high risk
            // A UV Index reading of 8 to 10 means very high risk of harm
            // A UV Index reading of 11 or more means extreme risk of harm
            if (data[0].value < 3) {
                $("#city-content .uv-index-bg").addClass("bg-success");
            }
            else if (data[0].value >= 3 && data[0].value < 6) {
                $("#city-content .uv-index-bg").addClass("bg-moderate");
            }
            else if (data[0].value >= 6 && data[0].value < 8) {
                $("#city-content .uv-index-bg").addClass("bg-warning");
            }
            else if (data[0].value >= 8 && data[0].value < 11) {
                $("#city-content .uv-index-bg").addClass("bg-danger");
            }
            else if (data[0].value >= 11) {
                $("#city-content .uv-index-bg").addClass("bg-extreme");
            }
        });
};

function getCurrentWeatherData(cityNameInput, lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${apiKey}&units=imperial`
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            $("#city-content").empty();
            cityInfoEl.setAttribute("class", "card");
            var cardHeader = $("<header>").addClass("card-header text-center");
            var cityHeader = $("<h2>").text(data.name + " - " + data.weather[0].main);
            var icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
            var headerDescription = $("<p>").text(data.weather[0].description);
            var headerTemp = $("<h2>").text(parseInt(data.main.temp) + "°F");
            var headerHighLow = $("<p>").text("H:" + parseInt(data.main.temp_max) + "° " + " L:" + parseInt(data.main.temp_min) + "°");

            var cardBody = $("<header>").addClass("card-body");
            var cardTitle = $("<h5>").addClass("card-title").text(todaysDate + " - Weather Conditions");
            var cityTemp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
            var cityHumidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var cityWindSpeed = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " miles/hour");

            var lat = data.coord.lat;
            var long = data.coord.lon;
            uvIndex(lat, long, timeStampsCount, apiKey)

            $("#city-content").append(cardHeader);
            cardHeader.append(cityHeader);
            cardHeader.append(headerDescription);
            cardHeader.append(headerTemp);
            cardHeader.append(headerHighLow);
            cityHeader.append(icon);

            $("#city-content").append(cardBody);
            cardBody.append(cardTitle);
            cardBody.append(cityTemp);
            cardBody.append(cityHumidity);
            cardBody.append(cityWindSpeed);
        });
};

$(".search-btn").on("click", function () {

    var cityName = $("#search-input").val();
    var cityNameInput = cityName.charAt(0).toUpperCase() + cityName.slice(1)
    // var cityNameInput = $("#search-input").val();
    if (cityNameInput === "") {
        userMessage();
    } else {
        getCurrentWeatherData(cityNameInput);
        getForecastData(cityNameInput);
        console.log(cityNameInput);
    }

    searchedCities = JSON.parse(localStorage.getItem("searchedCities"))
    if (searchedCities == null) {
        searchedCities = [];
    } else if (searchedCities === "") {
        userMessage();
    }
    if (cityNameInput === "") {
        userMessage();
    } else if (searchedCities.includes(cityNameInput)) {
        localStorage.setItem("searchedCity", cityNameInput);
        renderButtons(cityNameInput)
    } else {
        searchedCities.push(cityNameInput);
        localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
        localStorage.setItem("searchedCity", cityNameInput);
        renderButtons();
    }
});

function userMessage() {
    $("#city-content").empty();
    $("#five-day-forecast").empty();
    var notification = $("<div>").addClass("alert alert-primary");
    var notFound = $("<p>").text("Enter a city/locatin in order to search for weather");
    $("#city-content").append(notification);
    notification.append(notFound);
}

function renderButtons(cityNameInput) {
    $("#searched-cities").empty();
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
    // dynamically append the buttons
    for (var i = 0; i < searchedCities.length; i++) {

        var citybutton = $("<button>").attr({ data: searchedCities[i], class: "searched-btn btn btn-outline-secondary" }).text(searchedCities[i]);
        $("#searched-cities").append(citybutton);
        console.log(searchedCities[i]);
    }
}

$(document).ready(function () {
    if (localStorage.searchedCities == null) {
        return
    } else {
        renderButtons();
    }
})

$(document).on("click", ".searched-btn", function () {
    var cityNameInput = $(this).attr("data");
    getCurrentWeatherData(cityNameInput);
    getForecastData(cityNameInput);
    $("")
    $(this).addClass("active").siblings().removeClass("active");
})
