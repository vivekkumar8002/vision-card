import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import CartContext from './CartContext';
import AuthContext from './AuthContext';

function CartProvider({ children = <div>CartProvider</div> }) {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id || 'guest';
  const storageKey = `esCart:${userId}`;
  const prevUserIdRef = useRef(userId);

  const readCart = (key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const mergeCarts = (baseCart, incomingCart) => {
    const map = new Map();
    [...baseCart, ...incomingCart].forEach((item) => {
      if (!item?.itemId) return;
      const prev = map.get(item.itemId) || { itemId: item.itemId, quantity: 0 };
      map.set(item.itemId, {
        itemId: item.itemId,
        quantity: Number(prev.quantity || 0) + Number(item.quantity || 0),
      });
    });
    return Array.from(map.values()).filter((i) => i.quantity > 0);
  };

  const [cart, setCart] = useState(() => readCart(storageKey));
  const value = useMemo(() => [cart, setCart], [cart]);

  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    if (prevUserId === userId) return;

    const prevKey = `esCart:${prevUserId}`;
    const nextCart = readCart(storageKey);
    const prevCart = readCart(prevKey);

    if (prevUserId === 'guest' && userId !== 'guest') {
      const merged = mergeCarts(nextCart, prevCart);
      localStorage.setItem(storageKey, JSON.stringify(merged));
      localStorage.removeItem(prevKey);
      setCart(merged);
    } else {
      setCart(nextCart);
    }

    prevUserIdRef.current = userId;
  }, [storageKey, userId]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node,
};

export default CartProvider;
