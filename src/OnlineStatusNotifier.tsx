import { cancelIcon, offlineIcon, onlineIcon } from './icons';

type OnlineStatusNotifierType = {
  isOnline: boolean;
};
export function OnlineStatusNotifier({ isOnline }: OnlineStatusNotifierType) {
  const handleRefreshButtonClick = () =>
    // eslint-disable-next-line no-restricted-globals
    location.reload();

  const handleCloseButtonClick = () => {};

  return (
    <div className="statusNotifierAnchorOriginBottomLeft">
      <div>{isOnline ? onlineIcon : offlineIcon}</div>
      <div>{getStatusText(isOnline)}</div>
      {!isOnline && (
        <div>
          <span onClick={handleRefreshButtonClick}>Refresh</span>
        </div>
      )}
      <div onClick={handleCloseButtonClick}>{cancelIcon}</div>
    </div>
  );
}

const getStatusText = (isOnline: boolean): string => {
  return isOnline
    ? 'Your internet connection was restored.'
    : 'You are currently offline.';
};
