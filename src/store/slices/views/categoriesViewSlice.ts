import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CategoriesViewState = {
  currentView: "AllCategories" | "AllProducts";
};

const initialCategoriesViewState: CategoriesViewState = {
  currentView: "AllCategories",
};

export const categoriesViewSlice = createSlice({
  name: "categoriesView",
  initialState: initialCategoriesViewState,
  reducers: {
    setCurrentView: (
      state,
      action: PayloadAction<CategoriesViewState["currentView"]>
    ) => {
      state.currentView = action.payload;
    },
  },
});

export const { setCurrentView } = categoriesViewSlice.actions;
export default categoriesViewSlice.reducer;
