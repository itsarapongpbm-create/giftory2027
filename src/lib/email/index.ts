import { Resend } from 'resend';

let _resendClient: Resend | null = null;
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!_resendClient) {
    _resendClient = new Resend(apiKey);
  }
  return _resendClient;
}

// Proxy export for backward compatibility without crashing on module evaluation
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResendClient();
    if (!client) {
      console.warn('RESEND_API_KEY is not configured or accessed in client-side environment.');
      return undefined;
    }
    return (client as unknown as Record<string, unknown>)[prop as string];
  },
});

// Role-based Sender Addresses
export const EMAIL_SENDERS = {
  // 1. Sales & Finance: Receipts, Tax Invoices, Quotations, Orders
  sales: process.env.EMAIL_SENDER_SALES || 'Giftory TH — Sales & Billing <sales@giftoryth.com>',

  // 2. Authentication & Security: OTP Verification
  auth: process.env.EMAIL_SENDER_AUTH || 'Giftory TH — Security & Auth <info@giftoryth.com>',

  // 3. Marketing & Announcements: Promotions, Newsletters, VIP Privileges
  marketing: process.env.EMAIL_SENDER_MARKETING || 'Giftory TH — Updates & Privileges <admin@giftoryth.com>',
};

/**
 * 1. Send OTP Verification Code from info@giftoryth.com
 */
