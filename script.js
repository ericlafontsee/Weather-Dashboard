//Populates page with the weather from user's last search
function init() {
    var cities = getCities();
    var lastSearch = getLastSearch();
    renderEvents(cities);
    weatherNow(lastSearch);
}

//Grabs searched cities from local storage
function getCities() {
    var cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities) cities = [];
    return cities;
}

//Grabs the last item in the cities array, which is the user's last search
function getLastSearch() {
    var cities = getCities();
    return cities[cities.length - 1];
}

//populates the search results list
function renderEvents(cities) {
    console.log(cities);
    $("#searchedCities").empty();
    for (var i = cities.length - 1; i >= 0; i--) {
        var index = cities[i];
        var li = $("<li>");
        li.addClass("list-group-item btn btn-secondary active mb-3 border border-white");
        li.text(index);
        $("#searchedCities").append(li);
    }
}

//sends searched cities to local storage
function storeEvents(input) {
    let cities = getCities();
    cities.push(input);
    localStorage.setItem("cities", JSON.stringify(cities));
}

//If search result is clicked, the page will populate with that city's weather
$(document).on("click", "li", function() {
    $("#forecast").empty();
    searchHistory = $(this).text();
    weatherNow(searchHistory);
});

//Click event on search button will populate page with input city's weather
$("#searchBtn").on("click", function() {
    event.preventDefault();
    $("#forecast").empty();
    var input = $("input").val().trim();
    if (input === "") {
        alert("Enter a city")
    } else {
        weatherNow(input);
        storeEvents(input);
        renderEvents(getCities());

    }
});

//Queries OWM and sets data to variables that are then set as the text values for corresponding <divs>
function weatherNow(city) {
    var APIKey = "425f2fa92724cf0af5e0b7fdfb38e26e";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            console.log(response);
            var tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
            var unformatedDate = response.list[0].dt_txt.split(" ")[0];
            var day = unformatedDate.split("-")[2];
            var month = unformatedDate.split("-")[1].charAt(1);
            var year = unformatedDate.split("-")[0];
            var currentDate = $("<span>").text(" (" + month + "/" + day + "/" + year + ") ");
            var iconURL = "https://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png";
            var weatherIcon = $("<img>").attr("src", iconURL).addClass("img-fluid");
            $("#currentCity").text(response.city.name);
            $("#currentCity").append(currentDate);
            $("#currentCity").append(weatherIcon);
            $("#temperature").text(tempF.toFixed(2) + " \xB0F");
            $("#humidity").text(response.list[0].main.humidity + " %");
            $("#windSpeed").text(response.list[0].wind.speed + " MPH");

            //Loops through response.list to filter out results from only 3 oclock each day.
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
            }

            //Queries OWM to grab UV index and compares data against conditional to color code the <div> based on severity
            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=7e4c7478cc7ee1e11440bf55a8358ec3&lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lat;
            $.ajax({
                url: uvIndexURL,
                method: "GET"
            }).then(function(responseUV) {
                var uvIndex = responseUV.value;
                $("#uvIndexSpan").text(uvIndex);
                var uvColor;
                if (uvIndex < 3) {
                    uvColor = "#00FF7F";
                } else if (uvIndex >= 3 && uvIndex < 6) {
                    uvColor = "yellow";
                } else if (uvIndex >= 6 && uvIndex < 8) {
                    uvColor = "orange";
                } else if (uvIndex >= 8 && uvIndex < 11) {
                    uvColor = "#FF6347";
                } else if (uvIndex > 11) {
                    uvColor = "#DDA0DD";
                    $("#uvIndexSpan").attr("style", "color: white");
                }
                console.log(uvIndex);
                $("#uvIndexSpan").attr("style", ("background-color: " + uvColor));

            });
        });

}

init();