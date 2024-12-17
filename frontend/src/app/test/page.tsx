'use client'
import useCustomFetch from "@/_helpers/CustomFetchHook";
import {useLoginApi } from "@/api/auth";
import DatasetFieldsTable from "@/components/datasets/dataset-fields-table";
import RelationsTable from "@/components/datasets/relation-table";
import ResultsTable from "@/components/datasets/result-table";
import SearchSidebar from "@/components/datasets/search-sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";


export default function DatasetPage() {
    const {isLoading,data,err,sendRequest:loginRequest} = useLoginApi();
    useEffect(() => {
        loginRequest({username:"regroe",password:"ledrose"});
    },[])
    return (
        <>
            {isLoading && <p>Loading...</p>}
            {err && <p>{err.toString()}</p>}
            {data && <p>{data.access_token}</p>}
        </>
    )
}