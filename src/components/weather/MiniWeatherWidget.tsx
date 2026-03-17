'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, MapPin, Loader2 } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  location: string;
}

const DEFAULT_COORDS = { lat: 33.6844, lon: 73.0479, name: 'Islamabad' };

const weatherCodeMap: Record<number, { description: string; icon: React.ReactNode }> = {
  0: { description: 'Clear', icon: <Sun className="h-4 w-4 text-yellow-400" /> },
  1: { description: 'Mainly clear', icon: <Sun className="h-4 w-4 text-yellow-300" /> },
  2: { description: 'Partly cloudy', icon: <Cloud className="h-4 w-4 text-gray-400" /> },
  3: { description: 'Overcast', icon: <Cloud className="h-4 w-4 text-gray-500" /> },
  45: { description: 'Foggy', icon: <CloudFog className="h-4 w-4 text-gray-400" /> },
  48: { description: 'Foggy', icon: <CloudFog className="h-4 w-4 text-gray-400" /> },
  51: { description: 'Drizzle', icon: <CloudRain className="h-4 w-4 text-blue-400" /> },
  61: { description: 'Rain', icon: <CloudRain className="h-4 w-4 text-blue-500" /> },
  63: { description: 'Rain', icon: <CloudRain className="h-4 w-4 text-blue-500" /> },
  65: { description: 'Heavy rain', icon: <CloudRain className="h-4 w-4 text-blue-600" /> },
  71: { description: 'Snow', icon: <CloudSnow className="h-4 w-4 text-blue-200" /> },
  73: { description: 'Snow', icon: <CloudSnow className="h-4 w-4 text-blue-300" /> },
  80: { description: 'Showers', icon: <CloudRain className="h-4 w-4 text-blue-400" /> },
  95: { description: 'Thunder', icon: <CloudLightning className="h-4 w-4 text-yellow-500" /> },
};

function getWeatherInfo(code: number) {
  return weatherCodeMap[code] || { description: 'Unknown', icon: <Cloud className="h-4 w-4 text-gray-400" /> };
}

export function MiniWeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [requested, setRequested] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const fetchWeather = async (lat: number, lon: number, locationName: string) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        isDay: data.current.is_day === 1,
        location: locationName,
      });
    } catch (err) {
      console.error('Weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
      return;
    }

    setRequested(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationEnabled(true);
        fetchWeather(position.coords.latitude, position.coords.longitude, 'Your Location');
      },
      () => {
        fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode) : null;

  return (
    <div ref={widgetRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : weatherInfo ? (
          <>
            {weatherInfo.icon}
            <span className="text-sm font-medium">{weather?.temperature}°</span>
          </>
        ) : (
          <Sun className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {loading ? (
            <div className="p-4 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#1bab89]" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : weather ? (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {weatherInfo?.icon}
                  <span className="text-2xl font-bold">{weather.temperature}°C</span>
                </div>
                <span className="text-sm text-muted-foreground">{weatherInfo?.description}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{weather.location}</span>
              </div>
              <div className="flex gap-4 text-sm pt-2 border-t border-border">
                <div>
                  <span className="text-muted-foreground">Humidity</span>
                  <p className="font-medium">{weather.humidity}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Wind</span>
                  <p className="font-medium">{weather.windSpeed} km/h</p>
                </div>
              </div>
              
              {(!locationEnabled || !requested) && (
                <div className="pt-2 border-t border-border">
                  <button
                    onClick={requestLocation}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-[#1bab89] text-black rounded-lg hover:bg-[#158a6f] transition-colors font-medium"
                  >
                    <MapPin className="h-3 w-3" />
                    Enable Location
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">Unable to load weather</div>
          )}
        </div>
      )}
    </div>
  );
}
