import { IsBase64, IsNotEmpty } from "class-validator";
import { z } from "zod";

export class GetCellCountRequestDTO {
    @IsNotEmpty()
    @IsBase64()
    base64File: string
};

export const GetCellCountResponseSchema= z.object({
    base64File: z.string(),
    cellCount: z.number(),
});

export type GetCellCountResponseDTO = z.infer<typeof GetCellCountResponseSchema>;