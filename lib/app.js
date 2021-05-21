import * as ELEMENTS from './elements.js';
import * as APP_IDS from './constant.js';
import Http from './http.js';
import { WeatherData } from './weather-data.js';
import { WEATHER_PROXY_HANDLER } from './traps.js';
import { language, weatherIcons, weatherConditions } from './helpers.js'

const APP_ID = APP_IDS.APP_ID['weather-app'];

let locale, dir;
fetchLanguages();

ELEMENTS.ELEMENT_SEARCH_BUTTON.addEventListener('click', searchWeather);
ELEMENTS.ELEMENT_SELECT_LANGUAGE.addEventListener('change', setLocale);

function setLocale() {
    locale = this.value;
    dir =  locale === 'ar' ? 'rtl' : 'ltr';
}

function searchWeather () {
    let CITY_NAME = ELEMENTS.ELEMENT_SEARCHED_CITY.value.trim();
    
    if(CITY_NAME.length === 0) {
        return showError('City name cannot be blank.');
    }

    ELEMENTS.ELEMENT_LOADER.style.display = 'block';
    ELEMENTS.ELEMENT_WEATHER_BOX.style.display = 'none';
    // &units=metric

    const selectedLang = ELEMENTS.ELEMENT_SELECT_LANGUAGE.value;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${APP_ID}&units=metric&lang=${selectedLang}`;

   Http.fetchData(URL)
        .then(res => {
            // console.log('res-->', res);
            CITY_NAME = res.name;
            const WEATHER_DATA = new WeatherData(CITY_NAME, res.weather[0].description, res.main.temp_min, res.main.temp_max, res.main.humidity, res.sys.country, res.wind.speed, res.main.feels_like, res.weather[0].id);
            const WEATHER_PROXY = new Proxy(WEATHER_DATA, WEATHER_PROXY_HANDLER);

            WEATHER_PROXY.temperature = res.main.temp;

            console.log('WEATHER_PROXY', WEATHER_PROXY.weatherid);
            updateWeather(WEATHER_PROXY);
        })
        .catch(err => {
            showError(err.message, err.cod);
        });

}

// Create obj of language of options to be added
function fetchLanguages() {
    for (const key in language) {
        const ELEMENT_CREATE_OPTION = document.createElement('option');
        ELEMENT_CREATE_OPTION.value = key;
        ELEMENT_CREATE_OPTION.text = language[key];
        ELEMENTS.ELEMENT_SELECT_LANGUAGE.appendChild(ELEMENT_CREATE_OPTION);
    };
}

function updateWeather (weatherData) {

    // console.log('weatherData', weatherData.weatherid);
    ELEMENTS.ELEMENT_WEATHER_CITY.innerText = weatherData.cityName;

    ELEMENTS.ELEMENT_WEATHER_DESCRIPTION.innerHTML = `
        <span dir=${dir}>&emsp;<span title="Weather Info"><i class="fas fa-rss"></i>
            &nbsp;${weatherData.description} </span>
             &emsp; <span dir=${dir} title="Wind Speed"><i class="fas fa-wind"></i>&nbsp;${weatherData.windspeed} m/sec </span>  
             &emsp; <span title="Humidity"><i class="fas fa-tint"></i> ${weatherData.humidity}%</span>
        </span>`;
        
    ELEMENTS.ELEMENT_WEATHER_TEMPERATURE.innerText = weatherData.temperature;

   
    const imageDesc = getImageBasedOnId(weatherData.weatherid);
    const image = getWeatherImage(imageDesc);
    const width = getWeatherWidth(image);

    ELEMENTS.ELEMENT_WEATHER_ICON.src = image;
    ELEMENTS.ELEMENT_WEATHER_ICON.width = width;

    ELEMENTS.ELEMENT_LOADER.style.display = 'none';
    ELEMENTS.ELEMENT_ERROR_BOX.style.display = 'none';
    ELEMENTS.ELEMENT_WEATHER_BOX.style.display = 'block';

}

const  getImageBasedOnId = id => {
    console.log('weatherConditions', weatherConditions, typeof weatherConditions);
    let imageType;
    for (const key in weatherConditions) {
        const keycheck = weatherConditions[key].includes(id);
        if(keycheck) {
            return key;
        }
    }
}

function getWeatherImage(imageType) {
    imageType = imageType.trim();
    let image;
    for (const weatherIcon in weatherIcons ) {
        if(weatherIcon == imageType) {
            image = weatherIcons[imageType];
        }
    }

    return image ?? weatherIcons['clear sky'];
}

function getWeatherWidth(imageType) {
    return imageType === 'broken clouds'
      ? '150'
      : '100';
}

function showError (errmessage, errcode=null) {
    firstLetterCapital();
    console.log(errmessage, errcode);
    ELEMENTS.ELEMENT_LOADER.style.display = 'none';
    ELEMENTS.ELEMENT_ERROR_CITY.innerHTML = `<img src= "https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/warning_alert_attention_search-256.png" width="40" /> ${errmessage.capitalize()}`;
    ELEMENTS.ELEMENT_WEATHER_BOX.style.display = 'none';
    ELEMENTS.ELEMENT_ERROR_BOX.style.display = 'block';
}

function firstLetterCapital() {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}