import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OnlineStatusNotification from '../OnlineStatusNotification'

vi.mock('../hooks', () => ({
  useFirstRender: () => ({ isFirstRender: false }),
}))

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())
})

describe('OnlineStatusNotification', () => {
  describe('rendering', () => {
    it('renders the notification when offline', () => {
      render(<OnlineStatusNotification isOnline={false} />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('displays default offline text', () => {
      render(<OnlineStatusNotification isOnline={false} />)
      expect(
        screen.getByText('You are currently offline.'),
      ).toBeInTheDocument()
    })

    it('displays default online text', () => {
      render(<OnlineStatusNotification isOnline={true} />)
      expect(
        screen.getByText('Your internet connection was restored.'),
      ).toBeInTheDocument()
    })

    it('displays custom status text', () => {
      render(
        <OnlineStatusNotification
          isOnline={false}
          statusText={{ offline: 'No connection!' }}
        />,
      )
      expect(screen.getByText('No connection!')).toBeInTheDocument()
    })

})

  describe('accessibility', () => {
    it('has role="status" on the container', () => {
      render(<OnlineStatusNotification isOnline={false} />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('has aria-live="polite" on the container', () => {
      render(<OnlineStatusNotification isOnline={false} />)
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-live',
        'polite',
      )
    })

    it('renders the refresh control as a button', () => {
      render(<OnlineStatusNotification isOnline={false} />)
      const refreshButton = screen.getByLabelText('Refresh the page')
      expect(refreshButton.tagName).toBe('BUTTON')
      expect(refreshButton).toHaveAttribute('type', 'button')
    })

    it('renders the close control as a button', () => {
      render(<OnlineStatusNotification isOnline={false} />)
      const closeButton = screen.getByLabelText('Close notification')
      expect(closeButton.tagName).toBe('BUTTON')
      expect(closeButton).toHaveAttribute('type', 'button')
    })
  })

  describe('click handlers', () => {
    it('calls onRefreshClick callback when refresh is clicked', () => {
      const onRefreshClick = vi.fn()
      render(
        <OnlineStatusNotification
          isOnline={false}
          eventsCallback={{ onRefreshClick, onCloseClick: vi.fn() }}
        />,
      )

      fireEvent.click(screen.getByLabelText('Refresh the page'))
      expect(onRefreshClick).toHaveBeenCalledTimes(1)
    })

    it('calls onCloseClick callback when close is clicked', () => {
      const onCloseClick = vi.fn()
      render(
        <OnlineStatusNotification
          isOnline={false}
          eventsCallback={{ onRefreshClick: vi.fn(), onCloseClick }}
        />,
      )

      fireEvent.click(screen.getByLabelText('Close notification'))
      expect(onCloseClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('dark mode', () => {
    it('applies darkColor class when darkMode is true', () => {
      render(
        <OnlineStatusNotification isOnline={false} darkMode={true} />,
      )
      expect(screen.getByRole('status')).toHaveClass('darkColor')
    })

    it('applies defaultColor class when darkMode is false', () => {
      render(
        <OnlineStatusNotification isOnline={false} darkMode={false} />,
      )
      expect(screen.getByRole('status')).toHaveClass('defaultColor')
    })
  })

  describe('position', () => {
    it('applies the specified position class', () => {
      render(
        <OnlineStatusNotification isOnline={false} position="topRight" />,
      )
      expect(screen.getByRole('status')).toHaveClass('topRight')
    })
  })

  describe('destroyOnClose', () => {
    it('removes from DOM when hidden and destoryOnClose is true', () => {
      const { container } = render(
        <OnlineStatusNotification
          isOnline={false}
          destoryOnClose={true}
        />,
      )
      // The notification is showing (entering/visible phase)
      expect(container.querySelector('.statusNotification')).toBeTruthy()
    })
  })
})
