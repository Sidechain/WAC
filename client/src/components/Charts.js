import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, LabelList , AreaChart , Tooltip, Area, CartesianGrid, Label, ResponsiveContainer} from 'recharts';
import moment from 'moment';

// , CartesianGrid, Tooltip, Legend,

export default function Chart({ data, history }) {
  const [chartForecast, setChartForecast] = useState();
  const [chartAqi, setChartAqi] = useState();

  useEffect(() => {
     if(history){
      console.log(history)
      setChartAqi(history.history)
     }
  }, [history])

  useEffect(() => {
    const forecastArray = data.weather.daily.data.map(day => ({ name: moment(parseInt(day.time + '000')).format('dddd')[0], high: Math.round(day.temperatureMax), low: Math.round(day.temperatureMin) }));
    setChartForecast(forecastArray);
  }, [data])

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartForecast} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} >
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="high" stroke="#ffffff" fill="#fc3503" strokeWidth={2}>
            <LabelList dataKey="high" position="top" fill="#ffffff" fontSize="13"/>
          </Line>

          <Line type="monotone" dataKey="low" stroke="#ffffff" strokeWidth={2} fill="#039dfc">
            <LabelList dataKey="low" position="bottom" fill="#ffffff" fontSize="13"/>
          </Line>
          <XAxis dataKey="name"  padding={{ left: 20, right: 20}} stroke="#ffffff"/>
          <YAxis padding={{ top: 10 }} hide />
      </LineChart>
     </ResponsiveContainer>
    </div>
  );
}