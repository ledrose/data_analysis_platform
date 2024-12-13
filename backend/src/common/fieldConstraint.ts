import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'isFormulaSpecific', async: false })
export class CustomFieldsConstraint implements ValidatorConstraintInterface {
    validate(formula: string, validationArguments: ValidationArguments): Promise<boolean> | boolean {
        const relatedProperty = validationArguments.constraints[0];
        const fields = (validationArguments.object as any)[relatedProperty] as any[];
        if (!formula && !fields) {
            return true;
        }
        const re = /\${\d\d*}/g;
        const found = formula.match(re);
        if (!found) {
            return false;
        }
        const uniqueInserts = [...(new Set(found))].map(v => parseInt(v.substring(2, v.length - 1)));
        if (found.length === fields.length) {
            for (let i = 0; i < fields.length; i++) {
                if (!uniqueInserts.includes(i)) {
                  return false; // Missing a number
                }
            }
            return true;   
        }
        return false;
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return validationArguments.value + "placeholders do not conform to the amount or format of fields"
    }
    
}