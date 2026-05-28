import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import CartContext from "../context/CartContext";
import AuthContext from "../context/AuthContext";

function NavBarSticky({ toggleSearchView }) {
  const [menuVisible, setMenuVisibility] = useState(false);
  const [cartItems] = useContext(CartContext);
  const auth = useContext(AuthContext);

  const toggleMenuVisibility = () => {
    setMenuVisibility((prev) => !prev);
  };

  const hideMenu = () => {
    setMenuVisibility(false);
  };

  useEffect(() => {
    const windowHideMenuClick = (e) => {
      if (!e.target.closest(".nav")) hideMenu();
    };

    const windowHideMenuEsc = (e) => {
      if (e.key === "Escape") hideMenu();
    };

    window.addEventListener("click", windowHideMenuClick);
    window.addEventListener("keydown", windowHideMenuEsc);

    return () => {
      window.removeEventListener("click", windowHideMenuClick);
      window.removeEventListener("keydown", windowHideMenuEsc);
    };
  }, []);

  return (
    <motion.nav
      className="nav nav--sticky"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "tween" }}
    >
      <button
        type="button"
        className="material-symbols-outlined nav__btn-menu"
        onClick={toggleMenuVisibility}
        data-testid="menu-btn"
      >
        menu
      </button>

      {/* LOGO FIXED */}
      <Link to="/" className="nav__logo">
        <img
          src="/favicon.png"
          alt="Vivek Logo"
          className="nav__logo-img"
        />
      </Link>

      <ul className="nav__links">
        <NavLink to="/products" className="nav__link">
          Collection
        </NavLink>

        <NavLink to="/products/eyeglasses" className="nav__link">
          Eyeglasses
        </NavLink>

        <NavLink to="/products/sunglasses" className="nav__link">
          Sunglasses
        </NavLink>

        <NavLink to="/about" className="nav__link">
          About us
        </NavLink>
      </ul>

      <div className="nav__icons-wrapper">
        <button
          type="button"
          className="nav__btn-icon material-symbols-outlined"
          onClick={toggleSearchView}
        >
          search
        </button>

        <Link to="/cart" className="nav__btn-icon material-symbols-outlined">
          shopping_bag
          {cartItems.length > 0 && (
            <div className="cart-badge">{cartItems.length}</div>
          )}
        </Link>
      </div>

      <AnimatePresence>
        {menuVisible && (
          <motion.nav
            className="nav-menu"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1, originY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ type: "tween" }}
            data-testid="menu-dropdown"
          >
            <ul className="nav-menu__links">
              <NavLink to="/products" className="nav-menu__link">
                Collection
              </NavLink>

              <NavLink to="/products/eyeglasses" className="nav-menu__link">
                Eyeglasses
              </NavLink>

              <NavLink to="/products/sunglasses" className="nav-menu__link">
                Sunglasses
              </NavLink>

              <NavLink to="/about" className="nav-menu__link">
                About us
              </NavLink>

              <NavLink to="/tryon" className="nav-menu__link">
                Try On
              </NavLink>

              <NavLink to="/assistant" className="nav-menu__link">
                Assistant
              </NavLink>

              {!auth?.isAuthenticated && (
                <>
                  <NavLink to="/login" className="nav-menu__link">
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="nav-menu__link">
                    Signup
                  </NavLink>
                </>
              )}
              {auth?.isAuthenticated && !auth?.user?.isAdmin && (
                <NavLink to="/profile" className="nav-menu__link">
                  Profile
                </NavLink>
              )}
              {auth?.isAuthenticated && auth?.user?.isAdmin && (
                <NavLink to="/admin" className="nav-menu__link">
                  Dashboard
                </NavLink>
              )}
            </ul>

            <button
              type="button"
              className="material-symbols-outlined nav-menu__btn-collapse"
              onClick={hideMenu}
              data-testid="hide-menu-btn"
            >
              arrow_back_ios_new
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

NavBarSticky.propTypes = {
  toggleSearchView: PropTypes.func.isRequired,
};

export default NavBarSticky;
