import './App.css';
import { OnlineStatusNotifier } from './OnlineStatusNotifier';
import { useOnlineStatus } from './useNetworkStatus';

function App() {
  const { isOnline, StatusNotifierComponent } = useOnlineStatus();
  return (
    <div className="App" style={{ height: '100vh', backgroundColor: 'black' }}>
      <h1>{isOnline ? 'online' : 'offline'}</h1>
      <StatusNotifierComponent />
    </div>
  );
}

export default App;
