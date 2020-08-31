function init() {
    var storedEvents = JSON.parse(localStorage.getItem("cities"));
    var cities = getCities();
    var lastSearch = getLastSearch();
    renderEvents(cities);
    weatherNow(lastSearch);
}

function getCities() {
    var cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities) cities = [];
    return cities;
}

function getLastSearch() {
    var cities = getCities();
    return cities[cities.length - 1];
}

function removeCity(event) {
    event.preventDefault();
    event.stopPropagation();
    var cities = getCities();
    var indexToRemove = $(this).attr("id");
    cities.splice(indexToRemove, 1);
    localStorage.setItem("cities", JSON.stringify(cities));
    renderEvents(cities);
}

function renderEvents(cities) {
    $("#searchedCities").empty();
    for (var i = cities.length - 1; i >= 0; i--) {
        var index = cities[i];
            var li = $("<li>");
            li.addClass("list-group-item btn btn-secondary active mb-3 border border-white");
            li.text(index);
            $("#searchedCities").append(li);
    }
}

function storeEvents(input) {
    let cities = getCities();
    cities.push(input);
    localStorage.setItem("cities", JSON.stringify(cities));
}

$(document).on("click", "li", function () {
    $("#forecast").empty();
    searchHistory = $(this).text();
    weatherNow(searchHistory);
});

$("#searchBtn").on("click", function () {
    //don't refresh the screen
    event.preventDefault();
    $("#forecast").empty();
    //grab the value of the input field
    var input = $("input").val().trim();
    if (input === "") {
        alert("Enter a city")
    } else {
        weatherNow(input);
    }
    storeEvents(input);
    removeCity();
});

function weatherNow(city) {
    var APIKey = "425f2fa92724cf0af5e0b7fdfb38e26e";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            var tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
            var unformatedDate = response.list[0].dt_txt.split(" ")[0];
            var day = unformatedDate.split("-")[2];
            var month = unformatedDate.split("-")[1].charAt(1);
            var year = unformatedDate.split("-")[0];
            var currentDate = $("<span>").text(" (" + month + "/" + day + "/" + year + ") ");
            var iconURL = "https://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png";
            var weatherIcon = $("<img>").attr("src", iconURL);
            $("#currentCity").text(response.city.name);
            $("#currentCity").append(currentDate);
            $("#currentCity").append(weatherIcon);
            $("#temperature").text(tempF.toFixed(2) + " \xB0F");
            $("#humidity").text(response.list[0].main.humidity + " %");
            $("#windSpeed").text(response.list[0].wind.speed + " MPH");

            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=7e4c7478cc7ee1e11440bf55a8358ec3&lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lat;
            $.ajax({
                url: uvIndexURL,
                method: "GET"
            }).then(function (responseUV) {
                var uvIndex = responseUV.value;
                $("#uvIndexSpan").text(uvIndex);
                var uvColor;
                if (uvIndex < 3) {
                    uvColor = "#00FF7F";
                }
                else if (uvIndex >= 3 && uvIndex <= 5) {
                    uvColor = "yellow";
                }
                else if (uvIndex >= 6 && uvIndex <= 7) {
                    uvColor = "orange";
                }
                else if (uvIndex >= 8 && uvIndex <= 10) {
                    uvColor = "#FF6347";
                }
                else if (uvIndex > 10) {
                    uvColor = "#DDA0DD";
                    $("#uvIndexSpan").attr("style", "color: white");
                }
                console.log(uvIndex);
                $("#uvIndexSpan").attr("style", ("background-color: " + uvColor));

            });
        });
    forecast(city);
}
function forecast(city) {
    // renderEvents();
    var APIKey = "425f2fa92724cf0af5e0b7fdfb38e26e";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            for (var i = 0; i < response.list.length; i++) {
                var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                var unformatedDate = response.list[i].dt_txt.split(" ")[0];
                var day = unformatedDate.split("-")[2];
                var month = unformatedDate.split("-")[1].charAt(1);
                var year = unformatedDate.split("-")[0];
                var currentDate = " (" + month + "/" + day + "/" + year + ") ";
                var iconURL = "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
                var weatherIcon = $("<img>").attr("src", iconURL);
                if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var card = $("<div>").attr("class", "card text-light text-center border border-dark bg-primary");
                    $("#forecast").append(card);
                    var cardBody = $("<div>").attr("class", "card-body");
                    card.append(cardBody);
                    var cardDate = $("<h4>").attr("class", "card-title text-center p-2").text(currentDate);
                    cardBody.append(cardDate);
                    cardBody.append(weatherIcon);
                    var cardTemp = $("<p>").attr("class", "card-text").text("Temp: " + tempF.toFixed(2) + " \xB0F");
                    cardBody.append(cardTemp);
                    var cardHumidity = $("<p>").attr("class", "card-text").text("Humidity: " + response.list[i].main.humidity + " %");
                    cardBody.append(cardHumidity);
                }

            };
        });
}

init();