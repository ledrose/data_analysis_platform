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

interface MainPageStoreState {
    updateDataset: () => void,
    setUpdateDataset: (updateDataset: () => void) => void
    updateConnection: () => void,
    setUpdateConnection: (updateConnection: () => void) => void,
    updateChart: () => void,
    setUpdateChart: (updateChart: () => void) => void
}

export const useMainPageStore = create<MainPageStoreState>()((set) => ({
    updateDataset: () => {},
    setUpdateDataset: (updateDataset: () => void) => set({updateDataset}),
    updateConnection: () => {},
    setUpdateConnection: (updateConnection: () => void) => set({updateConnection}),
    updateChart: () => {},
    setUpdateChart: (updateChart: () => void) => set({updateChart})
}))