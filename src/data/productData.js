import framesData from "./json/framesProductData.json";
import sunniesData from "./json/sunniesProductData.json";

import parsePrice from '../utils/parsePrice';
import formatPrice from '../utils/formatPrice';

// ensure every product price falls within the given range (500–1000)
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function normalizeItemPrices(item) {
  const MIN = 500;
  const MAX = 1000;
  let priceNum = parsePrice(item.price || "");
  // base clamping first
  let clamped = clamp(priceNum || MIN, MIN, MAX);

  // apply special pricing rules requested by user
  if (item.type === "sunnies") {
    // sunglasses always ₹1000 with 5% discount
    clamped = 1000;
    const original = 1000 / 0.95; // ~1052.63
    item.originalPrice = formatPrice(original);
  }
  if (item.type === "frames") {
    // eyeglasses always ₹600 with 12% discount
    clamped = 600;
    const original = 600 / 0.88; // ~681.82
    item.originalPrice = formatPrice(original);
  }

  item.price = formatPrice(clamped);
  if (item.originalPrice && item.type !== "sunnies" && item.type !== "frames") {
    // re-clamp originalPrice only for generic cases
    const origNum = parsePrice(item.originalPrice);
    item.originalPrice = formatPrice(clamp(origNum || clamped, MIN, MAX));
  }
  return item;
}

/* =====================================================
   IMAGE GENERATORS
===================================================== */

/* ---------- Frame Images (.webp) ---------- */
function getFrameImage(number, isCompressed = false) {
  const folder = "framesmages";
  return `/${folder}/frame-${number}.webp`;
}

/* ---------- Sunglass Images (.jpg) ---------- */
function getSunglassImage(number, isCompressed = false) {
  const folder = "sunniesImages";
  return `/${folder}/sunglass-${number}.jpg`;
}

/* =====================================================
   DATA MAPPING (UNLIMITED IMAGES)
===================================================== */

/* ---------- Frames ---------- */
function mapFrame(item, index) {
  // clamp prices before returning so UI always sees a value between 500 and 1000
  const normalized = normalizeItemPrices({ ...item });

  const FRAME_NUMS = [1, 2, 3, 4, 5, 6, 7, 12];
  const number = FRAME_NUMS[index % FRAME_NUMS.length];

  const main = getFrameImage(number);
  const compressed = getFrameImage(number, true);

  return {
    ...normalized,
    images: {
      main,
      side: main, // prevent undefined error
    },
    compressedImages: {
      main: compressed,
      side: compressed,
    },
  };
}

/* ---------- 360-degree Images for Sunglasses ---------- */
function get360Images(number) {
  // Generate an array of 8 images for 360-degree view
  // Using available images cyclically to simulate rotation
  const allSunNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 28];
  
  // Create 8 frames by cycling through available images
  const frames = [];
  for (let i = 0; i < 8; i++) {
    const imgIndex = allSunNums[(number + i) % allSunNums.length];
    frames.push(getSunglassImage(imgIndex));
  }
  return frames;
}

/* ---------- Sunglasses ---------- */
function mapSunglass(item, index) {
  const normalized = normalizeItemPrices({ ...item });
  const SUN_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 28];
  const number = SUN_NUMS[index % SUN_NUMS.length];

  const main = getSunglassImage(number);
  const compressed = getSunglassImage(number, true);
  
  // Generate 360-degree images
  const images360 = get360Images(number);

  return {
    ...normalized,
    images: {
      main,
      side: main,
     360: images360,
    },
    compressedImages: {
      main: compressed,
      side: compressed,
    },
    has360View: true, // Flag to indicate 360 view is available
  };
}

/* =====================================================
   EXPORT DATA
===================================================== */

export const eyeglassesData = framesData.map((item, index) =>
  Object.freeze(mapFrame(item, index))
);

export const sunglassesData = sunniesData.map((item, index) =>
  Object.freeze(mapSunglass(item, index))
);

export const allProductsData = [
  ...eyeglassesData,
  ...sunglassesData,
];
