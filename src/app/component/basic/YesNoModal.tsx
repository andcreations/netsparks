import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/** */
export interface YesNoModalProps {
  /** */
  show: boolean;

  /** */
  ui: {
    /** */
    title: string;

    /** */
    noButton: string;

    /** */
    yesButton: string;
  }

  /** */
  onNo: () => void;

  /** */
  onYes: () => void;  
}

/** */
export function YesNoModal(props: React.PropsWithChildren<YesNoModalProps>) {
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
          {props.children}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={props.onNo}
          >
            {props.ui.noButton}
          </Button>
          <Button
            variant='primary'
            onClick={props.onYes}
          >
            {props.ui.yesButton}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}