import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'
import Convert from './routes/Convert'
import Current from './routes/Current'
import Home from './routes/Home'
import Random from './routes/Random'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/current" element={<Current />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/random" element={<Random />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
