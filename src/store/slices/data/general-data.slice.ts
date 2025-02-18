import { logoutService } from "@/api/services";
// Import required modules
import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import axios from "axios";


// Async thunk to fetch general data
export const fetchGeneralData = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("generalData/fetchGeneralData", async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    // Compute baseUrl dynamically
    const baseUrl = localStorage.getItem("ipAddress") || window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;
    
    const generalDataResponse = await axios.get(
      `${baseUrl}/general-data/pos/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Save to localStorage without categories
    localStorage.setItem("generalData", JSON.stringify(generalDataResponse.data));
    
    return generalDataResponse.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        await logoutService();
      }
      return rejectWithValue(
        error.response?.data || "Failed to fetch POS data"
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// Async thunk to fetch paginated general data
export const fetchPaginatedGeneralData = createAsyncThunk<
  any,
  { id: string; page: number; limit: number },
  { rejectValue: string }
>(
  "generalData/fetchPaginatedGeneralData",
  async ({ id, page, limit }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // Compute baseUrl dynamically
      const baseUrl = localStorage.getItem("ipAddress") || window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;
      
      const response = await axios.get(
        `${baseUrl}/general-data/pos/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch paginated POS data"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Define initial state with localStorage check
const initialState: any = {
  data: JSON.parse(localStorage.getItem("generalData") || JSON.stringify({
    floors: [],
    configs: [],
    defineNote: [],
    orderTypes: [],
    discount: [],
    paymentMethods: [],
    waiters: [],
    livreurs: [],
  })),
  status: "idle",
  error: null,
};

// Create slice
const generalDataSlice = createSlice({
  name: "generalData",
  initialState,
  reducers: {
    // Add sync reducers if needed
    resetGeneralData: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchGeneralData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.data = action.payload;
          // Save data to local storage
          localStorage.setItem("generalData", JSON.stringify(action.payload));
        }
      )
      .addCase(
        fetchGeneralData.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Something went wrong";
        }
      )
      // Add cases for fetchPaginatedGeneralData
      .addCase(fetchPaginatedGeneralData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPaginatedGeneralData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        // Add localStorage save
        localStorage.setItem("generalData", JSON.stringify(action.payload));
      })
      .addCase(fetchPaginatedGeneralData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

// Export actions
export const { resetGeneralData } = generalDataSlice.actions;

// Create a single object for all selectors
export const generalDataSelectors = {
  selectGeneralData: (state: { generalData: any }) =>
    state.generalData.data,
  selectFloors: (state: { generalData: any }) =>
    state.generalData.data.floors,
  selectOrderTypes: (state: { generalData: any }) =>
    state.generalData.data.orderTypes,
};

// Export reducer
export default generalDataSlice.reducer;
