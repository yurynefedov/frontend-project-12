import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { useFormik } from 'formik';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';
import { selectors as messagesSelectors } from '../../slices/messagesSlice';
import { useApi, useAuth } from '../../hooks/index.js';

const Header = ({ currentChannel, currentChannelMessages }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>
          #
          {' '}
          {currentChannel?.name || ''}
        </b>
      </p>
      <span className="text-muted">
        {`${currentChannelMessages.length} ${t('chatPage.messagesCount', {
          count: currentChannelMessages.length,
        })}`}
      </span>
    </div>
  );
};

const Message = ({ message, id }) => (
  <div className="text-break mb-2" key={id}>
    <b>{message.username}</b>
    {': '}
    {message.text}
  </div>
);

const SendMessageForm = ({ channel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const api = useApi();

  const validationSchema = yup.object().shape({
    text: yup.string().trim().required(),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus();
  });

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validationSchema,
    onSubmit: async ({ text }) => {
      const safeText = leoProfanity.clean(text);
      const message = {
        text: safeText,
        channelId: channel.id,
        username: user.username,
      };
      try {
        await api.addMessage(message);
        formik.resetForm();
      } catch (error) {
        console.error(error);
        if (error.isAxiosError) {
          toast.error(t('errors.network'));
        } else toast.error(t('errors.unknown'));
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <InputGroup>
        <Form.Control
          className="border-0 p-0 ps-2"
          ref={inputRef}
          onChange={formik.handleChange}
          name="text"
          disabled={formik.isSubmitting}
          aria-label={t('chatPage.newMessage')}
          value={formik.values.text}
          placeholder={t('chatPage.typeMessage')}
        />
        <Button type="submit" variant="group-vertical" disabled={formik.isSubmitting}>
          <ArrowRightSquare size={20} />
          <span className="visually-hidden">{t('chatPage.sendMessage')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

const Messages = () => {
  const { currentChannelId } = useSelector((state) => state.channels);

  const currentChannel = useSelector(channelsSelectors.selectAll)
    .find((channel) => channel.id === currentChannelId);

  const currentChannelMessages = useSelector(messagesSelectors.selectAll)
    .filter((message) => message.channelId === currentChannelId);

  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'messages', duration: 0 });
  }, [currentChannelMessages.length]);

  return (
    <div className="d-flex flex-column h-100">
      <Header
        currentChannel={currentChannel}
        currentChannelMessages={currentChannelMessages}
      />
      <div id="messages" className="chat-messages overflow-auto px-5">
        {currentChannelMessages.map((message) => <Message message={message} key={message.id} />)}
      </div>
      <div className="mt-auto px-5 py-3">
        <SendMessageForm channel={currentChannel} />
      </div>
    </div>
  );
};

export default Messages;
