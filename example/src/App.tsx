import {
  OnlineStatusNotification,
  Position,
  useOnlineStatus
} from '../../src/nsn'
import './App.css'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useReducer } from 'react'

type ReducerActions = {
  type: 'position' | 'darkMode'
  payload: { position?: Position; darkMode?: boolean }
}

type State = {
  position: Position
  darkMode: boolean
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
    }
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2
  }
}))

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

const POSITIONS_ARR: { label: string; position: Position }[] = [
  {
    label: 'bottom-left',
    position: 'bottomLeft'
  },
  {
    label: 'bottom-right',
    position: 'bottomRight'
  },
  {
    label: 'bottom-center',
    position: 'bottomCenter'
  },
  {
    label: 'top-left',
    position: 'topLeft'
  },
  {
    label: 'top-right',
    position: 'topRight'
  },
  {
    label: 'top-center',
    position: 'topCenter'
  }
]
function App() {
  const [state, dispatch] = useReducer(reducer, {
    position: 'bottomLeft',
    darkMode: true
  })

  const { isOnline } = useOnlineStatus()

  return (
    <div className='App'>
      <Container maxWidth="md">
        <Typography variant="h6" gutterBottom>
          React Network status notification - React-nsn
        </Typography>

        <Grid container alignItems={'center'} justifyContent={'center'}>
          <Alert
            severity={isOnline ? 'success' : 'error'}
          >{`Your current app status is ${
            isOnline ? `online` : 'offline'
          }`}</Alert>
        </Grid>

        <div
          className='App'
          style={{ height: '100vh', backgroundColor: 'white' }}
        >
          <Stack
            direction="column"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <Typography variant="h6" gutterBottom>
              Where do you want to position the notificaiton component?
            </Typography>
            <Grid container spacing={2}>
              {POSITIONS_ARR.map((item, idx) => {
                const isSelected = item.position === state.position
                return (
                  <Tooltip
                    key={idx.toString()}
                    arrow
                    title={
                      isSelected
                        ? 'This is the current selected position'
                        : undefined
                    }
                  >
                    <Grid item xs={4}>
                      <Button
                        fullWidth={true}
                        variant="outlined"
                        disabled={isSelected}
                        onClick={() =>
                          dispatch({
                            type: 'position',
                            payload: { position: item.position }
                          })
                        }
                      >
                        {item.label}
                      </Button>
                    </Grid>
                  </Tooltip>
                )
              })}
            </Grid>

            <Divider />

            <Typography variant="h5" gutterBottom>
              Dark mode
            </Typography>
            <Grid
              container
              justifyContent={'center'}
              direction={'row'}
              alignItems={'center'}
            >
              <MaterialUISwitch
                sx={{ m: 1 }}
                checked={state.darkMode}
                onChange={(e) =>
                  dispatch({
                    type: 'darkMode',
                    payload: { darkMode: e.target.checked }
                  })
                }
              />
              <Typography>Component</Typography>
            </Grid>
          </Stack>
          <OnlineStatusNotification {...state} />
        </div>
      </Container>
    </div>
  )
}

export default App