export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const client = getResendClient();
    if (!client) {
      console.warn('RESEND_API_KEY is not configured.');
      return { success: false, error: 'ระบบส่งอีเมลยังไม่ได้รับการตั้งค่า' };
    }

    const { data, error } = await client.emails.send({
      from: EMAIL_SENDERS.auth,
      to: [toEmail],
      replyTo: 'info@giftoryth.com',
      subject: `รหัสยืนยันตัวตน Giftory TH: ${otpCode}`,
      html: `
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>รหัสยืนยันตัวตน Giftory TH</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #FCFCFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #100C08;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FCFCFF; padding: 40px 10px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid rgba(16, 12, 8, 0.12); padding: 40px 32px; text-align: center;">
                  <!-- Logo / Brand Header -->
                  <tr>
                    <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid rgba(16, 12, 8, 0.08);">
                      <span style="font-size: 22px; font-weight: 300; letter-spacing: 0.15em; color: #7D0A0A; text-transform: uppercase;">GIFTORY TH</span>
                      <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 300; letter-spacing: 0.25em; color: #100C08; opacity: 0.6; text-transform: uppercase;">Luxury & Bespoke Gifting</p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 32px 0 20px 0;">
                      <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 400; color: #100C08; letter-spacing: 0.02em;">
                        รหัสยืนยันตัวตนสำหรับเข้าสู่ระบบ
                      </h1>
                      <p style="margin: 0 0 28px 0; font-size: 13px; font-weight: 300; line-height: 1.6; color: #100C08; opacity: 0.75;">
                        กรุณานำรหัส 6 หลักด้านล่างนี้ไปกรอกในหน้าเข้าสู่ระบบเพื่อยืนยันตัวตน
                      </p>

                      <!-- OTP Code Box -->
                      <div style="background-color: #F8F7F4; border: 1px solid #EAD196; padding: 20px; margin: 0 auto; max-width: 280px; letter-spacing: 0.35em; font-family: monospace; font-size: 32px; font-weight: 600; color: #7D0A0A;">
                        ${otpCode}
                      </div>

                      <p style="margin: 24px 0 0 0; font-size: 12px; font-weight: 300; color: #BF3131;">
                        * รหัสนี้มีอายุการใช้งาน 10 นาที และใช้ได้เพียงครั้งเดียว
                      </p>
                    </td>
                  </tr>

                  <!-- Security Notice Footer -->
                  <tr>
                    <td style="padding-top: 24px; border-top: 1px solid rgba(16, 12, 8, 0.08); text-align: center;">
                      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 300; color: #100C08; opacity: 0.5;">
                        หากท่านไม่ได้เป็นผู้ส่งคำขอนี้ สามารถเพิกเฉยต่ออีเมลฉบับนี้ได้ ข้อมูลของท่านยังคงปลอดภัย
                      </p>
                      <p style="margin: 0; font-size: 11px; font-weight: 300; color: #100C08; opacity: 0.4;">
                        Giftory TH • กรุงเทพมหานคร • info@giftoryth.com
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend sendOtpEmail error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Exception in sendOtpEmail:', err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการส่งอีเมล' };
  }
}

/**
 * 2. Send Order Confirmation & Receipt from sales@giftoryth.com
 */
export type OrderItemDetail = {
  title: string;
  quantity: number;
  price: number;
};

export type OrderReceiptParams = {
  toEmail: string;
  orderId: string;
  items: OrderItemDetail[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  recipientName: string;
  shippingAddress: string;
  paymentMethod: string;
  cardMessage?: string;
  cardTo?: string;
  cardFrom?: string;
};

export async function sendOrderReceiptEmail(params: OrderReceiptParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const client = getResendClient();
    if (!client) {
      return { success: false, error: 'ระบบส่งอีเมลยังไม่ได้รับการตั้งค่า' };
    }

    const {
      toEmail,
      orderId,
      items,
      subtotal,
      shippingFee,
      discount,
      total,
      deliveryDate,
      deliveryTimeSlot,
      recipientName,
      shippingAddress,
      paymentMethod,
      cardMessage,
      cardTo,
      cardFrom,
    } = params;

    const itemsRowsHtml = items
      .map(
        item => `
          <tr>
            <td style="padding: 12px 0; font-size: 13px; font-weight: 300; color: #100C08; border-bottom: 1px solid rgba(16, 12, 8, 0.08);">
              ${item.title} <span style="color: rgba(16, 12, 8, 0.5); font-size: 11px;">(x${item.quantity})</span>
            </td>
            <td align="right" style="padding: 12px 0; font-size: 13px; font-weight: 400; color: #7D0A0A; border-bottom: 1px solid rgba(16, 12, 8, 0.08);">
              ฿${(item.price * item.quantity).toLocaleString('th-TH')}
            </td>
          </tr>
        `
      )
      .join('');

    const greetingCardHtml =
      cardMessage || cardTo || cardFrom
        ? `
          <div style="margin-top: 24px; padding: 18px; background-color: #F8F7F4; border: 1px dashed #EAD196; text-align: left;">
            <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 500; color: #7D0A0A; letter-spacing: 0.1em; text-transform: uppercase;">ข้อความบนการ์ดอวยพรอภินันทนาการ:</p>
            ${cardTo ? `<p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 400;">ถึง: ${cardTo}</p>` : ''}
            <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 300; font-style: italic; color: #100C08;">&ldquo;${cardMessage || ''}&rdquo;</p>
            ${cardFrom ? `<p style="margin: 0; font-size: 12px; font-weight: 400; color: #7D0A0A; text-align: right;">จาก: ${cardFrom}</p>` : ''}
          </div>
        `
        : '';

    const { data, error } = await client.emails.send({
      from: EMAIL_SENDERS.sales,
      to: [toEmail],
      replyTo: 'sales@giftoryth.com',
      subject: `ใบเสร็จรับเงินและยืนยันคำสั่งซื้อ Giftory TH [${orderId}]`,
      html: `
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ใบเสร็จคำสั่งซื้อ Giftory TH</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #FCFCFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #100C08;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FCFCFF; padding: 40px 10px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid rgba(16, 12, 8, 0.12); padding: 40px 32px;">
                  <!-- Logo / Header -->
                  <tr>
                    <td style="padding-bottom: 24px; border-bottom: 1px solid rgba(16, 12, 8, 0.1);">
                      <table width="100%" role="presentation">
                        <tr>
                          <td>
                            <span style="font-size: 22px; font-weight: 300; letter-spacing: 0.15em; color: #7D0A0A; text-transform: uppercase;">GIFTORY TH</span>
                            <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 300; letter-spacing: 0.25em; color: #100C08; opacity: 0.6; text-transform: uppercase;">Official Order Receipt</p>
                          </td>
                          <td align="right">
                            <span style="font-size: 12px; font-weight: 500; color: #7D0A0A; font-family: monospace;">${orderId}</span>
                            <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 300; color: #100C08; opacity: 0.5;">ยืนยันคำสั่งซื้อสำเร็จ</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding: 24px 0 16px 0;">
                      <h1 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 400; color: #100C08;">
                        ขอบพระคุณสำหรับการสั่งซื้อกระเช้าของขวัญ
                      </h1>
                      <p style="margin: 0; font-size: 13px; font-weight: 300; line-height: 1.6; color: #100C08; opacity: 0.75;">
                        ระบบได้รับคำสั่งซื้อและยอดชำระเงินเรียบร้อยแล้ว ทีมงาน Giftory Concierge กำลังดำเนินการคัดสรรสินค้าและจัดเตรียมกระเช้าด้วยความประณีตสูงสุด
                      </p>
                    </td>
                  </tr>

                  <!-- Items Table -->
                  <tr>
                    <td>
                      <table width="100%" role="presentation" cellspacing="0" cellpadding="0" style="margin: 16px 0;">
                        <thead>
                          <tr>
                            <th align="left" style="padding-bottom: 8px; font-size: 11px; font-weight: 500; text-transform: uppercase; color: rgba(16, 12, 8, 0.5); letter-spacing: 0.05em; border-bottom: 1px solid rgba(16, 12, 8, 0.15);">รายการของขวัญ</th>
                            <th align="right" style="padding-bottom: 8px; font-size: 11px; font-weight: 500; text-transform: uppercase; color: rgba(16, 12, 8, 0.5); letter-spacing: 0.05em; border-bottom: 1px solid rgba(16, 12, 8, 0.15);">ยอดรวม</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsRowsHtml}
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <!-- Financial Summary -->
                  <tr>
                    <td style="padding: 12px 0 24px 0; border-bottom: 1px solid rgba(16, 12, 8, 0.1);">
                      <table width="100%" role="presentation" style="font-size: 13px; font-weight: 300;">
                        <tr>
                          <td style="padding: 4px 0; color: rgba(16, 12, 8, 0.7);">ยอดรวมสินค้า:</td>
                          <td align="right" style="padding: 4px 0;">฿${subtotal.toLocaleString('th-TH')}</td>
                        </tr>
                        ${
                          discount > 0
                            ? `
                          <tr>
                            <td style="padding: 4px 0; color: #7D0A0A;">ส่วนลดโปรโมชั่น:</td>
                            <td align="right" style="padding: 4px 0; color: #7D0A0A;">-฿${discount.toLocaleString('th-TH')}</td>
                          </tr>
                        `
                            : ''
                        }
                        <tr>
                          <td style="padding: 4px 0; color: rgba(16, 12, 8, 0.7);">ค่าบริการจัดส่ง:</td>
                          <td align="right" style="padding: 4px 0;">${shippingFee === 0 ? 'ฟรี (Complimentary)' : `฿${shippingFee.toLocaleString('th-TH')}`}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: rgba(16, 12, 8, 0.7);">การ์ดอวยพร & ริบบิ้น:</td>
                          <td align="right" style="padding: 4px 0; color: #7D0A0A;">ฟรี</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0 0 0; font-size: 15px; font-weight: 500; color: #100C08;">ยอดสุทธิที่ชำระ:</td>
                          <td align="right" style="padding: 12px 0 0 0; font-size: 18px; font-weight: 500; color: #7D0A0A;">฿${total.toLocaleString('th-TH')}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Delivery & Recipient Details -->
                  <tr>
                    <td style="padding: 24px 0 16px 0;">
                      <table width="100%" role="presentation" style="font-size: 12px; font-weight: 300; line-height: 1.6;">
                        <tr>
                          <td width="50%" valign="top" style="padding-right: 12px;">
                            <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 500; color: #7D0A0A; text-transform: uppercase;">ข้อมูลผู้รับมอบ:</p>
                            <p style="margin: 0 0 2px 0; font-weight: 400; color: #100C08;">${recipientName}</p>
                            <p style="margin: 0; color: rgba(16, 12, 8, 0.7);">${shippingAddress}</p>
                          </td>
                          <td width="50%" valign="top" style="padding-left: 12px;">
                            <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 500; color: #7D0A0A; text-transform: uppercase;">กำหนดส่งมอบ & วิธีชำระ:</p>
                            <p style="margin: 0 0 2px 0; color: #100C08;">วันที่: <strong>${deliveryDate}</strong></p>
                            <p style="margin: 0 0 2px 0; color: #100C08;">ช่วงเวลา: ${deliveryTimeSlot}</p>
                            <p style="margin: 0; color: rgba(16, 12, 8, 0.7);">ช่องทาง: ${paymentMethod}</p>
                          </td>
                        </tr>
                      </table>

                      ${greetingCardHtml}
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 24px; border-top: 1px solid rgba(16, 12, 8, 0.08); text-align: center;">
                      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 300; color: #100C08; opacity: 0.6;">
                        หากต้องการสอบถามข้อมูลเพิ่มเติมเกี่ยวกับคำสั่งซื้อ กรุณาติดต่อ sales@giftoryth.com
                      </p>
                      <p style="margin: 0; font-size: 11px; font-weight: 300; color: #100C08; opacity: 0.4;">
                        Giftory TH • Official Sales & Billing • sales@giftoryth.com
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend sendOrderReceiptEmail error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Exception in sendOrderReceiptEmail:', err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการส่งใบเสร็จ' };
  }
}

