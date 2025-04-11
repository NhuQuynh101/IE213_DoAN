import { HOTEL_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const hotelApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHotels: builder.query({
            query: () => `${HOTEL_URL}`
        }),
    }),
});

export const { useGetHotelsQuery } = hotelApiSlice;