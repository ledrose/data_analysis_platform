import { PartialType } from "@nestjs/mapped-types";
import { AddDatasetDto } from "./add-dataset.dto";

export class UpdateDatasetDto extends PartialType(AddDatasetDto) {}