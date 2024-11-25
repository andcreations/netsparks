import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/** */
export interface DeleteListEntryModalProps {
  /** */
  show: boolean;

  /** */
  onClose: () => void;

  /** */
  onDelete: () => void;  
}

/** */
export function DeleteListEntryModal(props: DeleteListEntryModalProps) {
  /** */
  const onClose = () => {
    props.onClose();
  };

  /** */
  const onDelete = () => {
    props.onDelete();
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
          <Modal.Title>Delete list entry</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Do you really want to delete the list entry?
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
            onClick={onDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}