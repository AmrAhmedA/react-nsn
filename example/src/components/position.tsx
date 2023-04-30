import { Position } from '../../../src/OnlineStatusNotification'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

const POSITIONS_ARR: { label: string; position: Position }[] = [
  {
    label: 'top-left',
    position: 'topLeft'
  },
  {
    label: 'top-center',
    position: 'topCenter'
  },
  {
    label: 'top-right',
    position: 'topRight'
  },
  {
    label: 'bottom-left',
    position: 'bottomLeft'
  },
  {
    label: 'bottom-center',
    position: 'bottomCenter'
  },
  {
    label: 'bottom-right',
    position: 'bottomRight'
  }
]
export function PositionContainer({ state, dispatch }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Where do you want to position the notificaiton component?
      </Typography>
      <Grid container>
        {POSITIONS_ARR.map((item, idx) => {
          const isSelected = item.position === state.position
          return (
            <Tooltip
              key={idx.toString()}
              arrow
              title={
                isSelected ? 'This is the current selected position' : undefined
              }
            >
              <Grid item xs={4} style={{ padding: '8px' }}>
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
    </>
  )
}
