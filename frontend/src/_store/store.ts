import {create} from "zustand";
import { persist } from "zustand/middleware";

interface DatasetState {
    datasetId: string,
    updateDataset: () => void,
    setDatasetId: (datasetId: string) => void,
    setUpdateDataset: (updateDataset: () => void) => void
}

export const useDatasetStore = create<DatasetState>()((set) => ({
    datasetId: "",
    updateDataset: () => {},
    setDatasetId: (datasetId: string) => set({datasetId}),
    setUpdateDataset: (updateDataset: () => void) => set({updateDataset})
}))