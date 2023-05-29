import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { animateScroll } from 'react-scroll';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';
import { actions } from '../../slices/index';

import Channel from './Channel';
import Modal from './modals/Modal';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelectors.selectAll);
  const { currentChannelId } = useSelector((state) => state.channels);

  const lastChannelId = channels.length > 0 ? channels.at(-1).id : null;

  useEffect(() => {
    if (currentChannelId === lastChannelId) {
      animateScroll.scrollToBottom({ containerId: 'channels', duration: 0 });
    }
  }, [currentChannelId, lastChannelId]);

  const setCurrentChannel = (channelId) => () => {
    dispatch(actions.setCurrentChannel(channelId));
  };

  const addNewChannel = () => {
    dispatch(actions.openModal({ type: 'addChannel' }));
  };

  const removeChannel = (channelId) => () => {
    dispatch(actions.openModal({ type: 'removeChannel', data: { channelId } }));
  };

  const renameChannel = (channelId) => () => {
    dispatch(actions.openModal({ type: 'renameChannel', data: { channelId } }));
  };

  return (
    <>
      <Modal />
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chatPage.channels')}</b>
        <Button
          type="button"
          variant="group-vertical"
          className="p-0 text-primary"
          onClick={addNewChannel}
        >
          <PlusSquare size={20} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul id="channels" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            isCurrent={channel.id === currentChannelId}
            setCurrentChannel={setCurrentChannel}
            removeChannel={removeChannel}
            renameChannel={renameChannel}
          />
        ))}
      </ul>
    </>
  );
};

export default Channels;
