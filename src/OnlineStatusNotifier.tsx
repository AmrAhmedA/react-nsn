import { cancelIcon, offlineIcon } from './icons';

type OnlineStatusNotifierType = {
  isOnline: boolean;
};
export function OnlineStatusNotifier({ isOnline }: OnlineStatusNotifierType) {
  const handleRefreshButtonClick = () =>
    // eslint-disable-next-line no-restricted-globals
    location.reload();

  const handleCloseButtonClick = () => {};

  return (
    <div className="statusModalAnchorOriginBottomLeft">
      <div>{offlineIcon}</div>
      <div>{getStatusText(isOnline)}</div>
      <div>
        <span onClick={handleRefreshButtonClick}>Refresh</span>
      </div>
      <div onClick={handleCloseButtonClick}>{cancelIcon}</div>
    </div>
  );
}

const getStatusText = (isOnline: boolean): string => {
  return isOnline
    ? 'Your internet connection was restored.'
    : 'You are currently offline';
};
