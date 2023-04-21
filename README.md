## React Network Status Notification (React-nsn) [![License](https://img.shields.io/npm/l/react-nsn)](https://github.com/AmrAhmedA/react-nsn/blob/main/LICENSE)



<div align="center">
  <picture>
    <img src="https://github.com/AmrAhmedA/react-nsn/blob/main/example/assets/notification-example.jpg" width="760" alt="Logo"/>
  </picture>
</div>

<br>
An important aspect of any modern web application is the ability to handle network connectivity issues. Whether it's a temporary loss of connection or the user being in an area with no network coverage, it's crucial for the app to be able to gracefully handle these scenarios and communicate the current network status to the user.

Table of Contents
--
- [Online demo](#online-demo)
- [How to use](#how-to-use)
- [Documentation](#documentation)
- [Compatibility](#compatibility)
- [License](#license)




### Online demo
Soon 


# Getting Started

npm
```
npm i react-nsn
```


### how to use

```jsx
import { OnlineStatusNotifier, useOnlineStatus } from 'react-nsn'
function App() {

  const { isOnline } = useOnlineStatus()

  return (
    <div>
      <h1>{`online status: ${isOnline}`}</h1>
      <OnlineStatusNotifier darkMode={true} />
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
| duration        | `number`           | 4500ms    | duration of the notification when it appear on screen before hiding back |
| onRefreshClick  | `function`         |           | derived from <code>eventsCallback</code>, callback function triggered when refresh is clicked during offline status  |
| onCloseClick    | `function`         |           | derived from <code>eventsCallback</code>, callback function triggered when close button is clicked |
| position        | `string`           | `bottomLeft` | `bottomLeft`  `bottomRight`  `centered`  |
| statusText.online   | `string`       | Your internet connection was restored.      | add your custom online text |
| statusText.offline  | `string`       | You are currently offline.      | add your custom offline text

```useOnlineStatus``` hook has the following arguments:

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| pollingUrl        | `string`          | `https://www.gstatic.com/generate_204`   | the url used to perform [polling](https://en.wikipedia.org/wiki/Polling_(computer_science)) | 
| pollingDuration   | `number`          | `20000ms`    | fixed delays time between requests |


### Compatibility

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Electron |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                     | latest version                                                                                                                                                                                                   | latest version                                                                                                                                                                                               | latest version                                                                                                                                                                                               | latest version                                                                                                                                                                                                      |



### License
React-nsn is released under the MIT license.
