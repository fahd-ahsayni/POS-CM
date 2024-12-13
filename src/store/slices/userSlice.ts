import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: UserState = {
  users: {
    cashiers: [
      { id: 1, name: "John Doe", imageUrl: "https://via.placeholder.com/150" },
      { id: 2, name: "Jane Smith", imageUrl: "https://via.placeholder.com/150" },
      { id: 3, name: "Alice Johnson", imageUrl: "https://via.placeholder.com/150" },
      { id: 4, name: "Bob Brown", imageUrl: "https://via.placeholder.com/150" },
    ],
    managers: [
      { id: 1, name: "Hassan El-Sayed", imageUrl: "https://via.placeholder.com/150" },
      { id: 2, name: "Mohamed El-Sayed", imageUrl: "https://via.placeholder.com/150" },
    ],
  },
  searchQuery: '',
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = userSlice.actions;
export default userSlice.reducer; 