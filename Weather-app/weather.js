const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiKey = "39f3167a3bf8ba8a99d5442746c20fb3";

const cityName = document.querySelector('.city');
const temp = document.querySelector('.temp');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const icon = document.querySelector('.weather-icon');
const weather = document.querySelector('.weather');
const error = document.querySelector('.error');


const search = document.querySelector('.search input')
const btn = document.querySelector('.search button')
const divHours = document.querySelector('.hours')

const dataCorrente = new Date();
const nomiGiorniSettimana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const giornoSettimanaCorrente = dataCorrente.getDay();


document.addEventListener("DOMContentLoaded", function () {
    init();
});

async function init(lat, long) {
    
    if( lat && long ){
        retriveWeather(lat,long);
    } else {
        let position = navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            retriveWeather(latitude, longitude);
           
        }, function (error) {
            console.log("Error:", error)
        });
        console.log(position)
    }
}


async function cheackWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        error.style.display = 'block';
        weather.style.display = 'none';
    }
    else {
        let data = await response.json();
        init(data.coord.lat, data.coord.lon)
    }
}

function roundToOneDecimal(number) {
    return Math.round(number * 10) / 10;
}

function kelvinToCelsius(kelvin) {
        const celsius = kelvin - 273.15;
        return celsius.toFixed(0);
  }


function getNextDay(data) {
    const nuovaData = new Date(data);
    nuovaData.setDate(nuovaData.getDate() + 1);
    const res = nuovaData.toLocaleDateString('en-GB', {year: 'numeric', month: 'numeric', day: 'numeric'});
    return res.split('/').reverse().join('-');
}

btn.addEventListener('click', () => {
    cheackWeather(search.value);
})

function retriveWeather(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {

        cityName.innerHTML = data.city.name;
        temp.innerHTML = kelvinToCelsius(data.list[0].main.temp) + "°c";
        icon.src = `images/${data.list[0].weather[0].main.toLowerCase()}.png`;
        humidity.innerHTML = data.list[0].main.humidity + "%";
        wind.innerHTML = data.list[0].wind.speed + "km/h";

       
        let tomorrow = getNextDay(new Date);
        for (var i = 1; i < 4; i++) {
            data.list[0]
            var giorno = (giornoSettimanaCorrente + i) % 7; 
            document.getElementById(`day${i}`).innerHTML = nomiGiorniSettimana[giorno];
            
            const nextTempDay = data.list.find(oggetto => oggetto.dt_txt === `${tomorrow} 12:00:00`);
            const weather = nextTempDay.weather[0].main.toLowerCase();

            document.getElementById(`temp-day${i}`).innerHTML = `${kelvinToCelsius( nextTempDay.main.temp )}°c`
            document.getElementById(`icon-day${i}`).src = `images/${weather}.png`
            tomorrow = getNextDay(tomorrow);
        }

        const regex = /(?:\s)(\S{2})/;

        const hourListElements = document.querySelectorAll('.hour-list');
        hourListElements.forEach(hourList => {
            hourList.parentNode.removeChild(hourList);
        });


        for (i = 1; i < 8; i++){
            const element = data.list[i];
            const time = element.dt_txt;
            const ora =  regex.exec(time);
            const weather = element.weather[0].main.toLowerCase();

            divHours.insertAdjacentHTML('beforeend', `<div class="hour-list"><p>${ora[1]}</p><img src="images/${weather}.png" class="weather-hour"></div>`);
        }
    });
}

