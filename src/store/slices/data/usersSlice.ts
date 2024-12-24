// src/store/slices/data/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createApiInstance } from "@/api/axiosInstance";
import axios from "axios";
import { User } from "@/types";

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

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    const apiInstance = createApiInstance("", true);
    try {
      const [cashiersResponse, managersResponse] = await Promise.all([
        apiInstance.get<User[]>(
          `${import.meta.env.VITE_BASE_URL}/users?position=Cashier`,
          { timeout: 5000 }
        ),
        apiInstance.get<User[]>(
          `${import.meta.env.VITE_BASE_URL}/users?position=Manager`,
          { timeout: 5000 }
        ),
      ]);

      if (!cashiersResponse.data || !managersResponse.data) {
        throw new Error("Invalid response data received");
      }

      return {
        cashiers: cashiersResponse.data,
        managers: managersResponse.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return rejectWithValue(message);
      }
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
        
        // Save users to local storage
        localStorage.setItem('users', JSON.stringify(action.payload));
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
