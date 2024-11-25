import * as React from 'react';
import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { Center, Header, MaterialIconButton } from '../../component';
import { BookmarksDropdown } from './BookmarksDropdown';
import {
  isArrowDownKeyEvent,
  isArrowUpKeyEvent,
  isEnterKeyEvent,
  isEscapeKeyEvent,
} from '../../util';
import { BookmarkModel } from '../model';
import { BookmarksService } from '../service';
import { EditBookmarksModal } from './EditBookmarksModal';

/** */
interface BookmarksState {
  /** */
  dropdownVisible: boolean;

  /** */
  matchedBookmarks: BookmarkModel[];
  selectedItemIndex: number;

  /** */
  showEditModal: boolean;  
}

/** */
const bookmarksService = IoC.resolve(BookmarksService);

/** */
export function Bookmarks() {
  /** */
  const [state, setState] = useState<BookmarksState>({
    dropdownVisible: false,
    matchedBookmarks: [],
    selectedItemIndex: 0,
    showEditModal: false,
  });

  /** */
  const onShowModal = (key: keyof BookmarksState) => {
    setState({
      ...state,
      [key]: true,
    });
  }

  /** */
  const onCloseModal = (key: keyof BookmarksState) => {
    setState({
      ...state,
      [key]: false,
    });
  }

  /** */
  const onChange = (event) => {
    const value = event.target.value;
    bookmarksService.matchBookmarks(value)
      .then(matchedBookmarks => {
        setState({
          ...state,
          dropdownVisible: value.length > 2,
          matchedBookmarks,
          selectedItemIndex: 0,
        });
      })
      .catch(error => {
        Log.e('Failed to match bookmarks', error);
      });
  };
 
  /** */
  const onKeyDown = (event) => {
    if (isArrowUpKeyEvent(event)) {
      setState({
        ...state,
        selectedItemIndex: Math.max(state.selectedItemIndex - 1, 0),
      });
    }
    if (isArrowDownKeyEvent(event)) {
      const maxIndex = state.matchedBookmarks.length - 1;
      setState({
        ...state,
        selectedItemIndex: Math.min(state.selectedItemIndex + 1, maxIndex),
      });
    }
    if (isEnterKeyEvent(event)) {
      const bookmark = state.matchedBookmarks[state.selectedItemIndex];
      if (bookmark && bookmark.url) {
        window.location.href = bookmark.url;
      }
    }
    if (isEscapeKeyEvent(event)) {
      setState({
        ...state,
        dropdownVisible: false,
      });
    }
  };

  /** */
  const onItemSelected = (index: number) => {
    setState({
      ...state,
      selectedItemIndex: index,
    })
  };

  /** */
  const buildActionBar = (): React.ReactNode => {
    const elements: React.ReactNode[] = [
      <MaterialIconButton
        key='edit'
        icon='edit'
        title='Edit bookmarks'
        onClick={() => onShowModal('showEditModal')}
      />,
    ];
    return (
      <div className='netsparks-bookmarks-action-bar'>
        {elements}
      </div>
    );
  }

  /** */
  return (
    <>
      <Header
        className='netsparks-bookmarks-header'
        title='Bookmarks'
        actionBar={buildActionBar()}
      />
      <Center className='netsparks-bookmarks'>
        <div className='netsparks-bookmarks-content'>
          <InputGroup>
            <Form.Control
              autoFocus
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </InputGroup>
          <BookmarksDropdown
            visible={state.dropdownVisible}
            bookmarks={state.matchedBookmarks}
            selectedItemIndex={state.selectedItemIndex}
            onItemSelected={onItemSelected}
          />
        </div>
      </Center>
      {
        state.showEditModal &&
        <EditBookmarksModal
          show={state.showEditModal}
          onClose={() => onCloseModal('showEditModal')}
        />
      }
    </>
  );
}