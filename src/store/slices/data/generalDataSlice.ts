// Import required modules
import { extractProducts } from "@/functions/extractProducts";
import { Category, GeneralData, GeneralDataState, Product } from "@/types";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch general data
export const fetchGeneralData = createAsyncThunk<
  GeneralData,
  string,
  { rejectValue: string }
>("generalData/fetchGeneralData", async (id, { rejectWithValue, dispatch }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/general-data/pos/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Check for 403 status code
      if (error.response?.status === 403) {
        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login page
        window.location.href = "/login";
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
  GeneralData,
  { id: string; page: number; limit: number },
  { rejectValue: string }
>(
  "generalData/fetchPaginatedGeneralData",
  async ({ id, page, limit }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/general-data/pos/${id}`,
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
      );
  },
});

// Add this before the existing selectAllProducts
const selectGeneralData = (state: { generalData: GeneralDataState }) =>
  state.generalData.data;

export const selectAllProducts = createSelector(
  [selectGeneralData],
  (generalData) => {
    return extractProducts(generalData.categories);
  }
);

// Other Selectors
export const selectFloors = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.floors;
export const selectCategories = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.categories;

export const selectOrderTypes = (state: { generalData: GeneralDataState }) =>
  state.generalData.data.orderTypes;

// Export reducer
export default generalDataSlice.reducer;
