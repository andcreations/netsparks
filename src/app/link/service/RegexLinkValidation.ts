import { Service } from '@andcreations/common';
import { ValidationResult } from '../../common';

/** */
@Service()
export class RegexLinkValidation {
  /** */
  validateRegex(regex: string): ValidationResult {
    if (!regex.length) {
      return { error: 'RegExp cannot be empty' };
    }
    return {};
  }

  /** */
  validateURL(url: string): ValidationResult {
    if (!url.length) {
      return { error: 'URL cannot be empty' };
    }
    return {};
  }
}