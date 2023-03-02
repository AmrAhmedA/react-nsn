import './App.css';
import { useOnlineStatus } from './useNetworkStatus';

function App() {
  const { isOnline } = useOnlineStatus();
  return (
    <div className="App">
      <h1>{isOnline ? 'online' : 'offline'}</h1>
    </div>
  );
}

export default App;
