export type ImageCropProfile =
  | 'media'
  | 'homeCover'
  | 'product'
  | 'square'
  | 'identity'
  | 'wide'
  | 'about'
  | 'contactLogo'
  | 'contactFeature'
  | 'customGift'
  | 'customGiftFeatured';

type CropProfile = {
  label: string;
  ratio?: number;
  previews: { label: string; ratio: number }[];
  note?: string;
};

export const imageCropProfiles: Record<ImageCropProfile, CropProfile> = {
  media: {
    label: 'คลังรูปภาพ',
    previews: [],
    note: 'เลือกรูปทรงตามการใช้งาน หรือคงสัดส่วนต้นฉบับไว้',
  },
  homeCover: {
    label: 'แบนเนอร์หน้าหลัก',
    ratio: 64 / 25,
    previews: [
      { label: 'คอม 1920 × 750', ratio: 64 / 25 },
      { label: 'แล็ปท็อป 1366 × 750', ratio: 1366 / 750 },
      { label: 'มือถือ 390 × 300', ratio: 1.3 },
    ],
    note: 'กรอบเปลี่ยนตามหน้าจอ ตัวอย่างนี้ใช้การตัดภาพตรงกลางแบบหน้าเว็บจริง วางข้อความหรือจุดสำคัญไว้ตรงกลางเพื่อให้เห็นบนมือถือด้วย',
  },
  product: {
    label: 'รูปสินค้า',
    ratio: 2 / 3,
    previews: [
      { label: 'การ์ด Basket · 2:3', ratio: 2 / 3 },
      { label: 'Best Seller · 3:4', ratio: 3 / 4 },
    ],
    note: 'การ์ด Basket มีชื่อและราคาทับส่วนล่าง ส่วน Best Seller ใช้กรอบ 3:4 จึงอาจตัดขอบบนและล่างเพิ่ม',
  },
  square: {
    label: 'รูปสี่เหลี่ยมจัตุรัส · 1:1',
    ratio: 1,
    previews: [{ label: 'ตัวอย่างบนเว็บไซต์ · 1:1', ratio: 1 }],
  },
  identity: {
    label: 'Special Identity · 13:14',
    ratio: 13 / 14,
    previews: [{ label: 'ตัวอย่างบนเว็บไซต์ · 13:14', ratio: 13 / 14 }],
  },
  wide: {
    label: 'Custom Gift หน้าหลัก · 16:9',
    ratio: 16 / 9,
    previews: [{ label: 'ตัวอย่างบนเว็บไซต์ · 16:9', ratio: 16 / 9 }],
  },
  about: {
    label: 'รูปหน้า About · 6:5',
    ratio: 6 / 5,
    previews: [
      { label: 'คอม 600 × 500', ratio: 6 / 5 },
      { label: 'มือถือ 390 × 500', ratio: 390 / 500 },
    ],
    note: 'หน้า About สูง 500px ความกว้างเปลี่ยนตามหน้าจอ บางรูปมีข้อความทับด้านหน้า',
  },
  contactLogo: {
    label: 'รูปหลักหน้า Contact',
    ratio: 960 / 790,
    previews: [
      { label: 'คอม 1920 × 1080 (กรอบ 960 × 790)', ratio: 960 / 790 },
      { label: 'มือถือโดยประมาณ · 1:1', ratio: 1 },
    ],
    note: 'กรอบหน้า Contact เปลี่ยนตามความกว้างและความสูงของหน้าจอ',
  },
  contactFeature: {
    label: 'ภาพประกอบหน้า Contact',
    ratio: 12 / 5,
    previews: [
      { label: 'คอม 960 × 400', ratio: 12 / 5 },
      { label: 'มือถือ 390 × 400', ratio: 390 / 400 },
    ],
    note: 'ภาพนี้มีข้อความทับด้านหน้า ความกว้างเปลี่ยนตามหน้าจอ',
  },
  customGift: {
    label: 'การ์ด Custom Gift · 2:3',
    ratio: 2 / 3,
    previews: [{ label: 'กรอบการ์ด · 2:3', ratio: 2 / 3 }],
    note: 'รูปที่ตั้ง Image CSS Class ไว้อาจมีขนาดหรือตำแหน่งต่างจากกรอบมาตรฐานนี้',
  },
  customGiftFeatured: {
    label: 'รูปเด่น Custom Gift · 4:3',
    ratio: 4 / 3,
    previews: [
      { label: 'จอคอม · 4:3', ratio: 4 / 3 },
      { label: 'มือถือ · 2:3', ratio: 2 / 3 },
    ],
    note: 'รูปเด่นเปลี่ยนสัดส่วนตามหน้าจอ และอาจมี Image CSS Class กำหนดเพิ่มเติม',
  },
};

export function cropGeometry(
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
  zoom: number,
  x: number,
  y: number
) {
  const scale = Math.max(width / sourceWidth, height / sourceHeight) * zoom;
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  return {
    x: ((width - drawWidth) * x) / 100,
    y: ((height - drawHeight) * y) / 100,
    width: drawWidth,
    height: drawHeight,
  };
}
