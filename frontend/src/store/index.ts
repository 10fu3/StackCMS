import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";

import authReducer from "./auth";
import apiReducer from "./apis"
import contentsReducer from "./contents";
import rolesReducer from "./roles";
import usersReducer from "./users"

const reducer = combineReducers({
    auth: authReducer,
    apis: apiReducer,
    contents: contentsReducer,
    roles: rolesReducer,
    users: usersReducer,
});

const store = configureStore({ reducer });

export default store;
