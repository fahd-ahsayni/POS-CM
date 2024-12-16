// src/store/slices/data/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: number;
  name: string;
  imageUrl: string;
}

interface UserState {
  users: {
    cashiers: User[];
    managers: User[];
  };
  searchQuery: string;
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: {
    cashiers: [],
    managers: [],
  },
  searchQuery: "",
  selectedUser: null,
  loading: false,
  error: null,
};

// Updated endpoint to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const headers = {
        Authorization: `Api-Key ${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json",
      };

      const [cashiersResponse, managersResponse] = await Promise.all([
        axios.get<User[]>(import.meta.env.VITE_API_USERS_CASHIERS, {
          headers,
          timeout: 5000, // 5 second timeout
        }),
        axios.get<User[]>(import.meta.env.VITE_API_USERS_MANAGERS, {
          headers,
          timeout: 5000,
        }),
      ]);

      // Validate responses
      if (!cashiersResponse.data || !managersResponse.data) {
        throw new Error("Invalid response data received");
      }

      const result = {
        cashiers: cashiersResponse.data,
        managers: managersResponse.data,
      };

      // Development only logging
      if (import.meta.env.DEV) {
        console.log("Cashiers Response:", cashiersResponse.data);
        console.log("Managers Response:", managersResponse.data);
        console.log("Combined Users Result:", result);
      }

      return result;
    } catch (error) {
      // Proper error handling with type checking
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        console.error("API Error:", message);
        return rejectWithValue(message);
      }
      // Handle non-Axios errors
      console.error("Unexpected Error:", error);
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
      console.log("User selected in Redux:", action.payload);
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
        console.error("Failed to load users:", action.error);
      });
  },
});

export const { setSearchQuery, setSelectedUser, clearSelectedUser } =
  userSlice.actions;
export default userSlice.reducer;
