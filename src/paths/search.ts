import { Operation } from "express-openapi";
import axios from "axios";
import https from "node:https";

interface SearchLocationResult {
  results?: Location[];
  generationtime_ms: number;
}

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id?: number;
  admin2_id?: number;
  admin3_id?: number;
  admin4_id?: number;
  timezone: string;
  population: number;
  postcodes?: string[];
  country_id: number;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

export const get: Operation = async (req, res) => {
  const config = {
    params: {
      name: req.query.name,
      count: req.query.count,
      language: req.query.language,
      countryCode: req.query.countryCode
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  };
  const response = await axios.get<SearchLocationResult>(`https://geocoding-api.open-meteo.com/v1/search`, config);
  const results: Location[] = response.data.results ?? [];
  res.status(200).json({
    items: results.map((element) => ({
      id: element.id,
      name: element.name,
      latitude: element.latitude,
      longitude: element.longitude,
      elevation: element.elevation,
      timezone: element.timezone,
      country_code: element.country_code,
      country: element.country,
      population: element.population
    }))
  });
};
