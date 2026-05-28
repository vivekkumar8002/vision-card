import PropTypes from 'prop-types';
import ProgressiveImage from './ProgressiveImage';
import ImageWrapper from './ImageWrapper';

function ProductBanner({
  content = {
    title: 'Shop',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque odit necessitatibus veritatis deserunt et eum eius pariatur earum quaerat quod.',
    img: '',
    imgCompressed: '',
    imgAlt: 'Placeholder banner image for collection',
  },
}) {
  return (
    <section className="banner">
      <div className="banner-main">
        <p className="banner-main__description">{content.description}</p>
      </div>
      <ImageWrapper className="banner-img--wrapper">
        <ProgressiveImage src={content.img} placeholder={content.imgCompressed}>
          {(src, loading) => (
            <img
              src={src}
              alt={content.imgAlt}
              className={`banner-img ${loading && 'img--loading'}`}
              loading="lazy"
            />
          )}
        </ProgressiveImage>
      </ImageWrapper>
    </section>
  );
}

ProductBanner.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    img: PropTypes.node.isRequired,
    imgCompressed: PropTypes.node.isRequired,
    imgAlt: PropTypes.string,
  }),
};

export default ProductBanner;
