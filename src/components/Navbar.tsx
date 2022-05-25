import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/current">Current</Link>
      </li>
      <li>
        <Link to="/convert">Convert</Link>
      </li>
      <li>
        <Link to="/random">Random</Link>
      </li>
    </>
  )
}

export default Navbar
