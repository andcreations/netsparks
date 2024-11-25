import { Service } from '@andcreations/common';
import * as YAML from 'yaml';

import { ValidationResult } from '../../common';
import { BookmarkModel } from '../model';
import { errorToString } from '../../util';

/** */
@Service()
export class BookmarksYAMLService {
  /** */
  toYAML(bookmarks: BookmarkModel[]): string {
    const bookmarksForYaml = bookmarks.map(bookmark => {
      return {
        ...bookmark,
        ...(bookmark.tags?.length ? { tags: bookmark.tags.join(' ')} : {}),
      }
    })
    return YAML.stringify(bookmarksForYaml);
  }

  /** */
  fromYAML(str: string):
    {
      bookmarks: BookmarkModel[];
      validation?: never;
    }
    |
    {
      bookmarks?: never;
      validation: ValidationResult;
    }
  {
    const validationError = (error: string) => ({
      validation: {
        error,
      },
    });
    const isString = (value: any) => {
      return typeof value === 'string' && value.length > 0;
    }

  // parse
    let obj: object;
    try {
      obj = YAML.parse(str);
    } catch (error) {
      return validationError(errorToString(error));
    }

  // must be an array
    if (!Array.isArray(obj)) {
      return validationError('Must be an array');
    }

    const validFields = ['label', 'url', 'regex', 'tags'];
    const bookmarks: BookmarkModel[] = [];
  // validate & parse entries
    for (const entry of obj) {
      const fields = Object.keys(entry);
    // validate field names
      const invalidFields = fields.filter(key => !validFields.includes(key));
      if (invalidFields.length) {
        return validationError(`Invalid field(s) ${invalidFields.join(',')}`);
      }

    // validate fields
      if (!entry.label) {
        return validationError('Bookmark without label');
      }
      if (!isString(entry.label)) {
        return validationError('Invalid bookmark label');
      }
      if (!entry.url) {
        return validationError(`Bookmark without URL (label: ${entry.label})`);
      }
      if (!isString(entry.url)) {
        return validationError(`Invalid bookmark URL (label: ${entry.label})`);
      }
      if (entry.regex && !isString(entry.regex)) {
        return validationError(
          `Invalid bookmark regex (label: ${entry.label})`,
        );
      }

      let tags: string[] = [];
      if (entry.tags) {
        if (isString(entry.tags)) {
          entry.tags
          .split(' ')
          .map(tag => tag.trim())
          .filter(tag => tag.length)
          .forEach(tag => tags.push(tag));
        }
        else if (Array.isArray(entry.tags)) {
          for (const tag of entry.tags) {
            if (!isString(tag)) {
              return validationError(
                `Invalid bookmark tags (label: ${entry.label})`,
              );      
            }
            if (tag.trim().length === 0) {
              continue;
            }
            tags.push(tag);
          }
        }
        else {
          return validationError(
          `Invalid bookmark tags (label: ${entry.label})`,
          );
        }
    }

    // // tags
    //   if (entry.tags?.length) {
    //     tags = entry.tags
    //       .split(' ')
    //       .map(tag => tag.trim())
    //       .filter(tag => tag.length);
    //   }

    // add
      bookmarks.push({
        label: entry.label,
        url: entry.url,
        regex: entry.regex,
        ...(tags.length ? { tags } : {}),
      });
    }

    return { bookmarks };
  }
}