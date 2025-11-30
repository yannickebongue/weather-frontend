import { Operation } from "express-openapi";
import axios from "axios";
import https from "node:https";

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: Record<string, number>;
}

export const get: Operation = async (req, res) => {
  const config = {
    params: {
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      timezone: "auto",
      timeformat: "unixtime",
      current: ["temperature_2m", "apparent_temperature", "is_day", "rain", "snowfall", "cloud_cover"]
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  };
  const response = await axios.get<WeatherData>(`https://api.open-meteo.com/v1/forecast`, config);
  const data = response.data;
  res.status(200).json({
    latitude: data.latitude,
    longitude: data.longitude,
    elevation: data.elevation,
    timezone: data.timezone,
    time: new Date(data.current.time * 1000),
    current: {
      temperature: data.current.temperature_2m,
      is_day: data.current.is_day,
      rain: data.current.rain,
      snowfall: data.current.snowfall,
      cloud_cover: data.current.cloud_cover
    }
  });
};
