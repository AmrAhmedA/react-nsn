import {
  OnlineStatusNotification,
  Position,
  useOnlineStatus
} from '../../src/nsn'
import './App.css'
import { AppBarContainer } from './components/AppBar'
import { InfoModal } from './components/InfoModal'
import { DarkModeContainer } from './components/darkMode'
import { PositionContainer } from './components/position'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { useReducer, useState } from 'react'

type ReducerActions = {
  type:
    | 'position'
    | 'darkMode'
    | 'onlineStatusText'
    | 'offlineStatusText'
    | 'duration'
  payload: {
    position?: Position
    darkMode?: boolean
    statusText?: { online?: string; offline?: string }
    duration?: number
  }
}

export type State = {
  darkMode: boolean
  duration: number
  position: Position
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
    case 'duration':
      newState = { ...state, duration: action.payload.duration }
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
        duration: 4.5,
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
    duration: 4.5,
    darkMode: true,
    statusText: {
      online: `Your internet connection was restored.`,
      offline: `You are currently offline.`
    }
  })

  const [openInfoModal, setOpenInfoModal] = useState(false)

  const handleCloseInfoModal = () => setOpenInfoModal(false)
  const handleOpenInfoModal = () => setOpenInfoModal(true)

  const { isOnline } = useOnlineStatus()

  const handleStatusInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    if (id === 'online-controlled') {
      dispatch({
        type: 'onlineStatusText',
        payload: { statusText: { online: value } }
      })
    } else if (id === 'offline-controlled') {
      dispatch({
        type: 'offlineStatusText',
        payload: { statusText: { offline: value } }
      })
    }
  }

  const handleDurationChange = (e: any) => {
    dispatch({
      type: 'duration',
      payload: { duration: e.target.value }
    })
  }

  return (
    <div className='App'>
      <Container maxWidth="md">
        <AppBarContainer onInfoButtonClick={handleOpenInfoModal} />
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
              onDurationChange={handleDurationChange}
            />
            <Divider />
          </Stack>
          <InfoModal
            onCloseInfoModal={handleCloseInfoModal}
            open={openInfoModal}
          />
          <OnlineStatusNotification {...state} />
        </div>
      </Container>
    </div>
  )
}

export default App
