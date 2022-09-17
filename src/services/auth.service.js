import api from "./api";
import TokenService from "./token.service";
import {SERVICE_NAME} from "@/config";

class AuthService {
    login({ email, password }) {
        return api
            .post("/auth/authorize", {
                email,
                password,
                service: SERVICE_NAME
            })
            .then((response) => {
                if (response.data.token) {
                    TokenService.setUser(response.data);
                }

                return response.data;
            });
    }

    logout() {
        TokenService.removeUser();
    }
}

export default new AuthService();
