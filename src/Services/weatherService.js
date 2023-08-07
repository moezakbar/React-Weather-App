import { DateTime } from "luxon";

const API_KEY = "e6faddbd2303a5f37553a128d580c8d9";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=1fa9ff4126d95b8db54f3897a208e91c&units=metric

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lon, lat },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
  let { city, list } = data;

  const timezone = data.city.timezone;
  let daily = [];
  let hourly = [];
  
  // Variable to keep track of the current date for filtering daily data
  let currentDate = null;

  list.forEach((item) => {
    const { dt, main, weather } = item;
    const { temp} = main;
    const { icon } = weather[0];

    const formattedDate = formatToLocalTime(dt, timezone, "ccc");
    const hourPart = formatToLocalTime(dt, timezone, "HH")

     // Check if the current item is for 12:00 PM (hour is equal to 12)
     if (hourPart === "12") {
      // Check if the current date is different from the previous date
      if (formattedDate !== currentDate) {
        daily.push({
          title: formatToLocalTime(dt, timezone, "ccc"),
          temp: temp,
          icon,
        });

        // Update the currentDate to the current formattedDate
        currentDate = formattedDate;
      }
    }

    // For hourly data, format the time to "hh:mm a"
    const formattedTime = formatToLocalTime(dt, timezone, "hh:mm a");
    hourly.push({
      title: formattedTime,
      temp: temp,
      icon,
    });
  });

  hourly = hourly.slice(1,6)
  daily = daily.slice(1,6)

  return { timezone: city.timezone, daily, hourly };
};



const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };