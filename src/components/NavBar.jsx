import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

function NavBar() {
  const auth = useContext(AuthContext);
  return (
    <motion.nav
      className="nav"
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ type: 'tween' }}
    >
      <ul className="nav__links">
        <NavLink
          to="/products"
          className="nav__link
          "
        >
          Collection
        </NavLink>
        <NavLink
          to="/products/eyeglasses"
          className="nav__link
          "
        >
          Eyeglasses
        </NavLink>
        <NavLink
          to="/products/sunglasses"
          className="nav__link
          "
        >
          Sunglasses
        </NavLink>

        <NavLink
          to="/about"
          className="nav__link
          "
        >
          About us
        </NavLink>

        {!auth?.isAuthenticated && (
          <>
            <NavLink to="/login" className="nav__link">
              Login
            </NavLink>
            <NavLink to="/signup" className="nav__link">
              Signup
            </NavLink>
          </>
        )}

        {auth?.isAuthenticated && !auth?.user?.isAdmin && (
          <NavLink to="/profile" className="nav__link">
            Profile
          </NavLink>
        )}

        {auth?.isAuthenticated && auth?.user?.isAdmin && (
          <NavLink to="/admin" className="nav__link">
            Dashboard
          </NavLink>
        )}
      </ul>
    </motion.nav>
  );
}

export default NavBar;
