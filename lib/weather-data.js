class WeatherData {
  constructor(cityName, description, minTemp, maxTemp, humidity, countrycode, windspeed, feels_like, weatherid) {
    this.cityName = cityName;
    this.description = description;
    this.temperature = '';
    this.minTemp = minTemp;
    this.maxTemp = maxTemp;
    this.humidity = humidity;
    this.countrycode = countrycode;
    this.windspeed = windspeed;
    this.feels_like = feels_like;
    this.weatherid = weatherid;
  }
}

export { WeatherData };