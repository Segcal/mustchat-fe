import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createChartSlice } from "./slices/chat-slice";




export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChartSlice(...a),
}));