import axiosInstance from "./api";
import TokenService from "./token.service";
import {SERVICE_NAME} from "@/config";

const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = TokenService.getLocalAccessToken();
            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;

            if (originalConfig.url !== "/auth/authorize" && err.response) {
                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;

                    try {
                        const rs = await axiosInstance.post("/auth/refresh", {
                            accessToken: TokenService.getLocalAccessToken(),
                            refreshToken: TokenService.getLocalRefreshToken(),
                            service: SERVICE_NAME
                        });

                        const user = rs.data;

                        store.dispatch('auth/refreshToken', user);
                        TokenService.updateLocalAccessToken(user.token);
                        TokenService.updateLocalRefreshToken(user.refreshToken);

                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        store.dispatch("displayError", {isHidden: false, text: "Your token is expired, please login!"});
                        store.dispatch("auth/logout");
                        return Promise.reject(_error);
                    }
                }
            }

            return Promise.reject(err);
        }
    );
};

export default setup;
