## React Network Status Notification (React-nsn) [![License](https://img.shields.io/npm/l/react-nsn)](https://github.com/AmrAhmedA/react-nsn/blob/main/LICENSE) ![npm](https://img.shields.io/npm/dm/react-nsn)




Component             |  Example
:-------------------------:|:-------------------------:
<img src="https://github.com/AmrAhmedA/react-nsn/blob/main/example/src/assets/notification-example.jpg" alt="example"/>  |  <img src="https://github.com/AmrAhmedA/react-nsn/blob/main/example/src/assets/disable-example.gif" alt="example-animation"/>


<br>
<p><strong>React-nsn</strong> offers convenient and customizable </p>

1. Network status hook `useOnlineStatus()`
   - app online network status
   - status time info
   - network information
   - custom polling
2. Notification component `<OnlineStatusNotification/>`


Table of Contents
--
- [Online demo](#online-demo)
- [How to use](#how-to-use)
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
  
### Documentation
```<OnlineStatusNotification/>``` has the following props:

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| darkMode        | `boolean`          | `false`   | toggle dark mode |
| destroyOnClose  | `boolean`          | `true`    | destroy when notification component unmount |
| duration        | `number`           | 4500ms    | duration of the notification when it pops up on screen before hiding back |
| onRefreshClick  | `function`         |           | derived from <code>eventsCallback</code>, callback function triggered when refresh is clicked during offline status  |
| onCloseClick    | `function`         |           | derived from <code>eventsCallback</code>, callback function triggered when close button is clicked |
| position        | `string`           | `bottomLeft` | `bottomLeft`  `bottomRight`  `centered`  |
| statusText.online   | `string`       | Your internet connection was restored.      | add your custom online text |
| statusText.offline  | `string`       | You are currently offline.      | add your custom offline text

```useOnlineStatus``` hook has the following arguments:

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| pollingUrl        | `string`          | `https://www.gstatic.com/generate_204`   | the url used to perform [polling](https://en.wikipedia.org/wiki/Polling_(computer_science)) | 
| pollingDuration   | `number`          | 12000ms    | fixed delays time between requests |

```useOnlineStatus``` hook offers the following:

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| isOnline        | `boolean`          |    | app online status | 
| isOffline   | `boolean`          |     | app offline status |
| time.since    | `Date`          |     | specifies the date of the last status |
| time.difference    | `string`          |     | the difference in time between latest network status and the current time |
| connectionInfo    |           |     | The [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) provides information about the system's connection in terms of general connection type (e.g., 'wifi, 'cellular', etc.). |
| attributes    | `object`          |     | passed to `<OnlineStatusNotification/>` as prop |


### Compatibility

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Electron |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                     | latest version                                                                                                                                                                                                   | latest version                                                                                                                                                                                               | latest version                                                                                                                                                                                               | latest version                                                                                                                                                                                                      |



### License
React-nsn is released under the MIT license.
