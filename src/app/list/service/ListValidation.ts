import { Service } from '@andcreations/common';
import { ValidationResult } from '../../common';

/** */
@Service()
export class ListValidation {
  /** */
  validateListName(name: string): ValidationResult {
    if (name.length === 0) {
      return { error: 'Name cannot be empty' };
    }
    return {};
  }
}