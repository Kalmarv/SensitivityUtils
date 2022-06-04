import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <label htmlFor="my-drawer-3"></label>
        <div className="drawer-content flex flex-col">
          <div className="navbar w-full bg-base-300">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-ghost btn-square">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">Calculators</div>
            <div className="hidden flex-none lg:block">
              <ul className="menu menu-horizontal">
                <Navbar />
              </ul>
            </div>
          </div>
          <Outlet />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay" />
          <ul className="menu w-80 overflow-y-auto bg-base-100 p-4">
            <Navbar />
          </ul>
        </div>
      </div>
      <footer className="footer footer-center fixed bottom-0 bg-base-300 p-4 text-base-content">
        <div className="flex items-center justify-between">
          <div className="mt-0 flex space-x-6">
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