/**
 * 3. Send Marketing & Promotional Email from admin@giftoryth.com
 */
export async function sendMarketingEmail(params: {
  toEmail: string;
  subject: string;
  title: string;
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const client = getResendClient();
    if (!client) {
      return { success: false, error: 'ระบบส่งอีเมลยังไม่ได้รับการตั้งค่า' };
    }

    const { toEmail, subject, title, contentHtml, ctaText, ctaUrl } = params;

    const { data, error } = await client.emails.send({
      from: EMAIL_SENDERS.marketing,
      to: [toEmail],
      replyTo: 'admin@giftoryth.com',
      subject,
      html: `
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #FCFCFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #100C08;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FCFCFF; padding: 40px 10px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid rgba(16, 12, 8, 0.12); padding: 40px 32px; text-align: center;">
                  <tr>
                    <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid rgba(16, 12, 8, 0.08);">
                      <span style="font-size: 22px; font-weight: 300; letter-spacing: 0.15em; color: #7D0A0A; text-transform: uppercase;">GIFTORY TH</span>
                      <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 300; letter-spacing: 0.25em; color: #100C08; opacity: 0.6; text-transform: uppercase;">Privileges & Seasonal Updates</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 0 20px 0; text-align: left;">
                      <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 400; color: #100C08; text-align: center;">
                        ${title}
                      </h1>
                      <div style="font-size: 13px; font-weight: 300; line-height: 1.7; color: #100C08; opacity: 0.85;">
                        ${contentHtml}
                      </div>

                      ${
                        ctaText && ctaUrl
                          ? `
                        <div style="text-align: center; margin-top: 32px;">
                          <a href="${ctaUrl}" style="display: inline-block; background-color: #7D0A0A; color: #FFFFFF; padding: 14px 32px; text-decoration: none; font-size: 12px; font-weight: 300; letter-spacing: 0.1em; text-transform: uppercase;">
                            ${ctaText}
                          </a>
                        </div>
                      `
                          : ''
                      }
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top: 24px; border-top: 1px solid rgba(16, 12, 8, 0.08); text-align: center;">
                      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 300; color: #100C08; opacity: 0.4;">
                        อีเมลฉบับนี้ส่งถึงสมาชิกผู้รับข่าวสารของ Giftory TH • admin@giftoryth.com
                      </p>
                      <p style="margin: 0; font-size: 10px; font-weight: 300; color: #100C08; opacity: 0.35;">
                        หากไม่ต้องการรับข่าวสาร สามารถแจ้งยกเลิกได้ที่ support@giftoryth.com
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend sendMarketingEmail error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Exception in sendMarketingEmail:', err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการส่งอีเมลประชาสัมพันธ์' };
  }
}
