import * as React from 'react';
import classNames from 'classnames';
import { BookmarkModel } from '../model';

/** */
export interface BookmarksDropdownProps {
  /** */
  visible: boolean;

  /** */
  bookmarks: BookmarkModel[];

  /** */
  selectedItemIndex: number;

  /** */
  onItemSelected: (index: number) => void;
}

/** */
export function BookmarksDropdown(props: BookmarksDropdownProps) {
  /** */
  const renderItems = () => {
    return props.bookmarks.map((bookmark, index) => {
      const key = `item-${index}`;
      const selected = index === props.selectedItemIndex;
      const itemClassNames = classNames([
        'netsparks-bookmarks-dropdown-item',
        { 'netsparks-bookmarks-dropdown-item-selected': selected }
      ])
      return (
        <div
          key={key}
          className={itemClassNames}
          onPointerEnter={() => props.onItemSelected(index)}
        >
          <a
            className='netsparks-bookmarks-dropdown-label'
            href={bookmark.url}
          >
            {bookmark.label}
          </a>
        </div>
      )
    })
  };

  /** */
  const hidden = !props.visible || !props.bookmarks.length;

  /** */
  const dropdownClassNames = classNames([
    'netsparks-bookmarks-dropdown-wrapper',
    { 'netsparks-bookmarks-dropdown-wrapper-hidden': hidden },
  ])

  /** */
  return (
    <div className={dropdownClassNames}>
      <div className='netsparks-bookmarks-dropdown'>
        {renderItems()}
      </div>
    </div>
  );
}