import PropTypes from 'prop-types';

function ImageWrapper({ children, className = '' }) {
  return <div className={`img-wrapper ${className}`}>{children}</div>;
}

ImageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ImageWrapper;
