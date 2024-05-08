import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";

const jsonFormat = `{
  restaurants: [
    {
      locationName: "",
      detials: "",
      locationCoordinates: { latitude: , longitude:  },
      timings:""
    },
  ];
  music_events: [
    {
      locationName: "",
      detials: "",
      locationCoordinates: { latitude: , longitude:  },
      timings:""
    },
  ];
  sport_events: [
    {
      locationName: "",
      detials: "",
      locationCoordinates: { latitude: , longitude:  },
      timings:""
    },
  ];
}`;

const getLocationData = async () => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      city: response.data.city,
      country: response.data.country_name,
    };
  } catch (error) {
    console.error("Error fetching user location:", error);
    return null;
  }
};

const getWeatherData = async (latitude: string, longitude: string) => {
  const apiKey = "7d1b05e6159a9185eab09371e32077ce";
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );
    return response.data.weather[0].description;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    return null;
  }
};

const getEventData = async (location: string, weather: string) => {
  const apiKey =
    "d5b0d61dc4d86a6fd3ab3a57babeb743b618661de204ef825524575ec9c9329c";
  try {
    const response = await axios.get(
      `https://serpapi.com/search.json?q=${location}+musical-events&${weather}&api_key=${apiKey}`
    );

    if (response.status !== 200) {
      return [];
    }

    const events = ((await response.data.organic_results) ?? []) as {
      title: string;
    }[];

    const music = await axios.get(
      `https://serpapi.com/search.json?q=${location}+musical-events&${weather}&api_key=${apiKey}`
    );
    const music_events = ((await music.data.organic_results) ?? []) as {
      title: string;
    }[];
    const restaurants = await axios.get(
      `https://serpapi.com/search.json?q=${location}+restuarants&${weather}&api_key=${apiKey}`
    );
    const restaurant_events = ((await restaurants.data.organic_results) ??
      []) as {
      title: string;
    }[];

    const organicSearch = events.map((event) => event.title);
    return [
      ...organicSearch,
      ...restaurant_events.map((event) => event.title),
      ...music_events.map((event) => event.title),
    ];
  } catch (error) {
    console.error("Error searching  events:", error);
    return [];
  }
};

const generateRecommendationsWithGemini = async () => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCromoRTiT3M9ZxnYvw_I3cSPbuNvTHhmo"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // const location = await getLocationData();
  // if (!location) return;

  // const weather = await getWeatherData(location.latitude, location.longitude);
  // if (!weather) return;

  const events = await getEventData("chicago", "clody");
  if (!events) return;

  const prompt = `Based on the current weather cloudy and event data ${events.join(
    ", "
  )} suggest me few activities`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const text = response.text();
  return text;
};

const generateRecommendationsWithOpenAI = async () => {
  // const openaiApiKey = "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";
  const openaiApiKey = "replace-with-your-key";
  const location = await getLocationData();
  if (!location) return;

  const weather = await getWeatherData(location.latitude, location.longitude);
  if (!weather) return;

  const events = await getEventData(location.city, weather);
  if (!events) return;

  const prompt = `Based on the current weather ${weather}, location ${
    location.city
  }
  } and event data ${events.join(
    ", "
  )} suggest me three restaurants, musical events/concerts and three sport events in the following json format {
    restaurants: [
      {
        locationName: "",
        detials: "",
        locationCoordinates: { latitude: , longitude:  },
        timings:""
      },
    ];
    music_events: [
      {
        locationName: "",
        detials: "",
        locationCoordinates: { latitude: , longitude:  },
        timings:""
      },
    ];
    sport_events: [
      {
        locationName: "",
        detials: "",
        locationCoordinates: { latitude: , longitude:  },
        timings:""
      },
    ];
  } and put two line details in details, put timing detials  in timings and give the result as a json object`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
    }
  );
  return {
    data: response.data.choices[0].message.content.trim(),
    weather: weather,
  };
};

export const getRecommendations = async (req: Request, res: Response) => {
  const activities = await generateRecommendationsWithOpenAI();
  return res.status(200).json({
    activitieData: JSON.parse(activities?.data),
    status: 200,
    weather: activities?.weather,
  });
};
