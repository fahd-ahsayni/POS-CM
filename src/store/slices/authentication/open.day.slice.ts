import { RootState } from "@/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state interface
interface DayStatusState {
  isOpen: boolean | null;
  info: any | null; // Replace 'any' with a more specific type if possible
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: DayStatusState = {
  isOpen: null,
  info: null,
  status: "idle",
  error: null,
};

// Async thunk to check if the day is open
export const checkOpenDay = createAsyncThunk(
  "dayStatus/checkOpenDay",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/days/check-open`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        return { isOpen: false };
      } else if (response.status === 200) {
        const data = await response.json();
        return { isOpen: true, info: data };
      } else {
        return rejectWithValue("Unexpected response status");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to open the day
export const openDay = createAsyncThunk(
  "dayStatus/openDay",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/days/open`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        return { isOpen: true, info: data };
      } else {
        return rejectWithValue("Failed to open the day");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      return rejectWithValue(errorMessage);
    }
  }
);

const dayStatusSlice = createSlice({
  name: "dayStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkOpenDay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        checkOpenDay.fulfilled,
        (state, action: PayloadAction<{ isOpen: boolean; info?: any }>) => {
          state.status = "succeeded";
          state.isOpen = action.payload.isOpen;
          state.info = action.payload.info || null;
        }
      )
      .addCase(checkOpenDay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(openDay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        openDay.fulfilled,
        (state, action: PayloadAction<{ isOpen: boolean; info?: any }>) => {
          state.status = "succeeded";
          state.isOpen = action.payload.isOpen;
          state.info = action.payload.info || null;
        }
      )
      .addCase(openDay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default dayStatusSlice.reducer;
