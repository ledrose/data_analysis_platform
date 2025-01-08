
function basic_json_template(method:string,body: Object | undefined) {
    const token = "1234454"
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token!=null) {
        // headers.append("Authorization", "Bearer "+token);
    }

    const params: RequestInit = {
        method: method,
        mode: "cors",
        credentials: "include",
        ...(body!=null && {"body": JSON.stringify(body)}),
        headers
    };
    return params;
}   

interface RequestParams {
    [key: string]: any
}

export default function request(url: string,method: string,{query_params, body} : {query_params?: RequestParams, body?: Object}) {
    const params = new URLSearchParams();
    if (query_params) {
        for (const key in query_params) {
            if (query_params.hasOwnProperty(key)) {
                params.append(key, query_params[key].toString());
            }
        }
    }
    // console.log(process.env.NEXT_PUBLIC_API);
    const full_url = process.env.NEXT_PUBLIC_API+url;
    // return fetch(full_url+"?"+Object.assign(URLSearchParams,query_params), basic_json_template(method,body));
    return fetch(full_url+"?"+params, basic_json_template(method,body));

}
