import { IsNotEmpty, IsNumberString } from "class-validator";

export class RequestParamsDTO {

    @IsNotEmpty()
    @IsNumberString()
    id: number;
}