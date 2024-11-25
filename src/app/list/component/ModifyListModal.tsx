import * as React from 'react';
import { useState, createRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { IoC } from '@andcreations/common';

import { isEnterKeyEvent, isEscapeKeyEvent } from '../../util';
import { LinkService } from '../../link';
import { ListModel } from '../model';
import { ListValidation } from '../service';

/** */
export interface ModifyListModalProps {
  /** */
  list?: Pick<ListModel, 'name'>;

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
  onModify: (entry: Pick<ListModel, 'name'>) => void;
}

/** */
interface ModifyListModalState {
  /** */
  name: string;
  nameError?: string;
}

/** */
const linkService = IoC.resolve(LinkService);
const listValidation = IoC.resolve(ListValidation);

/** */
export function ModifyListModal(props: ModifyListModalProps) {
  const { list } = props;

  /** */
  const [state, setState] = useState<ModifyListModalState>({
    name: list?.name ?? '',
  });

  /** */
  const onClose = () => {
    props.onClose();
  };

  /** */
  const onModify = () => {
    props.onModify({
      name: state.name,
    });
  };

  /** */
  const onNameChange = (event) => {
    const value = event.target.value;
    const { error } = listValidation.validateListName(value);

    setState({
      ...state,
      name: value,
      nameError: error,
    });
  };

  /** */
  const onKeyDown = (event) => {
    if (isEnterKeyEvent(event)) {
      onModify();
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
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              value={state.name}
              autoFocus
              onChange={onNameChange}
              onKeyDown={onKeyDown}
              isInvalid={!!state.nameError}
            />
            <Form.Control.Feedback type="invalid">
              {state.nameError}
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
          onKeyDown={onKeyDown}
          onClick={onModify}
        >
          {props.ui.okButton}
        </Button>
      </Modal.Footer>
    </Modal>    
  )
}