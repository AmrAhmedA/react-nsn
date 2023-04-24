import {
  OnlineStatusNotification,
  Position,
  useOnlineStatus
} from '../../src/nsn'
import './App.css'
import { AppBarContainer } from './components/AppBar'
import { DarkModeContainer } from './components/darkMode'
import { PositionContainer } from './components/position'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { useReducer } from 'react'

type ReducerActions = {
  type: 'position' | 'darkMode' | 'onlineStatusText' | 'offlineStatusText'
  payload: {
    position?: Position
    darkMode?: boolean
    statusText?: { online?: string; offline?: string }
  }
}

export type State = {
  position: Position
  darkMode: boolean
  statusText: {
    online?: string
    offline?: string
  }
}

function reducer(state: State, action: ReducerActions) {
  let newState: State
  switch (action.type) {
    case 'position':
      newState = { ...state, position: action.payload.position }
      break
    case 'darkMode':
      newState = { ...state, darkMode: action.payload.darkMode }
      break
    case 'onlineStatusText':
      newState = {
        ...state,
        statusText: {
          offline: state.statusText.offline,
          online: action.payload.statusText.online
        }
      }
      break
    case 'offlineStatusText':
      newState = {
        ...state,
        statusText: {
          online: state.statusText.online,
          offline: action.payload.statusText.offline
        }
      }
      break
    default:
      newState = {
        position: 'bottomLeft',
        darkMode: true,
        statusText: {
          online: `Your internet connection was restored.`,
          offline: `You are currently offline.`
        }
      }
  }
  return newState
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    position: 'bottomLeft',
    darkMode: true,
    statusText: {
      online: `Your internet connection was restored.`,
      offline: `You are currently offline.`
    }
  })

  const { isOnline } = useOnlineStatus()

  const handleStatusInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'online-controlled') {
      dispatch({
        type: 'onlineStatusText',
        payload: { statusText: { online: e.target.value } }
      })
    } else if (e.target.id === 'offline-controlled') {
      dispatch({
        type: 'offlineStatusText',
        payload: { statusText: { offline: e.target.value } }
      })
    }
  }

  return (
    <div className='App'>
      <Container maxWidth="md">
        <AppBarContainer />

        <div className='App' style={{ backgroundColor: 'white' }}>
          <Stack direction="column" spacing={3}>
            <Grid
              container
              alignItems={'center'}
              justifyContent={'center'}
              style={{ marginTop: '24px' }}
            >
              <Alert
                severity={isOnline ? 'success' : 'error'}
              >{`Your current app status is ${
                isOnline ? `online` : 'offline'
              }`}</Alert>
            </Grid>
            <Divider />
            <PositionContainer state={state} dispatch={dispatch} />
            <Divider />
            <DarkModeContainer
              state={state}
              dispatch={dispatch}
              onStatusInputChange={handleStatusInputChange}
            />
            <Divider />
          </Stack>

          <OnlineStatusNotification {...state} />
        </div>
      </Container>
    </div>
  )
}

export default App
