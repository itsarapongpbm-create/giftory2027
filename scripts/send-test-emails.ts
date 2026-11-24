import { sendOtpEmail, sendOrderReceiptEmail, sendMarketingEmail } from '../src/lib/email';

const targetEmail = process.argv[2] || 'itsarapong.pbm@gmail.com';

async function main() {
  console.log(`Sending all 3 test emails to: ${targetEmail}`);

  // 1. OTP Email (info@giftoryth.com)
  console.log('\n[1/3] Sending OTP Email from info@giftoryth.com...');
  const otpRes = await sendOtpEmail(targetEmail, '892415');
  console.log('OTP Result:', otpRes);

  // 2. Order Receipt Email (sales@giftoryth.com)
  console.log('\n[2/3] Sending Order Receipt from sales@giftoryth.com...');
  const receiptRes = await sendOrderReceiptEmail({
    toEmail: targetEmail,
    orderId: 'GFT-20261124-889',
    items: [
      {
        title: 'Grand Elegance — กระเช้าของขวัญรังนกแท้ & ชาออร์แกนิกพรีเมียม',
        quantity: 1,
        price: 4950,
      },
      {
        title: 'Bespoke Scented Candle & Velvet Ribbon Set',
        quantity: 1,
        price: 850,
      },
    ],
    subtotal: 5800,
    shippingFee: 0,
    discount: 500,
    total: 5300,
    deliveryDate: '28 พฤศจิกายน 2569',
    deliveryTimeSlot: '13:00 - 17:00 น. (ช่วงบ่าย)',
    recipientName: 'คุณอิศรพงษ์ และครอบครัว',
    shippingAddress: '123/45 อาคารเพรสทีจทาวเวอร์ แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330',
    paymentMethod: 'บัตรเครดิต (Credit Card - Visa ending in 4242)',
    cardMessage: 'ขอส่งมอบความปรารถนาดีและความสุขแด่ท่านและครอบครัว เนื่องในโอกาสอันเป็นมงคลนี้ ขอให้มีสุขภาพพลานามัยที่สมบูรณ์และเจริญรุ่งเรืองยิ่งๆ ขึ้นไป',
    cardTo: 'คุณอิศรพงษ์',
    cardFrom: 'Giftory TH Concierge Team',
  });
  console.log('Receipt Result:', receiptRes);

  // 3. Marketing & VIP Announcement Email (admin@giftoryth.com)
  console.log('\n[3/3] Sending VIP Marketing Email from admin@giftoryth.com...');
  const marketingRes = await sendMarketingEmail({
    toEmail: targetEmail,
    subject: 'Giftory Privileges — เอกสิทธิ์พิเศษประจำฤดูกาลสำหรับสมาชิกคนสำคัญ',
    title: 'THE BESPOKE WINTER CELEBRATION',
    contentHtml: `
      <p style="margin: 0 0 16px 0;">
        เรียน ท่านสมาชิกผู้ทรงเกียรติ,
      </p>
      <p style="margin: 0 0 16px 0;">
        เพื่อเฉลิมฉลองเทศกาลแห่งความสุขและการส่งมอบความปรารถนาดี Giftory TH ภูมิใจนำเสนอคอลเลกชันกระเช้าของขวัญประจำฤดูกาลใหม่ 
        ที่ผ่านการคัดสรรวัตถุดิบและของขวัญชั้นเลิศจากทั่วทุกมุมโลก พร้อมการรังสรรค์บรรจุภัณฑ์ด้วยผ้าไหมริบบิ้นนำเข้าและการ์ดเขียนมือเฉพาะบุคคล
      </p>
      <p style="margin: 0 0 16px 0; padding: 14px 18px; background-color: #F8F7F4; border-left: 3px solid #7D0A0A;">
        <strong>เอกสิทธิ์เฉพาะสมาชิก:</strong> รับส่วนลดพิเศษ 10% สำหรับทุกการสั่งจองล่วงหน้า พร้อมบริการจัดส่งด่วนโดยเจ้าหน้าที่ Concierge ส่งมอบถึงมือผู้รับด้วยความประณีต
      </p>
      <p style="margin: 0;">
        ขอขอบพระคุณที่ท่านได้ให้ความไว้วางใจให้ Giftory TH เป็นตัวแทนส่งต่อความประทับใจในทุกช่วงเวลาสำคัญ
      </p>
    `,
    ctaText: 'ชมคอลเลกชันพิเศษ',
    ctaUrl: 'https://dev.giftoryth.com/baskets',
  });
  console.log('Marketing Result:', marketingRes);

  console.log('\nAll 3 test emails processed successfully.');
}

main().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
