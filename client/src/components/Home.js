import React, { useState, useEffect } from 'react';
import { getData, getHistory } from './db-connection-functions';
import ReactAnimatedWeather from 'react-animated-weather';
import moment from 'moment';
import './Home.css';

import Charts from './Charts';
import ChartArea from './ChartArea';
import clearDay from '../img/weather/clearDay.svg'
import clearNight from '../img/weather/clearNight.svg'
import cloudy from '../img/weather/cloudy.svg'
import fog from '../img/weather/fog.svg'
import partlyCloudyDay from '../img/weather/partlyCloudyDay.svg'
import partlyCloudyNight from '../img/weather/partlyCloudyNight.svg'
import rain from '../img/weather/rain.svg'
import sleet from '../img/weather/sleet.svg'
import snow from '../img/weather/snow.svg'
import wind from '../img/weather/wind.svg'
import precip from '../img/climate-icons/precipitation.svg'
import aq from '../img/climate-icons/aq.svg'
import co2emission from '../img/climate-icons/co2emission.svg'
import humidity from '../img/climate-icons/humidity.svg'
import visibility from '../img/climate-icons/visibility.svg'
import windspeed from '../img/climate-icons/windspeed.svg'
import pressure from '../img/climate-icons/pressure.svg'
import apparent from '../img/climate-icons/apparent.svg'

