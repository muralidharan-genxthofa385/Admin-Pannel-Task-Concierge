import './App.css'
import  { BrowserRouter } from 'react-router-dom'
import {ToastContainer,toast} from 'react-toastify'
import AppRouter from './Router/AppRouter'

function App() {

  return (
    <>
<BrowserRouter>

<AppRouter/>

</BrowserRouter>
<ToastContainer />
    </>
  )
}

export default App
