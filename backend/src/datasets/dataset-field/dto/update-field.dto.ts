import { PartialType } from "@nestjs/swagger";
import { AddFieldDto } from "./add-field.dto";

export class UpdateFieldDto extends PartialType(AddFieldDto) {}
