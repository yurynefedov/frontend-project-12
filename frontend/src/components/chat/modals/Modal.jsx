import { useDispatch, useSelector } from 'react-redux';
import { Modal as ModalWindow } from 'react-bootstrap';
import { actions } from '../../../slices/index.js';
import AddChannel from './AddChannel.jsx';
import RemoveChannel from './RemoveChannel.jsx';
import RenameChannel from './RenameChannel.jsx';

const modals = {
  addChannel: AddChannel,
  removeChannel: RemoveChannel,
  renameChannel: RenameChannel,
};

const Modal = () => {
  const dispatch = useDispatch();
  const closeModal = () => dispatch(actions.closeModal());
  const { isOpen, type } = useSelector((state) => state.modal);

  const SelectedModal = modals[type];

  return (
    <ModalWindow show={isOpen} onHide={closeModal} centered>
      {SelectedModal && <SelectedModal closeModal={closeModal} />}
    </ModalWindow>
  );
};

export default Modal;
