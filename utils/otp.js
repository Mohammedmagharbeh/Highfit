
require("dotenv").config();

/**
 * توليد رمز التحقق (4 أرقام)
 */
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * إرسال رمز التحقق (OTP) للجم
 */
async function sendOTP(phone, otp) {
  const senderid = "HIGH FIT"; // معرف المرسل الخاص بك
  const accname = "highfit";
  const accpass = "RwQ$$8P_m@RA!Dsd88";

  const msg = `رمز التحقق الخاص بك في HIGH FIT هو: ${otp}`;
  const encodedMsg = encodeURIComponent(msg);
  const encodedPass = encodeURIComponent(accpass);

  // تنظيف الرقم من أي رموز غير الأرقام
  const cleanPhone = phone.replace(/\D/g, ""); 

  const url = `https://www.josms.net/SMSServices/Clients/Prof/RestSingleSMS/SendSMS` +
              `?senderid=${senderid}&numbers=${cleanPhone}&accname=${accname}` +
              `&AccPass=${encodedPass}&msg=${encodedMsg}`;

  try {
    const response = await fetch(url);
    const result = await response.text(); 
    return result;
  } catch (error) {
    console.error("SMS Error:", error.message);
    throw new Error("Failed to send OTP SMS");
  }
}

/**
 * إرسال تأكيد استلام الطلب للزبون (جديد)
 * سيتم استدعاء هذا الفنكشن عند ضغط الشيف على Accept
 */
async function sendOrderConfirm(phone, mealName = "") {
  const senderid = "HIGH FIT"; 
  const accname = "highfit";
  const accpass = "RwQ$$8P_m@RA!Dsd88";

  // الرسالة التي ستصل للزبون
  const msg = `تم التأكيد - طلبك (${mealName}) قيد التحضير في HIGH FIT. صحة وعافية!`;
  
  const encodedMsg = encodeURIComponent(msg);
  const encodedPass = encodeURIComponent(accpass);
  const cleanPhone = phone.replace(/\D/g, "");

  const url = `https://www.josms.net/SMSServices/Clients/Prof/RestSingleSMS/SendSMS` +
              `?senderid=${senderid}&numbers=${cleanPhone}&accname=${accname}` +
              `&AccPass=${encodedPass}&msg=${encodedMsg}`;

  try {
    const response = await fetch(url);
    const result = await response.text();
    console.log("Order Confirmation Sent:", result);
    return result;
  } catch (error) {
    console.error("Confirmation SMS Error:", error.message);
    throw new Error("Failed to send confirmation SMS");
  }
}

module.exports = { generateOTP, sendOTP, sendOrderConfirm };