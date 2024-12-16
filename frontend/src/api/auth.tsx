import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import {UserLoginDto} from "@backend/auth/dto/user-login.dto";

interface LoginResponse {
    access_token: string
}

interface RegisterResponse {
    username: string
}

// interface LoginRequest {
//     username: string,
//     password: string
// }

async function login_api({username, password}: UserLoginDto) {
    return request("/api/auth/login","POST", {
        body: {username, password}
    });
}

async function register_api({username, password}: UserLoginDto) {
    return request("/api/auth/register","POST", {
        body: {username, password}
    });
}


export const useLoginApi = () => useCustomFetch<LoginResponse,typeof login_api>(login_api);
export const useRegisterApi = () => useCustomFetch<RegisterResponse,typeof register_api>(register_api);