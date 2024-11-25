import * as React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { IoC } from '@andcreations/common';

import { isEnterKeyEvent, isEscapeKeyEvent } from '../../util';
import { LinkService } from '../../link';
import { EditableListEntryModel } from '../model';
import { ListEntryValidation } from '../service';

/** */
export interface ModifyListEntryModalProps {
  /** */
  entry?: EditableListEntryModel;

  /** */
  show: boolean;

  /** */
  ui: {
    /** */
    title: string;

    /** */
    okButton: string;
  };

  /** */
  onClose: () => void;

  /** */
  onModify: (entry: EditableListEntryModel) => void;
}

/** */
interface ModifyListEntryModalState {
  /** */
  title: string;
  titleError?: string;

  /** */
  links: string;
  linksError?: string;

  /** */
  notes: string;
}

/** */
const linkService = IoC.resolve(LinkService);
const listEntryValidation = IoC.resolve(ListEntryValidation);

/** */
export function ModifyListEntryModal(props: ModifyListEntryModalProps) {
  const { entry } = props;

  /** */
  const [state, setState] = useState<ModifyListEntryModalState>({
    title: entry?.title ?? '',
    links: linkService.linksToText(entry?.links),
    notes: entry?.notes ?? '',
  });
  
  /** */
  const onClose = () => {
    props.onClose();
  };

  /** */
  const onModify = () => {
    props.onModify({
      title: state.title,
      links: linkService.buildLinksFromText(state.links),
      notes: state.notes,
    });
  };

  /** */
  const onTitleChange = (event) => {
    const value = event.target.value;
    const { error } = listEntryValidation.validateListEntryTitle(value);

    setState({
      ...state,
      title: value,
      titleError: error,
    });
  };

  /** */
  const onLinksChange = (event) => {
    const value = event.target.value;

    let linksError: string | undefined;
  // validate links
    try {
      linkService.buildLinksFromText(value);
    } catch (error) {
      if (error instanceof Error) {
        linksError = error.message;
      }
      else {
        linksError = 'Unknown error';
      }
    }

  // state
    setState({
      ...state,
      links: value,
      linksError,
    });
  };

  /** */
  const onNotesChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      notes: value,
    });
  };

  /** */
  const onKeyDown = (event) => {
    if (isEnterKeyEvent(event)) {
    }
    if (isEscapeKeyEvent(event)) {
      onClose();
    }
  };

  /** */
  return (
    <Modal
      show={props.show}
      backdrop='static'
      keyboard={true}
      centered
    >
      <Modal.Header>
        <Modal.Title>{props.ui.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className='netsparks-modal-form-group'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              value={state.title}
              autoFocus
              onChange={onTitleChange}
              onKeyDown={onKeyDown}
              isInvalid={!!state.titleError}
            />
            <Form.Control.Feedback type="invalid">
              {state.titleError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='netsparks-modal-form-group'>
            <Form.Label>Links</Form.Label>
            <Form.Control
              type='textarea'
              as='textarea'
              rows={2}
              placeholder=''
              value={state.links}
              onChange={onLinksChange}
              onKeyDown={onKeyDown}
              isInvalid={!!state.linksError}
            />
            <Form.Control.Feedback type="invalid">
              {state.linksError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='netsparks-modal-form-group'>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              type='textarea'
              as='textarea'
              rows={3}
              placeholder=''
              value={state.notes}
              onChange={onNotesChange}
              onKeyDown={onKeyDown}
            />
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
          onClick={onModify}
        >
          {props.ui.okButton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}