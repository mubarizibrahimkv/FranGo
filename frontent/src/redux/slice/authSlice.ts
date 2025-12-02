import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userName: string,
    email: string,
    _id: string,
    role: "admin"|"investor"|"customer"|"company",
    isAuthenticated: boolean
    isAdmin: boolean
    profileImage: string
    token?: string;
    status:"approve"|"pending"|"reject"
}

const initialState: UserState = {
    userName: "",
    email: "",
    _id: "",
    role: "customer",
    isAdmin: false,
    isAuthenticated: false,
    status: "pending",
    profileImage: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<UserState>>) => {
            Object.assign(state, action.payload);
        },
        logoutUser: (state) => {
            state.userName = "";
            state.email = "";
            state._id = "";
            state.role = "customer";
            state.isAdmin = false;
            state.isAuthenticated = false;
            state.profileImage = "";
        },
    }
});


export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;