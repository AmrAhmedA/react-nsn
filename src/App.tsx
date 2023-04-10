import './App.css'
import { OnlineStatusNotifier } from './OnlineStatusNotifier'

function App() {
  // const { isOnline } = useOnlineStatus()

  return (
    <div className='App' style={{ height: '100vh', backgroundColor: 'white' }}>
      {/* <h1>{isOnline ? 'online' : 'offline'}</h1> */}
      <OnlineStatusNotifier darkMode={true} />
    </div>
  )
}

export default App
