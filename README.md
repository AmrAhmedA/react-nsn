## React Network Status Notification (React-nsn)

[![npm version](https://img.shields.io/npm/v/react-nsn)](https://www.npmjs.com/package/react-nsn)
[![npm downloads](https://img.shields.io/npm/dm/react-nsn)](https://www.npmjs.com/package/react-nsn)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-nsn)](https://bundlephobia.com/package/react-nsn)
[![CI](https://github.com/AmrAhmedA/react-nsn/actions/workflows/checks.yml/badge.svg)](https://github.com/AmrAhmedA/react-nsn/actions/workflows/checks.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)](https://www.npmjs.com/package/react-nsn)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-green)](https://www.npmjs.com/package/react-nsn)
[![License](https://img.shields.io/npm/l/react-nsn)](https://github.com/AmrAhmedA/react-nsn/blob/main/LICENSE)




Component             |  Example
:-------------------------:|:-------------------------:
<img src="https://github.com/AmrAhmedA/react-nsn/blob/main/example/src/assets/notification-example.jpg" alt="example"/>  |  <img src="https://github.com/AmrAhmedA/react-nsn/blob/main/example/src/assets/disable-example.gif" alt="example-animation"/>


<br>
<p><strong>React-nsn</strong> is a zero-dependency, lightweight and customizable library that offers</p>

1. Network status hook `useOnlineStatus()`
   - app online network status
   - status time info
   - network information
   - custom polling with exponential backoff
   - `onStatusChange` callback
   - `checkNow()` for manual connectivity checks
   - custom `pollingFn` for your own health-check logic
2. Notification component `<OnlineStatusNotification/>`
3. **Headless mode** — use only the hook without the notification UI (~1.4KB gzipped)


Table of Contents
--
- [Online demo](#online-demo)
- [How to use](#how-to-use)
- [Headless mode](#headless-mode)
- [Documentation](#documentation)
- [Compatibility](#compatibility)
- [License](#license)




### Online demo
https://amrahmeda.github.io/react-nsn


# Getting Started

npm
```
npm i react-nsn
```


### How to use

add `<OnlineStatusNotification/>` to your app, preferably at root level.
```jsx
import { OnlineStatusNotification, useOnlineStatus } from 'react-nsn'

function App() {
  const {
    attributes,
    isOnline,
    time: { difference, since },
    connectionInfo,
  } = useOnlineStatus()

  // logs current connection info
  console.log(connectionInfo)

  const statusText = isOnline ? `online` : `offline`

  return (
    <div>
      <h1>{`App is ${statusText}`}</h1>
      <h1>{`the app is ${statusText} since: ${since}`}</h1>
      <h1>{`difference in time since the component was ${statusText}: ${difference}`}</h1>
      <OnlineStatusNotification darkMode={true} {...attributes} />
    </div>
  )
}
```

### Headless mode

If you only need the hook without the notification component, import from `react-nsn/headless` for a smaller bundle (~1.4KB gzipped vs ~10.7KB):

```jsx
import { useOnlineStatus } from 'react-nsn/headless'

function App() {
  const { isOnline, checkNow } = useOnlineStatus({
    onStatusChange: (online) => console.log('Status changed:', online),
  })

  return <p>{isOnline ? 'Online' : 'Offline'}</p>
}
```
  
### Documentation
```<OnlineStatusNotification/>``` has the following props:

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| className       | `string`           |           | additional CSS class name(s) for the notification container |
| darkMode        | `boolean`          | `false`   | toggle dark mode |
| destroyOnClose  | `boolean`          | `true`    | remove notification from DOM when it hides |
| duration        | `number`           | 4500ms    | duration of the notification when it pops up on screen before hiding back |
| eventsCallback.onRefreshClick  | `function`         |           | callback triggered when refresh is clicked during offline status  |
| eventsCallback.onCloseClick    | `function`         |           | callback triggered when close button is clicked |
| position        | `string`           | `bottomLeft` | `topLeft` `topRight` `topCenter` `bottomLeft` `bottomRight` `bottomCenter`  |
| statusText.online   | `string`       | Your internet connection was restored.      | custom online text |
| statusText.offline  | `string`       | You are currently offline.      | custom offline text |
| style           | `CSSProperties`    |           | inline styles for the notification container |

The component exposes an imperative handle via `ref` with `openStatus()` and `dismiss()` methods.

```useOnlineStatus``` hook has the following arguments:

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| pollingUrl        | `string`          | `https://www.gstatic.com/generate_204`   | url used to perform [polling](https://en.wikipedia.org/wiki/Polling_(computer_science)) |
| pollingDuration   | `number`          | 12000ms    | base delay between requests (backs off exponentially when offline, capped at 60s) |
| pollingFn         | `() => Promise<boolean>` |        | custom connectivity check — return `true` if online, `false` if offline. Overrides `pollingUrl` |
| onStatusChange    | `(isOnline: boolean) => void` |   | callback fired when status changes (skips initial render) |

```useOnlineStatus``` hook offers the following:

| Name         | Type            | Description                                                                                                                                                               |
|------------  |---------------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| isOnline        | `boolean`          | app online status |
| isOffline   | `boolean`          | app offline status |
| checkNow    | `() => Promise<void>` | manually trigger a connectivity check |
| time.since    | `Date`          | date of the last status change |
| time.difference    | `string`          | human-readable time since last status change |
| connectionInfo    | `NetworkInformation \| null` | [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) data (connection type, effective type, etc.) |
| attributes    | `object`          | pass directly to `<OnlineStatusNotification/>` as props |


### Next.js / Server Components

This library relies on browser APIs (`window`, `navigator`) and React client hooks, so it is **client-side only**. If you are using Next.js App Router, wrap your usage in a client component:

```jsx
'use client'

import { OnlineStatusNotification, useOnlineStatus } from 'react-nsn'

export default function NetworkStatus() {
  const { attributes } = useOnlineStatus()
  return <OnlineStatusNotification {...attributes} />
}
```

### Compatibility

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Electron |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                     | latest version                                                                                                                                                                                                   | latest version                                                                                                                                                                                               | latest version                                                                                                                                                                                               | latest version                                                                                                                                                                                                      |



### License
React-nsn is released under the MIT license.
