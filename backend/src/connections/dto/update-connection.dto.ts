import { PartialType } from "@nestjs/swagger";
import { ConnectionDto } from "./connection.dto";

export class UpdateConnectionDto extends PartialType(ConnectionDto) {}