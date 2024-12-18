import { useErrorStore } from "@/_store/store";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import useSWR from "swr";




function fetchState<R>(isLoading: boolean,data: R | null,err: string | null) {
    return {
        isLoading:isLoading,
        data:data,
        err:err
    }
}


class sendRequestBuilder {
    sendRequest: (...args: any) => void;
    onError: ((...args: any) => void) | undefined;
    onData: ((...args: any) => void) | undefined;
    constructor(
        sendRequest: (...args: any) => void
    ) {
        this.sendRequest = sendRequest
    }



    execute(...args: any) {
        return this.sendRequest(...args);
    }

    private buildSendRequest() {
    
    }
}


export default function useCustomFetch<R,T extends (...args: any) => Promise<Response>>(
    promise : T
) : {
    isLoading: boolean,
    data: R | null,
    err: string | null,
    sendRequest: (onErr?: (...args: any) => void, onData?: (...args: any) => void) => (...args: Parameters<T>) => void
} {
    type PromiseArgs = Parameters<T>;
    // const navigate = useNavigate();
    // const query =  useSelector((state) => state.user);
    const [respState,setRespState] = useState(fetchState<R>(false,null,null));
    // const setError = useErrorStore(state => state.setError);
    const {toast} = useToast();
     // const dispatch = useDispatch();
    const errAction = (err: string) => {
        setRespState(fetchState<R>(false,null,err));
        toast({
           variant: "destructive",
           duration: 1000,
           title: "Error",
           description: err.toString() 
        });
        // setError(err);

    }


    const sendRequest = (onErr?: (...args: any) => void, onData?: (...args: any) => void) => {
        return (...args: PromiseArgs)  => {
            setRespState(fetchState<R>(true,null,null));
            promise(...args).then((response) => {
                console.log(response);
                if (response.ok) {
                    response.text().then((text)=> {
                        const data = text && JSON.parse(text);
                        if (data === "") {
                            const err = (data && data.message) || response.statusText;
                            onErr?.(data);
                            errAction(err);
                        } else {
                            onData?.(data);
                            setRespState(fetchState<R>(false,data,null));
                            // console.log(data);
                        }
                    });
                    // console.log("Ok: "+resp);
                } else if (response.status == 401) {
                    // navigate("/login")
                    onErr?.(response.statusText);
                    errAction(response.statusText)
    
                }
                else {
                    response.text().then((text) => {
                        onErr?.(response.statusText);
                        errAction(text);
                    },(e)=> errAction(response.statusText))
                }
            },(err) => {
                console.log(err);
                errAction(err);
            });
        };
    }
    return {...respState,sendRequest};
}
