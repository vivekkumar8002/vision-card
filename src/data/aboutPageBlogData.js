import { BLOB_URL } from '../config';

const blogData = [
  {
    id: 'blog-post-new-loc-singapore',
    category: 'locations',
    title: "We're coming to Singapore",
    description:
      "We are opening a new location in Singapore! Our unique collection of glasses and sunglasses is coming to the heart of the city, and we can't wait for you to come and explore our latest designs.",
    img: `${BLOB_URL}/unsplash/store-5.webp`,
    imgCompressed: `${BLOB_URL}/unsplash/store-5.webp`,
    imgAlt: 'Depiction of the store display of frames',
  },
  {
    id: 'blog-post-meet-our-vivek-family',
    category: 'community',
    title: 'Meet our Family',
    description:
      'At our brand, we place a great emphasis on the value of community and family. From our dedicated team members to our loyal customers, we see everyone as a part of the larger family that makes our brand what it is today.',
    img: `${BLOB_URL}/unsplash/frame-4.webp`,
    imgCompressed: `${BLOB_URL}/unsplash/frame-4.webp`,
    imgAlt:
      'Black man holding his child in his arms and kissing him on his cheeks',
  },
  {
    id: 'blog-post-vivek-moments-eye-spy',
    category: '#vivekmoments',
    title: 'Eye Spy',
    description:
      'Our brand has been spotted on some of the biggest names in Hollywood! From red carpet events to casual outings, these stars have been rocking our frames and proving that our designs are truly timeless.',
    img: `${BLOB_URL}/unsplash/yohji-yamamoto-7029-1.jpg`,
    imgCompressed: `${BLOB_URL}/unsplash/yohji-yamamoto-7029-1.jpg`,
    imgAlt:
      'Happy woman wearing sunglasses--holding her hands up with peace signs',
  },
];

export default blogData;
