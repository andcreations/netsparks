import { Service } from '@andcreations/common';
import { ValidationResult } from '../../common';

/** */
@Service()
export class ListEntryValidation {
  /** */
  validateListEntryTitle(title: string): ValidationResult {
    if (title.length === 0) {
      return { error: 'Title cannot be empty' };
    }
    return {};
  }
}