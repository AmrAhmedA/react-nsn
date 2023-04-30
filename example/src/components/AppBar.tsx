import GitHubIcon from '@mui/icons-material/GitHub'
import InfoIcon from '@mui/icons-material/Info'
import { Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

type AppBarContainerProps = {
  onInfoButtonClick: () => void
}
export function AppBarContainer({ onInfoButtonClick }: AppBarContainerProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            React Network status notification - React-nsn
          </Typography>
          <Tooltip title="show me how to disable my network">
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={onInfoButtonClick}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="React-nsn git repository" arrow>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() =>
                window.open('https://github.com/AmrAhmedA/react-nsn', '_blank')
              }
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
