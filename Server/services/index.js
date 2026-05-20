import LoginService from "./LoginService.js";
import UserService from './UserService.js';

export const registerServices = (app) => {
    app.provide("loginService", LoginService);
    app.provide('userService', UserService);
}
