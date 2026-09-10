import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    workspace: JSON.parse(
        localStorage.getItem("workspace")
    ) || null,

    accessToken: localStorage.getItem("accesstoken"),
    isAuthenticated: !!localStorage.getItem("accesstoken"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.workspace = action.payload.workspace;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;

            localStorage.setItem(
                "accesstoken",
                action.payload.accessToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload.user)
            );

            localStorage.setItem(
                "workspace",
                JSON.stringify(action.payload.workspace)
            );
        },

        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;

            localStorage.removeItem("accesstoken");
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
} = authSlice.actions;

export default authSlice.reducer;