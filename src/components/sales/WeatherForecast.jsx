import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets } from 'lucide-react';

const WMO_CODES = {
  0: { label: 'Clear', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  1: { label: 'Mostly Clear', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-50' },
  2: { label: 'Partly Cloudy', icon: Cloud, color: 'text-gray-400', bg: 'bg-gray-50' },
  3: { label: 'Overcast', icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-50' },
  45: { label: 'Foggy', icon: Wind, color: 'text-gray-400', bg: 'bg-gray-50' },
  48: { label: 'Foggy', icon: Wind, color: 'text-gray-400', bg: 'bg-gray-50' },
  51: { label: 'Light Drizzle', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-50' },
  53: { label: 'Drizzle', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
  55: { label: 'Heavy Drizzle', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50' },
  61: { label: 'Light Rain', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-50' },
  63: { label: 'Rain', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
  65: { label: 'Heavy Rain', icon: CloudRain, color: 'text-blue-700', bg: 'bg-blue-100' },
  71: { label: 'Light Snow', icon: CloudSnow, color: 'text-sky-400', bg: 'bg-sky-50' },
  73: { label: 'Snow', icon: CloudSnow, color: 'text-sky-500', bg: 'bg-sky-50' },
  75: { label: 'Heavy Snow', icon: CloudSnow, color: 'text-sky-600', bg: 'bg-sky-100' },
  80: { label: 'Rain Showers', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
  81: { label: 'Rain Showers', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50' },
  82: { label: 'Heavy Showers', icon: CloudRain, color: 'text-blue-700', bg: 'bg-blue-100' },
  95: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-600', bg: 'bg-purple-50' },
  96: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-700', bg: 'bg-purple-100' },
  99: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-700', bg: 'bg-purple-100' }
};

function getWeatherInfo(code) {
  return WMO_CODES[code] || WMO_CODES[0];
}

// NYC coords as default — will update when zip is available
const DEFAULT_LAT = 40.7128;
const DEFAULT_LON = -74.0060;

export default function WeatherForecast({ selectedDate, city }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);
    setForecast(null);

    // Use Open-Meteo — free, no API key needed
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LON}` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/New_York&forecast_days=7`
    ).
    then((r) => r.json()).
    then((data) => {
      const days = data.daily.time.map((date, i) => ({
        date,
        code: data.daily.weathercode[i],
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        precip: data.daily.precipitation_probability_max[i],
        wind: Math.round(data.daily.windspeed_10m_max[i])
      }));
      setForecast(days);

      // Auto-highlight the selected date if in range
      const match = days.find((d) => d.date === selectedDate);
      if (match) setSelectedDay(match.date);else
      setSelectedDay(days[0]?.date);
    }).
    catch(() => setForecast(null)).
    finally(() => setLoading(false));
  }, [selectedDate]);

  if (!selectedDate) return null;

  const selectedDayData = forecast?.find((d) => d.date === selectedDay);
  const saleDay = forecast?.find((d) => d.date === selectedDate);

  const isGoodWeather = (code) => [0, 1, 2].includes(code);
  const isBadWeather = (code) => [63, 65, 80, 81, 82, 95, 96, 99, 73, 75].includes(code);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="mt-4 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-4">
        
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-[#2E3A59] text-sm flex items-center gap-1.5">
            🌤️ 7-Day Weather Forecast
            {city && <span className="text-gray-400 font-normal">· {city}</span>}
          </h4>
          {saleDay &&
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isGoodWeather(saleDay.code) ? 'bg-green-100 text-green-700' :
          isBadWeather(saleDay.code) ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'}`
          }>
              {isGoodWeather(saleDay.code) ? '☀️ Great day!' :
            isBadWeather(saleDay.code) ? '🌧️ Consider rescheduling' :
            '🌥️ Decent day'}
            </span>
          }
        </div>

        {loading &&
        <div className="flex gap-2">
            {[...Array(7)].map((_, i) =>
          <div key={i} className="flex-1 h-16 bg-white/60 rounded-xl animate-pulse" />
          )}
          </div>
        }

        {forecast &&
        <>
            {/* Day pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {forecast.map((day) => {
              const info = getWeatherInfo(day.code);
              const Icon = info.icon;
              const isSelected = day.date === selectedDay;
              const isSaleDate = day.date === selectedDate;
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(day.date)} className="bg-white/50 mx-1 my-1 px-3 py-2 rounded-xl flex-shrink-0 flex flex-col items-center gap-1 border-2 transition-all min-w-[56px] border-transparent hover:bg-white/80 ring-2 ring-[#FF6F61] ring-offset-1">





                  
                    <span className="text-[10px] font-semibold text-gray-500 uppercase">
                      {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <Icon className={`w-4 h-4 ${info.color}`} />
                    <span className="text-xs font-bold text-[#2E3A59]">{day.high}°</span>
                    {isSaleDate &&
                  <span className="text-[8px] font-bold text-[#FF6F61] uppercase tracking-wide">Sale</span>
                  }
                  </button>);

            })}
            </div>

            {/* Detail panel for selected day */}
            {selectedDayData &&
          <motion.div
            key={selectedDayData.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 bg-white rounded-xl px-4 py-3 flex items-center justify-between">
            
                {(() => {
              const info = getWeatherInfo(selectedDayData.code);
              const Icon = info.icon;
              return (
                <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-7 h-7 ${info.color}`} />
                        <div>
                          <p className="font-semibold text-sm text-[#2E3A59]">{info.label}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(selectedDayData.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div className="text-center">
                          <p className="font-bold text-[#2E3A59]">{selectedDayData.high}° / {selectedDayData.low}°</p>
                          <p className="text-xs text-gray-400">High / Low</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-blue-500 flex items-center gap-0.5">
                            <Droplets className="w-3 h-3" />{selectedDayData.precip}%
                          </p>
                          <p className="text-xs text-gray-400">Rain</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-gray-500 flex items-center gap-0.5">
                            <Wind className="w-3 h-3" />{selectedDayData.wind}
                          </p>
                          <p className="text-xs text-gray-400">mph</p>
                        </div>
                      </div>
                    </>);

            })()}
              </motion.div>
          }
          </>
        }
      </motion.div>
    </AnimatePresence>);

}