

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendOTP(phone, otp) {
  const senderid = "HIGH FIT"; 
  const accname = "highfit";
  const accpass = "RwQ$$8P_m@RA!Dsd88";

  const msg = `رمز التحقق  : ${otp}`;
  const encodedMsg = encodeURIComponent(msg);
  const encodedPass = encodeURIComponent(accpass);

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
    throw new Error("Failed to send SMS");
  }
}

module.exports = { generateOTP, sendOTP };