function Home({ isLogin }) {
  const [geolocation, setGeolocation] = useState();
  const [data, setData] = useState();
  const [history, setHistory] = useState();
  const [forcast, setForcast] = useState();
  const [chartData, setChartData] = useState();


  useEffect(() => {
    getGeolocation();
  }, []);

  useEffect(() => {
    if (geolocation) getData(geolocation, isLogin, setData); 
  }, [geolocation]);


  useEffect(() => {
    if (data) {
      getHistory(isLogin, setHistory);
      
      const forecastArray = data.weather.daily.data.map(day => { 
        return {
          name: moment(parseInt(day.time + '000')).format('dddd')[0], 
          high: Math.round(day.temperatureMax), 
          low: Math.round(day.temperatureMin) 
        }
      });

      setForcast(forecastArray);
      console.log('data :', data)
    }
  }, [data]);

  useEffect(() => {
    console.log('history :', history)
  }, [history]);

  useEffect(() => {
    console.log('forcast :', forcast)
  }, [forcast])

  useEffect(() => {
    console.log('chartData:', chartData)
  }, [chartData]);
  
  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      // Kyoto
      setGeolocation({ lat: 34.977940, long: 135.805200 })

      // New Delhi
      // setGeolocation({ lat: 28.648724, long: 77.195002 })


      // setGeolocation({ lat: position.coords.latitude, long: position.coords.longitude })
    });
  }

  const getWeatherIcon = (weather) => {
    switch(weather) {
      case "partly-cloudy-day" :
        return (<img className="summary__weathericon--size" src={partlyCloudyDay} />)
      case "partly-cloudy-night" :
        return (<img className="summary__weathericon--size" src={partlyCloudyNight} />)
      case "clear-day" :
        return (<img className="summary__weathericon--size" src={clearDay} />)
      case "clear-night" :
        return (<img className="summary__weathericon--size" src={clearNight} />)
      case "cloudy" :
        return (<img className="summary__weathericon--size" src={cloudy} />)
      case "fog" :
        return (<img className="summary__weathericon--size" src={fog} />)
      case "rain" :
        return (<img className="summary__weathericon--size" src={rain} />)
      case "sleet" :
        return (<img className="summary__weathericon--size" src={sleet} />)
      case "snow" :
        return (<img className="summary__weathericon--size" src={snow} />)
      case "wind" :
        return (<img className="summary__weathericon--size" src={wind} />)
    }
  }

  const getAQI = (value) => {
    if (value < 75) return (<p className="textGreen">{value} AQI</p>)
    if (value < 175) return (<p className="textYellow">{value} AQI</p>)
    if (value > 175) return (<p className="textRed">{value} AQI</p>)
  }

  const getCO2 = (value) => {
    if (value < 100) return (<p className="textGreen">{value} gCO2/kWh</p>)
    if (value < 300) return (<p className="textYellow">{value} gCO2/kWh</p>)
    if (value > 300) return (<p className="textRed">{value} gCO2/kWh</p>)
  }

  const defaults = {
    icon: 'WIND',
    color: 'white',
    size: 350,
    animate: true
  };

  return (

    <div className="Home">
      <div className="Home__body">
        {!data ?
          <div className="Home__spinner">
            <ReactAnimatedWeather
              icon={defaults.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}/>
          </div> :
          
          <div className="Home__summary">

            <div className="Home__summary_location" onClick={() => { setChartData() }}>
              <h1>{data.location.county ? data.location.county : data.location.city}</h1>
              <h6>{data.location.suburb}</h6>
            </div>

            <div className="Home__summary__temp" onClick={() => { setChartData() }}>
              <p>{Math.round(data.weather.currently.temperature)}°</p>
            </div>

            <div className="Home__summary__weathericon" onClick={() => { setChartData() }}>
              {getWeatherIcon(data.weather.currently.icon)}
            </div>

            <div className="Home__summary__apparentPrecipitation">
              <div className="Home__summary__apparent" onClick={() => { 
                setChartData( history.history.map( ({timeStamp, temp}) => ({timeStamp, label: "Temperature History", value: temp}) ) )
                }}>   
                <img className="Home__summary__icon" src={apparent} /> 
                <p>{Math.round(data.weather.currently.apparentTemperature)} °C</p>
              </div>

              <div className="Home__summary__precipitation" onClick={() => { 
                setChartData( history.history.map( ({timeStamp, precip}) => ({timeStamp, label: "Precipitation History", value: precip}) ) )
                }}>
                <img className="Home__summary__icon" src={precip} />
                <p>{data.weather.currently.precipProbability}%</p>
              </div>
            </div>

            <div className="Home__summary__summary" onClick={() => { setChartData() }}>
              <p><b>{data.weather.currently.summary}</b></p>
            </div>
            
            <div className="Home__summary__chart summary__item--full">
              { !chartData ? <Charts chartData={forcast} /> : <ChartArea chartData={chartData} /> }
            </div>

            <div className="Home__summary__humidity" onClick={() => { 
              setChartData( history.history.map( ({timeStamp, aqi}) => ({timeStamp, label: "Humidity History", value: aqi}) ) )
              }}>
              <img className="Home__summary__icon" src={humidity} />
              <p>{Math.round(data.weather.currently.humidity*100)} %</p>
            </div>
            
            <div className="Home__summary__pressure" onClick={() => { 
              setChartData( history.history.map( ({timeStamp, pressure}) => ({timeStamp, label: "Pressure History", value: pressure}) ) )
              }}>
              <img className="Home__summary__icon" src={pressure} />
              <p>{Math.round(data.weather.currently.pressure)} hPa</p>
            </div>
            
            <div className="Home__summary__windspeed" onClick={() => { 
              setChartData( history.history.map( ({timeStamp, windspeed}) => ({timeStamp, label: "Windspeed History", value: windspeed}) ) )
              }}>
            <img className="Home__summary__icon" src={windspeed} />
            <p>{Math.round(data.weather.currently.windSpeed)} m/s</p>
            </div>
            
            <div className="Home__summary__visibility" onClick={() => { 
              setChartData( history.history.map( ({timeStamp, visibility}) => ({timeStamp, label: "Visibility History", value: visibility}) ) )
              }}>
            <img className="Home__summary__icon" src={visibility} />
            <p>{Math.round(data.weather.currently.visibility)} km</p>
            </div>

            <div className="Home__summary__emission" onClick={() => { 
              setChartData( history.history.map( ({timeStamp, co2}) => ({timeStamp, label: "CO2 Emission History", value: co2}) ) )
              }}>
              <img className="Home__summary__icon" src={co2emission} />
              {data.co2.data.carbonIntensity ? getCO2(Math.round(data.co2.data.carbonIntensity)) : <p>N/A</p>}
            </div>
            
            <div className="Home__summary__aq" onClick={() => { 
              setChartData( history.history.map( ({timeStamp, aqi}) => ({timeStamp, label: "Air Quality Index History", value: aqi}) ) )
              }}>
              <img className="Home__summary__icon" src={aq} />
              {getAQI(data.aq.aqius)}
            </div>
  
          </div>
        }
      </div>
    </div>
  );
}

export default Home;