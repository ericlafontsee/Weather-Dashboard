# Weather-Dashboard

## Description
For this project, I created a weather application using the Open Weather Map API.   
Located on the left is a search bar where the user can input any city of their choosing.  
The page will populate with the current weather as well as a 5-day forecast. Underneath  
the search bar will be the user's search history. By clicking any of the recent searches,  
the user can repopulate the page with that city's current weather and forecast.  
When the application is exited and reopened, the user's last search result will be displayed  
with the forecast as well.  


This Work Day Scheduler is deployed to GitHub Pages:
https://ericlafontsee.github.io/Weather-Dashboard/

## Features
* Searched city's current temperature, wind speed, and humidity readings and the 5 day forecast.
* Under current weather will be a color coded UV index reading indicating favorable, moderate,  
or severe conditions.
* To access search history, the user simply clicks the result in the left pane.
* All searches are stored in local storage.


## Usage
![Weather-Dashboard-Demo](images/WeatherDashboard.gif)


## Built With
HTML    
CSS    
jQuery  
BootStrap   
Open Weather Map APIs  
Font Awesome Icons
Background image from www.subtlepatterns.com 

## Prerequisites
To build or edit this application you will need Visual Studio Code or a text editor

## Installation
To access Open Weather Map, you need to request an API key and use the following URL to query:
```
http://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}
```
To access the UV Index data from Open Weather Map, use the following query URL:
```
http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
```

To utilize the background image from www.subtlepatterns.com, download the background into your images folder. Then place the following in your css:

```css
 body {
  background-image: url("images/weather.png");
  background-repeat: repeat;
  background-position: center;
}
```

To utilize the jQuery library, place the following script at the end of your HTML body:

```html
            <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>

```
To utilize Font Awesome, insert the following link into the head of your html document:

```html
               <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
        integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />

```

To utilize Bootstrap components, grid, and other styles, insert the following link into the head of your html document:

```html
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
```

## Author
Eric LaFontsee - jQuery
Trilogy - CSS


## License
MIT License

## Acknowledgments
Anthony Cooper(Instructor) - For help with revisions and debugging of the javaScript.
Sasha Peters(TA) - Helped to fix a bug and revise the code to be more efficient.
