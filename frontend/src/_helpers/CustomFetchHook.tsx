import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";




function fetchState<R>(isLoading: boolean,data: R | null,err: ApiError | null) {
    return {
        isLoading:isLoading,
        data:data,
        err:err
    }
}

export interface ApiError {
    message?: string,
    error: string,
    statusCode: number
}


export default function useCustomFetch<R,T extends (...args: any) => Promise<Response>>(
    promise : T
) : {
    isLoading: boolean,
    data: R | null,
    err: ApiError | null,
    sendRequest: (handlers?: {onErr?: (err: ApiError) => void, onData?: (data: R) => void}) => (...args: Parameters<T>) => void
} {
    type PromiseArgs = Parameters<T>;
    // const navigate = useNavigate();
    // const query =  useSelector((state) => state.user);
    const [respState,setRespState] = useState(fetchState<R>(false,null,null));
    // const setError = useErrorStore(state => state.setError);
    const {toast} = useToast();
     // const dispatch = useDispatch();
    const errAction = (err: ApiError) => {
        setRespState(fetchState<R>(false,null,err));
        toast({
           variant: "destructive",
           duration: 2000,
           title: "Error",
           description: err?.message && err.message 
        });
    }

    const sendRequest = (handlers? : {onErr?: (err: ApiError) => void, onData?: (data: R) => void}) => {
        return (...args: PromiseArgs)  => {
            setRespState(fetchState<R>(true,null,null));
            promise(...args).then((response) => {
                console.log(response);
                if (response.ok) {
                    response.json().then((json) => {
                        handlers?.onData?.(json as R);
                        setRespState(fetchState<R>(false,json as R,null));

                    })
                } else if (response.status == 401) {
                    response.json().then((json) => {
                        handlers?.onErr?.(json as ApiError);
                        errAction(json as ApiError);
                    }).catch((err) => {
                        console.log(err);
                    })    
                }
                else {
                    response.json().then((json) => {
                        handlers?.onErr?.(json as ApiError);
                        errAction(json as ApiError);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            },(err) => {
                console.log(err);
                errAction(err);
            });
        };
    }
    return {...respState,sendRequest};
}
