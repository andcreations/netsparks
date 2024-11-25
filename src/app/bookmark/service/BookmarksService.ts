import { Service } from '@andcreations/common';

import { BookmarkModel } from '../model';
import { AppStateService } from '../../state';
import { BookmarkAppStateKeys } from '../state/BookmarkAppStateKeys';

/** */
@Service()
export class BookmarksService {
  /** */
  constructor(private readonly appState: AppStateService) {
  }

  /** */
  async getBookmarks(): Promise<BookmarkModel[]> {
    return this.appState.get<BookmarkModel[]>(
      BookmarkAppStateKeys.Bookmarks,
      [],
    );
  }

  /** */
  async createBookmark(bookmark: BookmarkModel): Promise<void> {
    const bookmarks = await this.getBookmarks();
    await this.appState.set({
      [BookmarkAppStateKeys.Bookmarks]: [...bookmarks, bookmark],
    })
  }

  /** */
  async replaceBookmarks(bookmarks: BookmarkModel[]): Promise<void> {
    await this.appState.set({
      [BookmarkAppStateKeys.Bookmarks]: bookmarks,
    });
  }

  /** */
  private buildStringFromRegexMatch(
    label: string,
    match: RegExpMatchArray,
  ): string {
    let result = '';

    const STRING = 'string';
    const EXPR = 'expr';

    let expr = '';
    let state = STRING;
    let index = 0;
    while (index < label.length) {
      const ch = label[index];
      index++;

      if (ch === '{') {
        state = EXPR;
        continue;
      }
      if (ch === '}') {
        state = STRING;
        const exprFunc = Function('g', `return ${expr}`);
        result += exprFunc(match);
        expr = '';
        continue;
      }

      if (state === EXPR) {
        expr += ch;
      }
      else {
        result += ch;
      }
    }

    return result;
  }

  /** */
  private matchBookmark(
    text: string, 
    bookmark: BookmarkModel,
  ): BookmarkModel | undefined {
  // match by regex
    if (bookmark.regex) {
      const regex = new RegExp(bookmark.regex);
      const match = text.match(regex);
      if (!match) {
        return;
      }
      return {
        ...bookmark,
        label: this.buildStringFromRegexMatch(bookmark.label, match),
        url: this.buildStringFromRegexMatch(bookmark.url, match),
      }
    }

  // match by string
    const lowerCaseLabel = bookmark.label.toLowerCase();
    const matchLabel = lowerCaseLabel.includes(text.toLowerCase());
    if (matchLabel) {
      return bookmark;
    }

  // no match
    return;
  }

  /** */
  async matchBookmarks(text: string): Promise<BookmarkModel[]> {
    const matchedBookmarks: BookmarkModel[] = [];

  // match
    const bookmarks = await this.getBookmarks();
    bookmarks.forEach(bookmark => {
      const matchedBookmark = this.matchBookmark(text, bookmark);
      if (!!matchedBookmark) {
        matchedBookmarks.push(matchedBookmark);
      }
    });

    return matchedBookmarks;
  }
}