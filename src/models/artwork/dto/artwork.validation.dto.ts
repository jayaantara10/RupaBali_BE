import { ValidationStatus } from "src/common/enum/validationStatus.enum"

export class ValidationArtworkDto{
    validationStatus: ValidationStatus
    validationNote: string
}