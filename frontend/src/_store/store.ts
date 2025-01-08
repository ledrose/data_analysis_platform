import { TableMetadataDto } from "@backend/connections/dto/table-info.dto";
import {create} from "zustand";
import { persist } from "zustand/middleware";

interface DatasetState {
    datasetId: string,
    metadata: TableMetadataDto | null,
    updateDataset: () => void,
    setDatasetId: (datasetId: string) => void,
    setMetadata: (metadata: TableMetadataDto | null) => void
    setUpdateDataset: (updateDataset: () => void) => void
}

export const useDatasetStore = create<DatasetState>()((set) => ({
    datasetId: "",
    metadata: null,
    updateDataset: () => {},
    setDatasetId: (datasetId: string) => set({datasetId}),
    setUpdateDataset: (updateDataset: () => void) => set({updateDataset}),
    setMetadata: (metadata: TableMetadataDto | null) => set({metadata})
}))