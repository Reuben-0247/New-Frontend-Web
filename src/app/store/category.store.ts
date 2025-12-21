import { create } from "zustand";
import { ICategory } from "../interfaces/category.interface";

interface IProp {
  category: ICategory | null;
  categories: ICategory[];
  loading: boolean;
  setCategory: (data: ICategory | null) => void;
  setLoading: (data: boolean) => void;
  setCategories: (data: ICategory[]) => void;
}

export const useCategoryStore = create<IProp>((set) => ({
  categories: [],
  category: null,
  loading: false,
  setCategory: (category: ICategory | null) => set({ category }),
  setLoading: (loading: boolean) => set({ loading }),
  setCategories: (categories: ICategory[]) => set({ categories }),
}));
