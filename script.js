const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const currentWeatherItemsElement = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryElement = document.getElementById("country");
const weatherForecastElement = document.getElementById("weather-forecast");
const currentTempElement = document.getElementById("current-temp");

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const API_KEY = 'f89305f8718e27cdb38377a3333e9357';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hours12hr = hour>=13 ? (hour%12): hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeElement.innerHTML = (hours12hr<10 ? '0'+hoursin12hr : hours12hr) + ':' + (minutes < 10 ? '0' + minutes : minutes) + " " + `<span id="am-pm">${ampm}</span>`
    dateElement.innerHTML = days[day] + ', ' + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        // console.log(success);
        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            // console.log(data);
            showWeatherData(data);
        });
    })
}

function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    
    timezone.innerHTML = data.timezone;
    countryElement.innerHTML = data.lat + 'N ' + data.lon+'E';

    currentWeatherItemsElement.innerHTML = `<div class="weather-item">
        <p>Humidity</p>
        <p>${humidity}%</p>
    </div>
    <div class="weather-item">
        <p>Pressure</p>
        <p>${pressure} hPa</p>
    </div>
    <div class="weather-item">
        <p>Wind Speed</p>
        <p>${wind_speed} m/s</p>
    </div>
    <div class="weather-item">
        <p>Sunrise</p>
        <p>${window.moment(sunrise * 1000).format('HH:mm a')}</p>
    </div>
    <div class="weather-item">
        <p>Sunset</p>
        <p>${window.moment(sunset * 1000).format('HH:mm a')}</p>
    </div>`;

    let otherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempElement.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
            `
        }
    })

    weatherForecastElement.innerHTML = otherDayForecast; 

}

