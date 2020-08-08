import React from 'react';
import {
  Button,
  Modal as ModalReactstrap,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import propTypes from 'prop-types';

const Modal = ({
  showModal,
  confirmButton,
  cancelButton,
  title,
  content,
  firstBtnTitle,
  secondBtnTitle,
}) => {
  return (
    <ModalReactstrap isOpen={showModal} toggle={cancelButton}>
      <ModalHeader toggle={cancelButton}>{title}</ModalHeader>
      <ModalBody>{content()}</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={confirmButton}>
          {firstBtnTitle}
        </Button>
        <Button color="secondary" onClick={cancelButton}>
          {secondBtnTitle}
        </Button>
      </ModalFooter>
    </ModalReactstrap>
  );
};

Modal.propTypes = {
  showModal: propTypes.bool.isRequired,
  confirmButton: propTypes.func.isRequired,
  cancelButton: propTypes.func.isRequired,
  title: propTypes.string.isRequired,
  content: propTypes.func.isRequired,
  firstBtnTitle: propTypes.string.isRequired,
  secondBtnTitle: propTypes.string.isRequired,
};

export default Modal;
