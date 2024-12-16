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
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_USERS);
    return response.data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
      console.log('User selected in Redux:', action.payload);
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
