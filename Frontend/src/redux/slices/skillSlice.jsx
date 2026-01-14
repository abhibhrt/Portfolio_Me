import { createSlice } from '@reduxjs/toolkit';
import initialData from '../data.json';

const dataSlice = createSlice({
  name: 'skills',
  initialState: {
    items: initialData,
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addItem, removeItem } = dataSlice.actions;
export default dataSlice.reducer;