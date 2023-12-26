import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  msgLang: langType;
  text: string;
  user: string;
}

export type langType = "en" | "ar" | "fr" | "ko" | "zh-Hans";
export type languages = "English" | "Arabic" | "French" | "Korean" | "Chinese";

export interface ITransLanguages {
  key: langType;
  value: languages;
}

export interface IUser {
  id: string;
  room: string;
  userLang: langType;
  name: string;
}

export const transLanguages: ITransLanguages[] = [
  {
    key: "en",
    value: "English",
  },
  {
    key: "ar",
    value: "Arabic",
  },
  {
    key: "fr",
    value: "French",
  },
  {
    key: "ko",
    value: "Korean",
  },
  {
    key: "zh-Hans",
    value: "Chinese",
  },
];

export const removeTextSpace = (text: string) => text.trim().toLowerCase();

export const translateText = async (text: string, msgLang: langType, toLang: langType) => {
  return await axios.post(
    `${process.env.REACT_APP_TRANSLATER_ENDPONT}/translate?api-version=3.0&from=${msgLang}&to=${toLang}`,
    [
      {
        text: text,
      },
    ],
    {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.REACT_APP_TRANSLATER_KEY,
        // location required if you're using a multi-service or regional (not global) resource.
        "Ocp-Apim-Subscription-Region": process.env.REACT_APP_TRANSLATER_LOCATION,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4(),
      },
    }
  );
};
