import { useState } from 'react';
import { Link } from 'react-router-dom';
import Flickity from 'react-flickity-component';
import ProgressiveImage from './ProgressiveImage';

import ImageWrapper from './ImageWrapper';

import { allProductsData } from '../data/productData';
import getCategory from '../utils/getCategory';

function FeaturedProducts() {
  const products = Array.isArray(allProductsData) ? allProductsData : [];
  const [featured] = useState([
    products[11],
    products[50],
    products[75],
    products[54],
    products[23],
    products[40],
  ]);

  const flickityOptions = {
    freeScroll: true,
    wrapAround: true,
    initialIndex: 0,
    autoPlay: 10000,
    pauseAutoPlayOnHover: false,
  };

  return (
    <section className="fp featured-products">
      <h3 className="fp__title">New Arrivals</h3>
      <Flickity
        options={flickityOptions}
        elementType="div"
        className="fp__products
      "
      >
        {featured.filter(Boolean).map((item) => (
          <Link
            to={`/products/${getCategory(item.type)}/${item.id}`}
            key={`${item.id}--featured-${item.type}`}
            className="fp-product"
          >
            <ImageWrapper
              className="fp-product__img-wrapper
            "
            >
              <ProgressiveImage
                src={item.images.main}
                placeholder={item.compressedImages.main}
              >
                {(src, loading) => (
                  <img
                    src={src}
                    alt={`${item.title} front profile`}
                    className={`fp-product__img
                     ${loading && 'img--loading'}`}
                    loading="lazy"
                  />
                )}
              </ProgressiveImage>
            </ImageWrapper>
            <span className="fp-product__price">
              {typeof item.price === 'string' ? item.price.replace('₱', '₹') : item.price}
            </span>
          </Link>
        ))}
      </Flickity>
    </section>
  );
}

export default FeaturedProducts;
