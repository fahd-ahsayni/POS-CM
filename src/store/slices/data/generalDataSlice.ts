// Import required modules
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types
export interface GeneralData {
  floors: object[];
  categories: object[];
  configs: object[];
  defineNote: object[];
  orderTypes: object[];
  discount: object[];
  paymentMethods: object[];
  waiters: object[];
  livreurs: object[];
}

interface GeneralDataState {
  data: GeneralData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Async thunk to fetch general data
export const fetchGeneralData = createAsyncThunk<
  GeneralData,
  string,
  { rejectValue: string }
>("generalData/fetchGeneralData", async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    console.log('Token:', token); // Debug token
    console.log('API URL:', `${import.meta.env.VITE_BASE_URL}/general-data/pos/67483260dfb27d34e5dfee58`); // Debug URL

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/general-data/pos/67483260dfb27d34e5dfee58`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("POS API Response:", response.data); // Debug full response
    console.log("POS Data Structure:", {
      status: response.status,
      headers: response.headers,
      data: response.data
    }); // Debug response structure
    
    return response.data;
  } catch (error: any) {
    console.error("POS API Error:", error); // Debug errors
    if (axios.isAxiosError(error)) {
      console.error("Error Response:", error.response?.data); // Debug error response
      return rejectWithValue(
        error.response?.data || "Failed to fetch POS data"
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// Create slice
const generalDataSlice = createSlice({
  name: "generalData",
  initialState: {
    data: {
      floors: [],
      categories: [],
      configs: [],
      defineNote: [],
      orderTypes: [],
      discount: [],
      paymentMethods: [],
      waiters: [],
      livreurs: [],
    },
    status: "idle",
    error: null,
  } as GeneralDataState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchGeneralData.fulfilled,
        (state, action: PayloadAction<GeneralData>) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addCase(
        fetchGeneralData.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Something went wrong";
        }
      );
  },
});

// Selectors
export const selectFloors = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.floors;
export const selectCategories = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.categories;
export const selectConfigs = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.configs;
export const selectDefineNote = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.defineNote;
export const selectOrderTypes = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.orderTypes;
export const selectDiscount = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.discount;
export const selectPaymentMethods = (state: {
  generalData: GeneralDataState;
}) => state.generalData.data.paymentMethods;
export const selectGeneralDataError = (state: {
  generalData: GeneralDataState;
}) => state.generalData.error;

// Export reducer
export default generalDataSlice.reducer;
