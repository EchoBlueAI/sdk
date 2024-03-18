import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// get token from local storage
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("x-authorization-echoblue");
};

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
    headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
  }),
  endpoints: () => ({}),
});
