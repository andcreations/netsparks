import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { isEscapeKeyEvent } from '../../util';
import { BookmarkModel } from '../model';
import { BookmarksService, BookmarksYAMLService } from '../service';

/** */
export interface EditBookmarksModalProps {
  /** */
  show: boolean;

  /** */
  onClose: () => void;
}

/** */
interface EditBookmarksModalState {
  /** */
  bookmarks: string;
  bookmarksError?: string;

  /** */
  loaded: boolean;
  loadFailed?: boolean;
}

/** */
const bookmarksService = IoC.resolve(BookmarksService);
const bookmarksYAMLService = IoC.resolve(BookmarksYAMLService);

/** */
export function EditBookmarksModal(props: EditBookmarksModalProps) {

  /** */
  const [state, setState] = useState<EditBookmarksModalState>({
    bookmarks: '',
    loaded: false,
  });

  /** */
  useEffect(() => {
    if (state.loaded || state.loadFailed) {
      return;
    }

    bookmarksService.getBookmarks()
      .then((bookmarks) => {
        setState({
          ...state,
          bookmarks: bookmarksYAMLService.toYAML(bookmarks),
          loaded: true,
        });
      })
      .catch(error => {
        Log.e('Failed to get bookmarks', error);
        setState({
          ...state,
          loadFailed: true,
        });
      })
  });

  /** */
  const onClose = () => {
    props.onClose();
  };

  /** */
  const onApply = () => {
    const result = bookmarksYAMLService.fromYAML(state.bookmarks);
    if (result.validation) {
      setState({
        ...state,
        bookmarksError: result.validation.error,
      });
      return;
    }
    bookmarksService.replaceBookmarks(result.bookmarks)
      .then(() => {
        onClose();
      })
      .catch(error => {
        Log.e('Failed to replace bookmarks', error);
      })
  };

  /** */
  const onChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      bookmarks: value,
    });
  };

  /** */
  const onKeyDown = (event) => {
    if (isEscapeKeyEvent(event)) {
      onClose();
    }
  };

  /** */
  return (
    <Modal
      dialogClassName='netsparks-bookmarks-edit-dialog'
      show={props.show}
      backdrop='static'
      keyboard={true}
      centered
    >
      <Modal.Header>
        <Modal.Title>Edit bookmarks</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className='netsparks-modal-form-group'>
            <Form.Label>Links</Form.Label>
            <Form.Control
              className='netsparks-bookmarks-edit-code'
              type='textarea'
              as='textarea'
              rows={12}
              placeholder=''
              value={state.bookmarks}
              onChange={onChange}
              onKeyDown={onKeyDown}
              isInvalid={!!state.bookmarksError}
            />
            <Form.Control.Feedback type="invalid">
              {state.bookmarksError}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant='primary'
          onClick={onApply}
        >
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}