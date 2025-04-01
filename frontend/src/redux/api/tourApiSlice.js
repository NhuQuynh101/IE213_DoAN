import { apiSlice } from "./apiSlice";
import { TOUR_URL } from "../constants";

export const tourApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTour: builder.mutation({
            query: (tour) => ({
                url: `${TOUR_URL}`,
                method: "POST",
                body: tour,
            }),
        }),
    }),
});

export const { useCreateTourMutation } = tourApiSlice;
