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
      { id: 1, name: "John", imageUrl: "https://images.pexels.com/photos/27523299/pexels-photo-27523299/free-photo-of-mode-modele-portrait-verres.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2, name: "Jane", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 3, name: "Alice", imageUrl: "https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { id: 4, name: "Bob", imageUrl: "https://plus.unsplash.com/premium_photo-1682096252599-e8536cd97d2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
    managers: [
      { id: 1, name: "Hassan", imageUrl: "https://via.placeholder.com/150" },
      { id: 2, name: "Mohamed", imageUrl: "https://via.placeholder.com/150" },
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