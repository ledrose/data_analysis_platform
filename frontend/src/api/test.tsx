import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";

type LoginResponse = {
    access_token: string
}

async function login_api(username: string, password: string) {   
    return request("/api/auth/login","POST", {
        body: {username, password}
    });
}

export const useLoginApi = () => useCustomFetch<LoginResponse,typeof login_api>(login_api);