import { create } from 'zustand';
import { Category } from '@/types/database';

interface CategoryState {
  categories: Category[];
  activeCategoryId: string;
  setCategories: (categories: Category[]) => void;
  setActiveCategoryId: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  activeCategoryId: '',
  setCategories: (categories) => set({ categories }),
  setActiveCategoryId: (id) => set({ activeCategoryId: id }),
}));
