var cities = [];
// var $inputCity;
var lastSearch;

function init() {
    var storedEvents = JSON.parse(localStorage.getItem("cities"));
    if (storedEvents) {
        cities = storedEvents;
    }
  
    lastSearch = cities[cities.length-1];
    renderEvents();
    weatherNow(lastSearch);
}

function renderEvents() {
    $("#searchedCities").empty();
    for (var i = cities.length - 1; i >= 0; i--) {
        var index = cities[i];
        var li = $("<li>");
        li.addClass("list-group-item btn btn-secondary active m-2");
        li.text(index);
        $("#searchedCities").append(li);
    }
}

function storeEvents() {
    localStorage.setItem("cities", JSON.stringify(cities));
}
$(document).on("click", "li", function () {
    $("#forecast").empty();

    searchHistory = $(this).text();
   weatherNow(searchHistory);
});

$("button").on("click", function () {
    //don't refresh the screen
    event.preventDefault();
    $("#forecast").empty();
    //grab the value of the input field
    var $input = $("input").val();
    if($input === ""){
        alert("Enter a city")
    }else{
    weatherNow($input);
    }
});

function weatherNow(city) {
    cities.push(city);
    storeEvents();
    renderEvents();
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
            // var uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+ "&lat={lat}&lon={lon}
            $.ajax({
                url: uvIndexURL,
                method: "GET"
            }).then(function (responseUV) {
                var uvIndex = responseUV.value;
                $("#uvIndexSpan").text(uvIndex);
                var uvColor;
                if (uvIndex < 3) {
                    uvColor = "green";
                }
                else if (uvIndex > 2 || uvIndex < 6) {
                    uvColor = "yellow";
                }
                else if (uvIndex > 5 || uvIndex < 8) {
                    uvColor = "orange";
                }
                else if (uvIndex > 7 || uvIndex < 11) {
                    uvColor = "red";
                }
                else {
                    uvColor = "purple";
                }
                $("#uvIndexSpan").attr("style", ("background-color:" + uvColor));
            });
        });
    forecast(city);
}
function forecast(city) {
    // var $inputCity = $("input").val();

    storeEvents();
    renderEvents();
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
                console.log(unformatedDate);
                var day = unformatedDate.split("-")[2];
                var month = unformatedDate.split("-")[1].charAt(1);
                var year = unformatedDate.split("-")[0];
                var currentDate = " (" + month + "/" + day + "/" + year + ") ";
                var iconURL = "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
                var weatherIcon = $("<img>").attr("src", iconURL);
                if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var card = $("<div>").attr("class", "card text-light text-center col-md-2 border border-dark m-3 bg-primary");
                    $("#forecast").append(card);
                    var cardBody = $("<div>").attr("class", "card-body p-2 m-0");
                    card.append(cardBody);
                    var cardDate = $("<h6>").attr("class", "card-title text-center").text(currentDate);
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