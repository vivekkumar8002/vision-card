import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import CartContext from '../context/CartContext';
import CartRow from '../components/CartRow';
import ScrollToTop from '../components/ScrollToTop';

import { allProductsData } from '../data/productData';
import getTotalPrice from '../utils/getTotalPrice';
import formatPrice from '../utils/formatPrice';

function CartPage() {
  const [cart] = useContext(CartContext);
  const products = Array.isArray(allProductsData) ? allProductsData : [];

  useEffect(() => {
    document.title = 'Your Shopping Cart | vivek Eyewear Store';
  }, []);

  return (
    <main className="cart-page">
      {cart.length >= 1 ? (
        <>
          <h1 className="cart__title">YOUR CART</h1>
          <form
            action=""
            className="cart__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <table className="cart__table">
              <thead>
                <tr className="cart-item__row cart-item__header-row">
                  <th
                    scope="col"
                    className="cart-item__header-cell
                "
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="cart-item__header-cell
                "
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="cart-item__header-cell
                "
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="cart-item__header-cell
                "
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const productInCart = products.find(
                    (product) => product.id === item.itemId,
                  );
                  if (!productInCart) return null;
                  return (
                    <CartRow
                      key={`${item.itemId}--product-in-cart`}
                      product={productInCart}
                    />
                  );
                })}
              </tbody>
            </table>
            <div className="cart__checkout">
              <div className="cart__total-price">
                <div className="cart__total-price--wrapper">
                  <span className="cart__total-price--label">Subtotal</span>
                  <span className="cart__total-price--actual">
                    {formatPrice(getTotalPrice(cart))}
                  </span>
                </div>
                <div className="cart__total-price--disclaimer">
                  Shipping and taxes computed at checkout
                </div>
              </div>
              <Link to="/checkout" className="cart__btn-submit">
                CHECKOUT
              </Link>
              <Link to="/products" className="cart__shop-link">
                Keep Shopping
              </Link>
            </div>
          </form>
        </>
      ) : (
        <div className="cart-empty--wrapper">
          <span className="cart-empty__message">
            Your cart is looking empty
          </span>
          <Link to="/products" className="cart-empty__link">
            Shop Now
          </Link>
        </div>
      )}
      <ScrollToTop />
    </main>
  );
}
export default CartPage;
