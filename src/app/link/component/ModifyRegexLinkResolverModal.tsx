import * as React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { IoC } from '@andcreations/common';

import { isEnterKeyEvent, isEscapeKeyEvent } from '../../util';
import { RegexLinkResolverEntry } from '../model';
import { RegexLinkValidation } from '../service';

/** */
export interface ModifyRegexLinkResolverModalProps {
  /** */
  entry?: RegexLinkResolverEntry;

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
  onModify: (entry: Omit<RegexLinkResolverEntry, 'id'>) => void;
}

/** */
interface ModifyRegexLinkResolverModalState {
  /** */
  regex: string;
  regexError?: string;

  /** */
  url: string;
  urlError?: string;
}

/** */
const regexLinkValidation = IoC.resolve(RegexLinkValidation);

/** */
export function ModifyRegexLinkResolverModal(
  props: ModifyRegexLinkResolverModalProps,
) {
  const { entry } = props;

  /** */
  const [state, setState] = useState<ModifyRegexLinkResolverModalState>({
    regex: entry?.regex ?? '',
    url: entry?.url ?? '',
  });

  /** */
  const onClose = () => {
    props.onClose();
  };

  /** */
  const onModify = () => {
    props.onModify({
      regex: state.regex,
      url: state.url,
    });
  };

  /** */
  const onRegexChange = (event) => {
    const value = event.target.value;
    const { error } = regexLinkValidation.validateRegex(value);

    setState({
      ...state,
      regex: value,
      regexError: error,
    });
  };

  /** */
  const onURLChange = (event) => {
    const value = event.target.value;
    const { error } = regexLinkValidation.validateURL(value);

    setState({
      ...state,
      url: value,
      urlError: error,
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
    <div>
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
              <Form.Label>RegExp</Form.Label>
              <Form.Control
                type='text'
                placeholder=''
                value={state.regex}
                autoFocus
                onChange={onRegexChange}
                onKeyDown={onKeyDown}
                isInvalid={!!state.regexError}
              />
              <Form.Control.Feedback type="invalid">
                {state.regexError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='netsparks-modal-form-group'>
              <Form.Label>URL</Form.Label>
              <Form.Control
                type='text'
                placeholder=''
                value={state.url}
                onChange={onURLChange}
                onKeyDown={onKeyDown}
                isInvalid={!!state.urlError}
              />
              <Form.Control.Feedback type="invalid">
                {state.urlError}
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
            onClick={onModify}
          >
            {props.ui.okButton}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}