//all the utility functions are inside utils folder or your functions for reusability

// constants are urls for api routes 

export const HOST= import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES ="api/auth";
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/userInfo`