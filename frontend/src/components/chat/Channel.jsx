import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Channel = ({
  channel,
  isCurrent,
  setCurrentChannel,
  removeChannel,
  renameChannel,
}) => {
  const { t } = useTranslation();
  const variant = isCurrent ? 'secondary' : 'light';

  const channelButton = (channelData) => (
    <Button
      onClick={setCurrentChannel(channelData.id)}
      variant={variant}
      className="w-100 rounded-0 text-start text-truncate"
    >
      <span className="me-1">#</span>
      {channelData.name}
    </Button>
  );

  const channelButtonRemovable = (channelData) => (
    <Dropdown as={ButtonGroup} className="d-flex">
      {channelButton(channelData)}
      <Dropdown.Toggle split variant={variant} className="flex-grow-0">
        <span className="visually-hidden">{t('modals.menu')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={removeChannel(channelData.id)}>{t('modals.delete')}</Dropdown.Item>
        <Dropdown.Item onClick={renameChannel(channelData.id)}>{t('modals.renameChannel')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <li className="nav-item w-100" key={channel.id}>
      {channel.removable ? channelButtonRemovable(channel) : channelButton(channel)}
    </li>
  );
};

export default Channel;
