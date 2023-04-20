import { OnlineStatusNotification } from '../../src/OnlineStatusNotification'
import './App.css'
function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <p>React NSN</p>
        <div
          className='App'
          style={{ height: '100vh', backgroundColor: 'white' }}
        >
          <OnlineStatusNotification darkMode={true} />
        </div>
      </header>
    </div>
  )
}

export default App
