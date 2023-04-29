import { animation2 } from '../assets/assets'
import { Box, Modal, Typography } from '@mui/material'

const style: { [value: string]: string | number } = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
}

type InfoModalProps = {
  onCloseInfoModal: () => void
  open: boolean
}

export function InfoModal({ onCloseInfoModal, open }: InfoModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCloseInfoModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          How to change the online network status of your app?
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Activate network developer tools on <strong>Google Chrome</strong>, by
          using the following keyboard shortcuts:
          <ul>
            <li>
              <strong>Mac:</strong> Command + Option + I
            </li>
            <li>
              <strong>Windows - Linux:</strong> Control + Shift + I
            </li>
          </ul>
        </Typography>
        <Typography>
          from the developer tools Network tab Choose <code>offline</code> from
          selectbox to disable your app online status.
        </Typography>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          <img src={animation2} />
        </div>
      </Box>
    </Modal>
  )
}
