//zustand is a state management tool

import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";

export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
}));
//now when we call useAppStore we can get the get and set methods anywhere in our app