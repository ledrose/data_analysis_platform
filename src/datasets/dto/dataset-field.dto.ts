import { AggregateType, ValueType } from "../entities/dataset-field.entity";
import { Dataset } from "../entities/dataset.entity";


export interface DatasetFieldDto {
    name: string,
    type: ValueType,
}

export class CalculatedDatasetFieldDto implements DatasetFieldDto {
    name: string;
    type: ValueType;
    formula: string;
}

export class BaseDatasetFieldDto implements DatasetFieldDto {
    name: string;
    type: ValueType;
    aggregate_type: AggregateType;
    base_field: string;
}
