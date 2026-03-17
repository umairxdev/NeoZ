'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, MapPin, Loader2, RefreshCw } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  location: string;
}

const WEATHER_STORAGE_KEY = 'neoz_weather_permission';
const DEFAULT_COORDS = { lat: 33.6844, lon: 73.0479, name: 'Islamabad' };

const weatherCodeMap: Record<number, { description: string; icon: React.ReactNode }> = {
  0: { description: 'Clear sky', icon: <Sun className="h-6 w-6 text-yellow-400" /> },
  1: { description: 'Mainly clear', icon: <Sun className="h-6 w-6 text-yellow-300" /> },
  2: { description: 'Partly cloudy', icon: <Cloud className="h-6 w-6 text-gray-400" /> },
  3: { description: 'Overcast', icon: <Cloud className="h-6 w-6 text-gray-500" /> },
  45: { description: 'Foggy', icon: <CloudFog className="h-6 w-6 text-gray-400" /> },
  48: { description: 'Foggy', icon: <CloudFog className="h-6 w-6 text-gray-400" /> },
  51: { description: 'Light drizzle', icon: <CloudRain className="h-6 w-6 text-blue-400" /> },
  53: { description: 'Drizzle', icon: <CloudRain className="h-6 w-6 text-blue-500" /> },
  55: { description: 'Dense drizzle', icon: <CloudRain className="h-6 w-6 text-blue-600" /> },
  61: { description: 'Light rain', icon: <CloudRain className="h-6 w-6 text-blue-400" /> },
  63: { description: 'Rain', icon: <CloudRain className="h-6 w-6 text-blue-500" /> },
  65: { description: 'Heavy rain', icon: <CloudRain className="h-6 w-6 text-blue-600" /> },
  71: { description: 'Light snow', icon: <CloudSnow className="h-6 w-6 text-blue-200" /> },
  73: { description: 'Snow', icon: <CloudSnow className="h-6 w-6 text-blue-300" /> },
  75: { description: 'Heavy snow', icon: <CloudSnow className="h-6 w-6 text-blue-400" /> },
  80: { description: 'Light showers', icon: <CloudRain className="h-6 w-6 text-blue-400" /> },
  81: { description: 'Showers', icon: <CloudRain className="h-6 w-6 text-blue-500" /> },
  82: { description: 'Heavy showers', icon: <CloudRain className="h-6 w-6 text-blue-600" /> },
  95: { description: 'Thunderstorm', icon: <CloudLightning className="h-6 w-6 text-yellow-500" /> },
  96: { description: 'Thunderstorm', icon: <CloudLightning className="h-6 w-6 text-yellow-600" /> },
  99: { description: 'Thunderstorm', icon: <CloudLightning className="h-6 w-6 text-yellow-700" /> },
};

function getWeatherInfo(code: number) {
  return weatherCodeMap[code] || { description: 'Unknown', icon: <Cloud className="h-6 w-6 text-gray-400" /> };
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionAsked, setPermissionAsked] = useState(false);

  const fetchWeather = async (lat: number, lon: number, locationName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch weather');
      
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
      console.error('Weather fetch error:', err);
      setError('Unable to load weather');
    } finally {
      setLoading(false);
    }
  };

  const initWeather = () => {
    const hasPermission = localStorage.getItem(WEATHER_STORAGE_KEY);
    
    if (!navigator.geolocation) {
      fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
      return;
    }

    if (hasPermission === 'granted') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, 'Your Location');
        },
        () => {
          fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
        }
      );
    } else if (hasPermission === 'denied') {
      fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
    } else {
      setPermissionAsked(true);
    }
  };

  const requestPermission = () => {
    localStorage.setItem(WEATHER_STORAGE_KEY, 'granted');
    setPermissionAsked(false);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude, 'Your Location');
      },
      () => {
        localStorage.setItem(WEATHER_STORAGE_KEY, 'denied');
        fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
      }
    );
  };

  const useDefaultLocation = () => {
    localStorage.setItem(WEATHER_STORAGE_KEY, 'denied');
    setPermissionAsked(false);
    fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
  };

  useEffect(() => {
    initWeather();
  }, []);

  if (permissionAsked) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1bab89]/10 rounded-lg">
            <MapPin className="h-5 w-5 text-[#1bab89]" />
          </div>
          <div>
            <p className="font-medium text-sm">Enable location for local weather?</p>
            <p className="text-xs text-muted-foreground">Or use Islamabad as default</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={useDefaultLocation}
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Use Islamabad
          </button>
          <button
            onClick={requestPermission}
            className="px-4 py-2 text-sm bg-[#1bab89] text-black rounded-lg hover:bg-[#158a6f] transition-colors font-medium"
          >
            Enable
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-[#1bab89]" />
        <span className="text-sm text-muted-foreground">Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const weatherInfo = getWeatherInfo(weather.weatherCode);

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${weather.isDay ? 'bg-yellow-400/10' : 'bg-blue-400/10'}`}>
          {weatherInfo.icon}
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-syne), system-ui' }}>
              {weather.temperature}°C
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{weatherInfo.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{weather.location}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>💧 {weather.humidity}%</span>
          <span>💨 {weather.windSpeed} km/h</span>
        </div>
        <button
          onClick={() => {
            const hasPermission = localStorage.getItem(WEATHER_STORAGE_KEY);
            if (hasPermission === 'granted') {
              navigator.geolocation.getCurrentPosition(
                (position) => fetchWeather(position.coords.latitude, position.coords.longitude, 'Your Location'),
                () => fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name)
              );
            } else {
              initWeather();
            }
          }}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
          title="Refresh weather"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
