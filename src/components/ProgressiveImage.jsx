import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function ProgressiveImage({ src = '', placeholder = '', children }) {
  const [activeSrc, setActiveSrc] = useState(placeholder || src);
  const [loading, setLoading] = useState(Boolean(placeholder));

  useEffect(() => {
    let cancelled = false;

    if (!src) {
      setActiveSrc('');
      setLoading(false);
      return () => {};
    }

    setActiveSrc(placeholder || src);
    setLoading(Boolean(placeholder));

    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      setActiveSrc(src);
      setLoading(false);
    };
    img.onerror = () => {
      if (cancelled) return;
      setActiveSrc(src);
      setLoading(false);
    };

    return () => {
      cancelled = true;
    };
  }, [src, placeholder]);

  return children(activeSrc, loading);
}

ProgressiveImage.propTypes = {
  src: PropTypes.string,
  placeholder: PropTypes.string,
  children: PropTypes.func.isRequired,
};

export default ProgressiveImage;
