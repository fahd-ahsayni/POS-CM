// src/store/slices/data/posSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the type for your POS data
interface PosData {
  _id: string;
  name: string;
  printer_ip: string;
  order_types: string[];
  createdAt: string;
  updatedAt: string;
  shift: null | string;
}

interface PosState {
  data: PosData[];
  loading: boolean;
  error: string | null;
}

const initialState: PosState = {
  data: [],
  loading: false,
  error: null,
};

// Create async thunk for fetching POS data
export const fetchPosData = createAsyncThunk(
  "pos/fetchPosData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/pos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("POS API Response:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch POS data"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    // Add any additional reducers here if needed
    clearPosData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchPosData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPosData } = posSlice.actions;
export default posSlice.reducer;
