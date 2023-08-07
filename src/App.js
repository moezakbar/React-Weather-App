import './App.css';
// import UilReact from '@iconscout/react-unicons/icons/uil-react';
import TopButtons from './Components/TopButtons';
import Inputs from './Components/Inputs';
import TimeLocation from './Components/TimeLocation';
import TemperatureAndDetails from './Components/TemperatureAndDetails';
import Forecast from './Components/Forecast';
// import getWeatherData from './Services/weatherService';
import getFormattedWeatherData from './Services/weatherService';
import { useEffect, useState } from "react";

function App() {

  const [query, setQuery] = useState({ q: "lahore" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      await getFormattedWeatherData({...query, units}).then(
        (data) => {
          console.log(data)
          setWeather(data);
        }
      );
    }
    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };

  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}>

      <TopButtons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits}/>

      {weather && (
        <div>
          <TimeLocation weather={weather}/>
          <TemperatureAndDetails weather={weather}/>

          <Forecast title="hourly forecast" items={weather.hourly}/>
          <Forecast title="daily forecast" items={weather.daily}/>
        </div>
      )}

      
     </div>
  );
}

export default App;
