import AppRouter from './app/router/AppRouter.jsx'
import PushNotificationBootstrap from './components/push/PushNotificationBootstrap.jsx'

const App = () => {
  return (
    <>
      <PushNotificationBootstrap />
      <AppRouter />
    </>
  )
}

export default App
