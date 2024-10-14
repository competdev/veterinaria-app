import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsString,
} from "class-validator";

export class IndicatorTypeDTO {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}
