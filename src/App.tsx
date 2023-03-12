import './App.css';
import { OnlineStatusNotifier } from './OnlineStatusNotifier';
import { useOnlineStatus } from './useOnlineStatus';

function App() {
  const { isOnline } = useOnlineStatus();
  return (
    <div className="App" style={{ height: '100vh', backgroundColor: 'black' }}>
      <h1>{isOnline ? 'online' : 'offline'}</h1>
      <OnlineStatusNotifier />
    </div>
  );
}

export default App;
