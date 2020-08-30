var cities = [];
function init() {
    var storedEvents = JSON.parse(localStorage.getItem("cities"));
    if (storedEvents) {
        cities = storedEvents;
    }
    renderEvents();
}

function renderEvents() {
    $("#searchedCities").empty();
    for (var i = 0; i < cities.length; i++) {
        var index = cities[i];
        var li = $("<li>");
        li.addClass("list-group-item");
        li.text(index);
        $("#searchedCities").append(li);
    }
}

function storeEvents() {
    localStorage.setItem("cities", JSON.stringify(cities));
}


$("button").on("click", function (event) {
    event.preventDefault();
    var $inputCity = $("input").val();
    cities.push($inputCity);
    storeEvents();
    renderEvents();
    var APIKey = "425f2fa92724cf0af5e0b7fdfb38e26e";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + $inputCity.trim() + "&appid=" + APIKey;
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
            $("#currentCity").text(response.city.name);
            $("#currentCity").append(currentDate);
            $("#temperature").text(tempF.toFixed(2) + " \xB0F");
            $("#humidity").text(response.list[0].main.humidity + " %");
            $("#windSpeed").text(response.list[0].wind.speed + " MPH");
            //  $("#uvIndex").text(response.)

            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=7e4c7478cc7ee1e11440bf55a8358ec3&lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lat;
            // var uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+ "&lat={lat}&lon={lon}
            $.ajax({
                url: uvIndexURL,
                method: "GET"
            }).then(function (responseUV) {
                $("#uvIndex").text(responseUV.value);
               
        });
}); 
});

init();