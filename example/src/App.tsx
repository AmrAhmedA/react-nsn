import {
  OnlineStatusNotification,
  Position
} from '../../src/OnlineStatusNotification'
import './App.css'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useReducer } from 'react'

type ReducerActions = {
  type: 'position' | 'duration'
  payload: { position: Position }
}

type State = {
  position: Position
  duration: number
}

function reducer(state: State, action: ReducerActions) {
  let newState: State
  switch (action.type) {
    case 'position':
      newState = { ...state, position: action.payload.position }
      break
    case 'duration':
      newState = { ...state }
      break
    default:
      newState = { position: 'bottomLeft', duration: 2000 }
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
    duration: 2000
  })

  return (
    <div className='App'>
      <header className='App-header'>
        <p>React NSN</p>
        <div
          className='App'
          style={{ height: '100vh', backgroundColor: 'white' }}
        >
          <Grid container spacing={2}>
            {POSITIONS_ARR.map((item, idx) => (
              <Grid item xs={4} key={idx.toString()}>
                <Button
                  variant="contained"
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
            ))}
          </Grid>
          <OnlineStatusNotification darkMode={true} position={state.position} />
        </div>
      </header>
    </div>
  )
}

export default App
