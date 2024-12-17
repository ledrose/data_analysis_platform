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
    // const setError = useErrorStore(state => state.setError);
    const {toast} = useToast();
     // const dispatch = useDispatch();
    const errAction = (err: string) => {
        setRespState(fetchState<R>(false,null,err));
        onErr(err);
        toast({
           variant: "destructive",
           duration: 1000,
           title: "Error",
           description: err.toString() 
        });
        // setError(err);

    }
    const sendRequest = (...args: PromiseArgs) => {
        setRespState(fetchState<R>(true,null,null));
        promise(...args).then((response) => {
            console.log(response);
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
            console.log(err);
            errAction(err);
        });
    };
    return {...respState,sendRequest};
}
