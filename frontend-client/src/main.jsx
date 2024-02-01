import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment> 

    {/* adding this around the app allows us to route through pages */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    
   </React.Fragment>
)