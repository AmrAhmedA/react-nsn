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
  type: 'position' | 'darkMode'
  payload: { position?: Position; darkMode?: boolean }
}

type State = {
  position: Position
  darkMode: boolean
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
    default:
      newState = { position: 'bottomLeft', darkMode: true }
  }
  return newState
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    position: 'bottomLeft',
    darkMode: true
  })

  const { isOnline } = useOnlineStatus()

  return (
    <div className='App'>
      <Container maxWidth="md">
        <AppBarContainer />

        <div
          className='App'
          style={{ height: '100vh', backgroundColor: 'white' }}
        >
          <Stack direction="column" spacing={2}>
            <Grid container alignItems={'center'} justifyContent={'center'}>
              <Alert
                severity={isOnline ? 'success' : 'error'}
              >{`Your current app status is ${
                isOnline ? `online` : 'offline'
              }`}</Alert>
            </Grid>
            <Divider />
            <PositionContainer state={state} dispatch={dispatch} />
            <Divider />
            <DarkModeContainer state={state} dispatch={dispatch} />
          </Stack>

          <OnlineStatusNotification {...state} />
        </div>
      </Container>
    </div>
  )
}

export default App
