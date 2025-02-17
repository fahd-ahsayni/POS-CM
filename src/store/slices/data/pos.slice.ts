// src/store/slices/data/posSlice.ts
import { DayData, PosData } from "@/interfaces/pos";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface PosState {
  data: {
    pos: PosData[]; // pos is directly an array of PosData
    day: DayData;
  };
  loading: boolean;
  error: string | null;
}

// Initial state as a constant
const initialState: PosState = {
  data: {
    pos: [],
    day: {
      _id: "",
      name: "",
      opening_time: "",
      closing_time: null,
      status: "",
      revenue_system: 0,
      revenue_declared: 0,
      difference: 0,
      cancel_total_amount: 0,
      is_archived: false,
      opening_employee_id: "",
      createdAt: "",
      updatedAt: "",
    },
  },
  loading: false,
  error: null,
};

// Thunk with proper error handling and type safety
export const fetchPosData = createAsyncThunk(
  "pos/fetchPosData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      // Compute baseUrl dynamically
      const baseUrl = localStorage.getItem("ipAddress") || window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;
      
      const response = await axios.get<PosState["data"]>(
        `${baseUrl}/pos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch POS data"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Slice with proper type annotations
const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    clearPosData: (state) => {
      state.data.pos = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
        state.error = null;
      })
      .addCase(fetchPosData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectPosData = (state: { pos: PosState }) => state.pos.data;
export const selectPosLoading = (state: { pos: PosState }) => state.pos.loading;
export const selectPosError = (state: { pos: PosState }) => state.pos.error;

export const { clearPosData } = posSlice.actions;
export default posSlice.reducer;
