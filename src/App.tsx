import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="w-full navbar bg-base-300">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2">Calculators</div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal">
                <Navbar />
              </ul>
            </div>
          </div>
          <Outlet />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay" />
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-100">
            <Navbar />
          </ul>
        </div>
      </div>
      <footer className="fixed bottom-0 footer footer-center p-4 bg-base-300 text-base-content">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6 mt-0">
            <p>
              Made by{' '}
              <a href="https://github.com/Kalmarv" className="link link-hover">
                Kalmarv
              </a>{' '}
              with ❤
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
