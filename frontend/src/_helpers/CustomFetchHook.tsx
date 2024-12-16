import { useEffect, useState } from "react";
import useSWR from "swr";




function fetchState<R>(isLoading: boolean,data: R | null,err: string | null) {
    return {
        isLoading:isLoading,
        data:data,
        err:err
    }
}


// export type ApiEndpoint<T> = {
//     responseType: T,
//     function: (...args: any) => Promise<Response>
// }

//isLoading,data,error


export default function useCustomFetch<R,T extends (...args: any) => Promise<Response>>(
    promise : T,onData=(json: JSON)=>{},onErr=(err: string)=>{}
) : {
    isLoading: boolean,
    data: R | null,
    err: string | null,
    sendRequest: (...args: Parameters<T>) => void
} {
    type PromiseArgs = Parameters<T>;
    // const navigate = useNavigate();
    // const query =  useSelector((state) => state.user);
    const [respState,setRespState] = useState(fetchState<R>(false,null,null));
    // const dispatch = useDispatch();
    const errAction = (err: string) => {
        setRespState(fetchState<R>(false,null,err));
        onErr(err);
        //TODO set global error
        // dispatch(setError(err.toString()));
    }
    const sendRequest = (...args: PromiseArgs) => {
        setRespState(fetchState<R>(true,null,null));
        promise(...args).then((response) => {
            if (response.ok) {
                response.text().then((text)=> {
                    const data = text && JSON.parse(text);
                    if (data === "") {
                        const err = (data && data.message) || response.statusText;
                        errAction(err);
                    } else {
                        setRespState(fetchState<R>(false,data,null));
                        // console.log(data);
                        onData(data);
                    }
                });
                // console.log("Ok: "+resp);
            } else if (response.status == 401) {
                // navigate("/login")
                errAction(response.statusText)
            }
            else {
                response.text().then((text) => {
                    errAction(text);
                },(e)=> errAction(response.statusText))
            }
        },(err) => {
            errAction(err);
        });
    };
    return {...respState,sendRequest};
}
