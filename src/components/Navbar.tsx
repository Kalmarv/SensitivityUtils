import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
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
