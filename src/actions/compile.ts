'use server'
import axios from "axios";
import { LANGUAGE_VERSIONS } from "@/constants/languages";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});
//this is important function
export const executeCode = async (language : string, sourceCode : string) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};