/* Content for the nine new Arena games: bilingual, backup-first.
   Every game is fully playable from this local content with no API key.
   Burmese follows the natural spoken style: တယ် / ဆိုတာ forms, English
   tech words mixed in, no formal patterns. */

import type { Lang } from "./content";

export const pick = (lang: Lang, en: string, my: string) => (lang === "my" ? my : en);

/* ================= Phishing Inbox Rush ================= */
export interface RushMsg { isScam: boolean; fromEn: string; fromMy: string; en: string; my: string; }
export const RUSH_MESSAGES: RushMsg[] = [
  { isScam: true, fromEn: "KBZPay Promo", fromMy: "KBZPay Promo",
    en: "You won 1,000,000 MMK! Tap the link and type your PIN in 10 minutes.",
    my: "ကျပ် ၁၀ သိန်း ပေါက်ပြီ! လင့်ခ် နှိပ်ပြီး ၁၀ မိနစ်အတွင်း PIN ရိုက်ထည့်ပါ။" },
  { isScam: false, fromEn: "Wave Money", fromMy: "Wave Money",
    en: "You received 25,000 MMK from Ma Thiri. Open the app to see it.",
    my: "မသီရိ ဆီက ကျပ် ၂၅,၀၀၀ ရရှိပါတယ်။ App ထဲမှာ ဝင်ကြည့်ပါ။" },
  { isScam: true, fromEn: "Facebook Security", fromMy: "Facebook Security",
    en: "Your account is locked. Log in again at faceb00k-help-login.com now.",
    my: "သင့် အကောင့် လော့ခ် ကျသွားပြီ။ faceb00k-help-login.com မှာ အခု ပြန်ဝင်ပါ။" },
  { isScam: false, fromEn: "School Office", fromMy: "ကျောင်း ရုံးခန်း",
    en: "Exam results are posted on the school notice board tomorrow morning.",
    my: "စာမေးပွဲ အဖြေတွေကို မနက်ဖြန် မနက် ကျောင်း သင်ပုန်းမှာ ကပ်ပါမယ်။" },
  { isScam: true, fromEn: "Delivery Express", fromMy: "Delivery Express",
    en: "Your parcel is stuck. Pay a 2,000 MMK release fee at this link.",
    my: "သင့် ပါဆယ် ရပ်နေတယ်။ လင့်ခ်ကနေ ကျပ် ၂,၀၀၀ လွှတ်ခ ပေးပါ။" },
  { isScam: false, fromEn: "MPT", fromMy: "MPT",
    en: "Your data pack renews tomorrow. Dial *106# to check your balance.",
    my: "သင့် data pack မနက်ဖြန် သက်တမ်းတိုးပါမယ်။ လက်ကျန် စစ်ဖို့ *106# နှိပ်ပါ။" },
  { isScam: true, fromEn: "HR Jobs Myanmar", fromMy: "HR Jobs Myanmar",
    en: "Work from home, 80,000 MMK a day. Send 15,000 MMK to activate your job.",
    my: "အိမ်ကနေ အလုပ်လုပ်ရုံနဲ့ တစ်ရက် ကျပ် ၈၀,၀၀၀ရနိုင်ပြီ။ အလုပ် စဖို့ အခုပဲ ကျပ် ၁၅,၀၀၀ ပို့ပါ။" },
  { isScam: true, fromEn: "Bank Alert", fromMy: "Bank Alert",
    en: "Suspicious login! Share the 6 digit code we sent you to stop it.",
    my: "သံသယဖြစ်ဖွယ် login တွေ့တယ်! ပို့ထားတဲ့ ဂဏန်း ၆ လုံး ကုဒ်ကို ပို့ပေးပါ။" },
  { isScam: false, fromEn: "GetStuffHere", fromMy: "GetStuffHere",
    en: "Your order #9031 is out for delivery. The rider will call you.",
    my: "သင့် အော်ဒါ #9031 ပို့နေပါပြီ။ Rider က ဖုန်းဆက်ပါမယ်။" },
  { isScam: true, fromEn: "Lottery Office", fromMy: "ထီ ရုံးခန်း",
    en: "Your ticket won! Send your bank password so we can transfer the prize.",
    my: "သင့် ထီ ပေါက်ပြီ! ဆုငွေ လွှဲဖို့ ဘဏ် password ပို့ပေးပါ။" },
  { isScam: false, fromEn: "Teacher Daw Khin", fromMy: "ဆရာမ ဒေါ်ခင်",
    en: "Class is cancelled tomorrow because of the rain. Stay safe at home.",
    my: "မိုးကြောင့် မနက်ဖြန် အတန်း ပိတ်ပါတယ်။ အိမ်မှာ လုံခြုံစွာ နေပါ။" },
  { isScam: true, fromEn: "Crypto Invest", fromMy: "Crypto Invest",
    en: "Double your money in 7 days. Guaranteed. Send Wave or KBZPay now.",
    my: "၇ ရက်အတွင်း ငွေ နှစ်ဆ ဖြစ်စေရမယ် လို့အာမခံတယ်။ Wave ဒါမှမဟုတ် KBZPay နဲ့ အခု ပို့ပါ။" },
  { isScam: false, fromEn: "KBZ Bank", fromMy: "KBZ Bank",
    en: "Your statement for this month is ready inside the KBZPay app.",
    my: "ဒီလအတွက် statement ကို KBZPay app ထဲမှာ ကြည့်နိုင်ပါပြီ။" },
  { isScam: true, fromEn: "Instagram Verify", fromMy: "Instagram Verify",
    en: "Get your blue tick today. Just confirm your password on this page.",
    my: "ဒီနေ့ပဲ blue tick ရမယ်။ ဒီစာမျက်နှာမှာ password အတည်ပြုရုံပဲ။" },
  { isScam: false, fromEn: "Library", fromMy: "စာကြည့်တိုက်",
    en: "The book you borrowed is due on Friday. Renew it at the front desk.",
    my: "ငှားထားတဲ့ စာအုပ် သောကြာနေ့ ပြန်အပ်ရမယ်။ ရှေ့ကောင်တာမှာ သက်တမ်းတိုးနိုင်တယ်။" },
  { isScam: true, fromEn: "Phone Winner", fromMy: "Phone Winner",
    en: "You are our 1000th visitor! A free phone is waiting. Click to claim.",
    my: "သင်က အယောက် ၁၀၀၀ မြောက် လာကြည့်သူပါ! အခမဲ့ဖုန်းဆုက စောင့်နေတယ်။ နှိပ်ပြီး ယူပါ။" },
  { isScam: false, fromEn: "Mytel", fromMy: "Mytel",
    en: "You used 80 percent of your data. Top up any time in the app.",
    my: "Data ၈၀ ရာခိုင်နှုန်း သုံးပြီးပြီ။ App ထဲမှာ ကြိုက်တဲ့ အချိန် ဖြည့်နိုင်တယ်။" },
  { isScam: true, fromEn: "Senior Student", fromMy: "စီနီယာ ကျောင်းသား",
    en: "Send me your student portal login and I will fix your marks for you.",
    my: "Student portal login ပို့ပေးပါ၊ အမှတ်တွေ ပြင်ပေးမယ်။" },
  { isScam: false, fromEn: "Clinic", fromMy: "ဆေးခန်း",
    en: "Reminder: your appointment is on Monday at 9 AM. Reply C to confirm.",
    my: "သတိပေးချက်: သင့် ရက်ချိန်းက တနင်္လာနေ့ မနက် ၉ နာရီပါ။ အတည်ပြုဖို့ C လို့ ပြန်ပို့ပါ။" },
  { isScam: true, fromEn: "SIM Update", fromMy: "SIM Update",
    en: "Your SIM will stop working tonight. Re-register with your NRC photo here.",
    my: "ဒီည သင့် SIM ရပ်သွားမယ်။ မှတ်ပုံတင် ဓာတ်ပုံနဲ့ ဒီမှာ ပြန်မှတ်ပုံတင်ပါ။" },
];

/* ================= Link Detective ================= */
export interface LinkRound {
  themeEn: string; themeMy: string;
  options: string[]; real: number;
  lessonEn: string; lessonMy: string;
}
export const LINK_ROUNDS: LinkRound[] = [
  { themeEn: "Your bank app link", themeMy: "ဘဏ် app လင့်ခ်",
    options: ["kbzpay.com", "kbz-pay-login.com", "kbzpay.secure-verify.net", "kbzpayy.com"], real: 0,
    lessonEn: "The real domain is short and exact: kbzpay.com. Extra words like login or secure-verify mean a different owner.",
    lessonMy: "Domain အစစ်က တိုပြီး တိကျတယ်: kbzpay.com ။ login၊ secure-verify လို စကားလုံး ထပ်ပါရင် ပိုင်ရှင် မတူတော့ဘူး။" },
  { themeEn: "Facebook login", themeMy: "Facebook login",
    options: ["facebook-login-help.com", "facebook.com", "faceb00k.com", "facebook.verify-account.org"], real: 1,
    lessonEn: "facebook.com is the only real one. Zeros instead of the letter o, and domains that end in another site, are fakes.",
    lessonMy: "facebook.com တစ်ခုပဲ အစစ်။ o အစား သုည သုံးတာနဲ့ တခြား site အဆုံးသတ် domain တွေက အတုပဲ။" },
  { themeEn: "Wave Money", themeMy: "Wave Money",
    options: ["wavemoney.com.mm.evil.com", "wave-money-mm.com", "wavemoney.com.mm", "wavemoney-login.com"], real: 2,
    lessonEn: "Read from the right: wavemoney.com.mm is real. When the address ends in evil.com, the whole link belongs to evil.com.",
    lessonMy: "ညာဘက်ကနေ ဖတ်ပါ: wavemoney.com.mm က အစစ်။ evil.com နဲ့ ဆုံးရင် လင့်ခ် တစ်ခုလုံးက evil.com ရဲ့ ပိုင်ဆိုင်မှုပဲ။" },
  { themeEn: "A food delivery app", themeMy: "အစားအသောက် ပို့တဲ့ app",
    options: ["foodpanda-delivery-free.com", "foodpanda.com.mm", "foodpandaa.com", "foodpanda.login-page.net"], real: 1,
    lessonEn: "One extra letter (foodpandaa) changes the owner completely. Type the address yourself instead of tapping ad links.",
    lessonMy: "စာလုံး တစ်လုံး ပိုတာ (foodpandaa) နဲ့ ပိုင်ရှင် လုံးဝ ပြောင်းသွားတယ်။ ကြော်ငြာ လင့်ခ် မနှိပ်ဘဲ လိပ်စာကို ကိုယ်တိုင် ရိုက်ထည့်ပါ။" },
  { themeEn: "YouTube", themeMy: "YouTube",
    options: ["youtu.be.evil-site.com", "youtube.com", "y0utube.com", "youtube-premium-free.net"], real: 1,
    lessonEn: "youtube.com is real. A zero in y0utube, or youtube inside another domain, is a trap.",
    lessonMy: "youtube.com က အစစ်။ y0utube မှာ သုည ပါတာနဲ့ တခြား domain ထဲမှာ youtube ပါတာက ထောင်ချောက်ပဲ။" },
  { themeEn: "Your school portal", themeMy: "ကျောင်း portal",
    options: ["ucs-magway-portal.com", "ucsmagway.edu.mm", "ucs-magway.login-verify.com", "ucsmagway-edu.com"], real: 1,
    lessonEn: "Schools use their official .edu.mm domain. A similar name with login-verify in it is a copy.",
    lessonMy: "ကျောင်းတွေက တရားဝင် .edu.mm domain သုံးတယ်။ login-verify ပါတဲ့ ပုံစံတူ နာမည်က အတုပဲ။" },
  { themeEn: "Telegram", themeMy: "Telegram",
    options: ["telegram-free-premium.com", "te1egram.org", "telegram.org", "telegram.web-login.net"], real: 2,
    lessonEn: "telegram.org is the real home. te1egram swaps the letter l for the number 1, an easy miss at a glance.",
    lessonMy: "telegram.org က အစစ်။ te1egram က l အစား ဂဏန်း 1 သုံးထားတာ၊ တစ်ချက် ကြည့်ရုံနဲ့ လွဲတတ်တယ်။" },
  { themeEn: "An online shop", themeMy: "အွန်လိုင်း ဆိုင်",
    options: ["shop.com.mm.deals-here.com", "shop.com.mm", "sh0p.com.mm", "shop-mm-official.com"], real: 1,
    lessonEn: "shop.com.mm is the shop. When deals-here.com comes last, you are on deals-here.com, not the shop.",
    lessonMy: "shop.com.mm က ဆိုင်အစစ်။ deals-here.com နောက်ဆုံးမှာ ပါရင် ရောက်နေတာက deals-here.com ပဲ၊ ဆိုင် မဟုတ်ဘူး။" },
];

/* ================= Privacy Lockdown ================= */
export interface PrivacySetting {
  nameEn: string; nameMy: string; risky: boolean;
  stateEn: string; stateMy: string;
  fixEn: string; fixMy: string; lessonEn: string; lessonMy: string;
}
export const PRIVACY_SETTINGS: PrivacySetting[] = [
  { nameEn: "Profile visibility", nameMy: "Profile မြင်နိုင်မှု", risky: true,
    stateEn: "Public, everyone can see", stateMy: "Public, လူတိုင်း မြင်နိုင်တယ်",
    fixEn: "Friends only", fixMy: "သူငယ်ချင်းသီးသန့်",
    lessonEn: "A public profile lets strangers study your life and copy your identity.",
    lessonMy: "Profile ကို public ထားရင် မသိတဲ့လူတွေက သင့် အကြောင်း လေ့လာပြီး အတု လုပ်နိုင်တယ်။" },
  { nameEn: "Location sharing", nameMy: "တည်နေရာ မျှဝေမှု", risky: true,
    stateEn: "Always on", stateMy: "အမြဲ ဖွင့်ထားတယ်",
    fixEn: "Off", fixMy: "ပိတ်ထားမယ်",
    lessonEn: "Always-on location tells strangers where you live and when you are away.",
    lessonMy: "တည်နေရာ အမြဲ ဖွင့်ထားရင် ဘယ်မှာ နေတယ်၊ ဘယ်အချိန် အိမ်မှာ မရှိဘူး ဆိုတာ သူများ သိနိုင်တယ်။" },
  { nameEn: "Phone number visibility", nameMy: "ဖုန်းနံပါတ် မြင်နိုင်မှု", risky: true,
    stateEn: "Shown on profile", stateMy: "Profile မှာ ပြထားတယ်",
    fixEn: "Only me", fixMy: "ကိုယ်ပဲ မြင်ရမယ်",
    lessonEn: "A public phone number invites scam calls and SIM swap attempts.",
    lessonMy: "ဖုန်းနံပါတ် public ဖြစ်နေရင် လိမ်ဖုန်းတွေနဲ့ SIM လဲတဲ့ ကြိုးစားမှုတွေ ဝင်လာတတ်တယ်။" },
  { nameEn: "Photo location tags", nameMy: "ဓာတ်ပုံ တည်နေရာ tag", risky: true,
    stateEn: "On, tags every photo", stateMy: "ဖွင့်ထားတယ်၊ ဓာတ်ပုံတိုင်း tag ပါတယ်",
    fixEn: "Off", fixMy: "ပိတ်ထားမယ်",
    lessonEn: "Location tags in photos reveal your home and school without you noticing.",
    lessonMy: "ဓာတ်ပုံထဲက တည်နေရာ tag က သင့် အိမ်နဲ့ ကျောင်းကို သတိမထားမိဘဲ ဖော်ပြပေးတယ်။" },
  { nameEn: "App installs from unknown sources", nameMy: "မသိတဲ့ နေရာက app သွင်းခွင့်", risky: true,
    stateEn: "Allowed", stateMy: "ခွင့်ပြုထားတယ်",
    fixEn: "Blocked", fixMy: "ပိတ်ထားမယ်",
    lessonEn: "Apps from random links can carry spyware. The official store checks apps first.",
    lessonMy: "လင့်ခ် အစုံက app တွေမှာ spyware ပါနိုင်တယ်။ တရားဝင် store က app တွေကို အရင် စစ်ပြီးသားပါ။" },
  { nameEn: "Screen lock", nameMy: "Screen lock", risky: false,
    stateEn: "On, fingerprint", stateMy: "ဖွင့်ထားတယ်၊ လက်ဗွေနဲ့",
    fixEn: "On, fingerprint", fixMy: "ဖွင့်ထားတယ်၊ လက်ဗွေနဲ့",
    lessonEn: "Good: a screen lock is the first wall around everything on the phone.",
    lessonMy: "ကောင်းတယ်: screen lock က ဖုန်းထဲက အရာအားလုံးအတွက် ပထမဆုံး အကာအကွယ်ပဲ။" },
  { nameEn: "Two-factor authentication (2FA)", nameMy: "Two-factor authentication (2FA)", risky: false,
    stateEn: "On for main account", stateMy: "အဓိက အကောင့်မှာ ဖွင့်ထားတယ်",
    fixEn: "On for main account", fixMy: "အဓိက အကောင့်မှာ ဖွင့်ထားတယ်",
    lessonEn: "Good: with 2FA, a stolen password alone cannot open your account.",
    lessonMy: "ကောင်းတယ်: 2FA ရှိရင် password ခိုးခံရရုံနဲ့ အကောင့် ဖွင့်လို့ မရဘူး။" },
  { nameEn: "Auto backup", nameMy: "Auto backup", risky: false,
    stateEn: "On, weekly", stateMy: "ဖွင့်ထားတယ်၊ တစ်ပတ် တစ်ခါ",
    fixEn: "On, weekly", fixMy: "ဖွင့်ထားတယ်၊ တစ်ပတ် တစ်ခါ",
    lessonEn: "Good: backups mean a lost phone is an annoyance, not a disaster.",
    lessonMy: "ကောင်းတယ်: backup ရှိရင် ဖုန်း ပျောက်တာ ပြဿနားအကြီးစားကြီး မဟုတ်တော့ဘူး။" },
];

/* ================= Permission Panic ================= */
export interface PermCard {
  appEn: string; appMy: string; permEn: string; permMy: string;
  allow: boolean; whyEn: string; whyMy: string;
}
export const PERMISSION_CARDS: PermCard[] = [
  { appEn: "Flashlight app", appMy: "မီးအိမ် app", permEn: "Your contacts", permMy: "သင့် contacts",
    allow: false, whyEn: "A flashlight needs light, not your friends' phone numbers.", whyMy: "မီးအိမ်က အလင်းပဲ လိုတယ်၊ သူငယ်ချင်းတွေရဲ့ ဖုန်းနံပါတ် မလိုဘူး။" },
  { appEn: "Map app", appMy: "မြေပုံ app", permEn: "Your location", permMy: "သင့် တည်နေရာ",
    allow: true, whyEn: "A map cannot guide you without knowing where you are.", whyMy: "မြေပုံက သင် ဘယ်မှာလဲ မသိရင် လမ်းမပြနိုင်ဘူး။" },
  { appEn: "Photo editor", appMy: "ဓာတ်ပုံ ပြင် app", permEn: "Your photos", permMy: "သင့် ဓာတ်ပုံတွေ",
    allow: true, whyEn: "It needs photos to edit them. Pick 'selected photos' if offered.", whyMy: "ပြင်ဖို့ ဓာတ်ပုံ လိုတယ်။ ရွေးချယ်ခွင့် ပေးရင် ကိုယ် ပြင်ချင်တဲ့ ပုံပဲ ပေးပါ။" },
  { appEn: "Puzzle game", appMy: "Puzzle ဂိမ်း", permEn: "Your microphone", permMy: "သင့် microphone",
    allow: false, whyEn: "A puzzle game has no reason to listen to you.", whyMy: "Puzzle ဂိမ်းက သင့် အသံ နားထောင်စရာ အကြောင်း မရှိဘူး။" },
  { appEn: "Chat app", appMy: "Chat app", permEn: "Camera for video calls", permMy: "Video call အတွက် camera",
    allow: true, whyEn: "Video calls need the camera. Deny it and calls become voice only.", whyMy: "Video call အတွက် camera လိုတယ်။ ငြင်းရင် အသံပဲ ရမယ်။" },
  { appEn: "Wallpaper app", appMy: "Wallpaper app", permEn: "Your location, always", permMy: "သင့် တည်နေရာ၊ အမြဲတမ်း",
    allow: false, whyEn: "Wallpapers do not move. It never needs to follow you around.", whyMy: "Wallpaper က မရွေ့ဘူး။ သင့်နောက် လိုက်နေစရာ မလိုဘူး။" },
  { appEn: "Voice recorder", appMy: "အသံဖမ်း app", permEn: "Your microphone", permMy: "သင့် microphone",
    allow: true, whyEn: "Recording is its whole job, so the microphone makes sense.", whyMy: "အသံဖမ်းတာက သူ့ အလုပ်ပဲ၊ microphone လိုတာ သဘာဝ ကျတယ်။" },
  { appEn: "Horoscope app", appMy: "ဗေဒင် app", permEn: "Your SMS messages", permMy: "သင့် SMS တွေ",
    allow: false, whyEn: "Your stars do not hide in your text messages. Deny.", whyMy: "ကြယ်တွေက သင့် SMS ထဲမှာ မရှိဘူး။ ငြင်းပါ။" },
  { appEn: "Food delivery app", appMy: "အစားအသောက် ပို့ app", permEn: "Your location while using", permMy: "သုံးနေတုန်း တည်နေရာ",
    allow: true, whyEn: "'While using' location helps the rider find you, and stops when you close it.", whyMy: "သုံးနေတုန်း တည်နေရာက rider ရှာရ လွယ်စေပြီး app ပိတ်ရင် ရပ်သွားတယ်။" },
  { appEn: "Battery saver app", appMy: "Battery ချွေတာ့ app", permEn: "Read all your notifications", permMy: "Notification အကုန် ဖတ်ခွင့်",
    allow: false, whyEn: "Notifications carry OTP codes and private chats. No saver needs them.", whyMy: "Notification ထဲမှာ OTP နဲ့ private chat တွေ ပါတယ်။ ချွေတာ့ app က မလိုဘူး။" },
  { appEn: "QR scanner", appMy: "QR scanner", permEn: "Camera to scan codes", permMy: "ကုဒ် ဖတ်ဖို့ camera",
    allow: true, whyEn: "Scanning is pointing the camera at a code. That is the feature itself.", whyMy: "Scan ဆိုတာ camera နဲ့ ကုဒ်ကို ချိန်တာပဲ။ အဲ့ဒါ သူ့ feature ကိုယ်တိုင်ပဲ။" },
  { appEn: "Music player", appMy: "သီချင်း app", permEn: "Your precise location, always", permMy: "သင့် တည်နေရာ အတိအကျ၊ အမြဲတမ်း",
    allow: false, whyEn: "Songs play the same everywhere. Precise always-on location is pure data collection.", whyMy: "သီချင်းက ဘယ်မှာဖြစ်ဖြစ် အတူတူပဲ။ တည်နေရာ အမြဲ ယူနေတာက data စုရုံသက်သက်ပဲ။" },
  { appEn: "Banking app", appMy: "ဘဏ် app", permEn: "Camera to scan a cheque", permMy: "Cheque scan ဖို့ camera",
    allow: true, whyEn: "Cheque scanning is a real banking feature, inside the official app.", whyMy: "Cheque scan က ဘဏ် feature အစစ်ပဲ၊ တရားဝင် app ထဲမှာပဲ သုံးပါ။" },
  { appEn: "Free VPN app", appMy: "အခမဲ့ VPN app", permEn: "See all network traffic", permMy: "Network traffic အကုန် ကြည့်ခွင့်",
    allow: false, whyEn: "A random free VPN seeing everything is worse than no VPN at all.", whyMy: "အခမဲ့ VPN အစုံက အကုန် ကြည့်ခွင့် ရရင် VPN မသုံးတာထက် ပိုဆိုးတယ်။" },
  { appEn: "Study timer app", appMy: "စာကျက် timer app", permEn: "Your contacts", permMy: "သင့် contacts",
    allow: false, whyEn: "A timer counts minutes. It does not need your address book.", whyMy: "Timer က မိနစ် ရေတာပဲ။ လိပ်စာစာအုပ် မလိုဘူး။" },
  { appEn: "Weather app", appMy: "မိုးလေဝသ app", permEn: "Your city-level location", permMy: "သင့် မြို့ အဆင့် တည်နေရာ",
    allow: true, whyEn: "City-level location gives local weather without tracking your every step.", whyMy: "မြို့ အဆင့် တည်နေရာနဲ့ ဒေသ မိုးလေဝသ ရပြီး ခြေလှမ်းတိုင်း လိုက်မကြည့်ဘူး။" },
];

/* ================= Spot the Fake ================= */
export interface SpotField {
  labelEn: string; labelMy: string; real: string; fake: string;
  tellEn: string; tellMy: string;
}
export interface SpotPair {
  kindEn: string; kindMy: string; fakeSide: "left" | "right";
  fields: SpotField[];
}
export const SPOT_PAIRS: SpotPair[] = [
  {
    kindEn: "App store page: KBZPay", kindMy: "App store စာမျက်နှာ: KBZPay", fakeSide: "right",
    fields: [
      { labelEn: "Developer", labelMy: "Developer", real: "KBZ Bank", fake: "KBZ Pay Official Ltd",
        tellEn: "The real developer is the bank itself, short and exact.", tellMy: "Developer အစစ်က ဘဏ် ကိုယ်တိုင်ပဲ၊ တိုပြီး အတိအကျ ဖြစ်တယ်။" },
      { labelEn: "Downloads", labelMy: "Downloads", real: "10M+", fake: "5K+",
        tellEn: "A famous banking app has millions of downloads, not a few thousand.", tellMy: "နာမည်ကြီး ဘဏ် app က download သန်းချီ ရှိတယ်၊ ထောင်ဂဏန်းပဲ မဟုတ်ဘူး။" },
      { labelEn: "Contact email", labelMy: "ဆက်သွယ် email", real: "support@kbzbank.com", fake: "kbzpay.help@gmail.com",
        tellEn: "Real companies use their own domain, not a free Gmail address.", tellMy: "ကုမ္ပဏီ အစစ်က ကိုယ့် domain ပဲ သုံးတယ်၊ အခမဲ့ Gmail မသုံးဘူး။" },
    ],
  },
  {
    kindEn: "Social profile: a famous singer", kindMy: "Social profile: နာမည်ကြီး အဆိုတော်", fakeSide: "left",
    fields: [
      { labelEn: "Username", labelMy: "Username", real: "@maylathanzin", fake: "@maylathanzin_official01",
        tellEn: "Copies add words like official and numbers to a lookalike name.", tellMy: "အတုတွေက official နဲ့ ဂဏန်းတွေ ထပ်ထည့်ပြီး ပုံစံတူ လုပ်တယ်။" },
      { labelEn: "Verified tick", labelMy: "Verified tick", real: "Blue tick shown", fake: "Tick only in the photo",
        tellEn: "A real tick sits beside the name in the app, not baked into a profile photo.", tellMy: "Tick အစစ်က app ထဲမှာ နာမည်နား ရှိတယ်၊ profile ပုံထဲ ထည့်ထားတာ မဟုတ်ဘူး။" },
      { labelEn: "First post", labelMy: "ပထမဆုံး post", real: "Posted 6 years ago", fake: "Posted 3 days ago",
        tellEn: "A star account is years old. A 3 day old copy asking for 'prizes' is a trap.", tellMy: "နာမည်ကြီး အကောင့်က နှစ်ချီ ကြာပြီ။ ၃ ရက်သား အတုက ဆု အကြောင်းပြပြီး လိမ်တယ်။" },
    ],
  },
  {
    kindEn: "Shop page: phone store", kindMy: "ဆိုင် စာမျက်နှာ: ဖုန်း ဆိုင်", fakeSide: "right",
    fields: [
      { labelEn: "Page age", labelMy: "Page သက်တမ်း", real: "Created 2019", fake: "Created last week",
        tellEn: "Trusted shops have history. Brand new pages selling cheap phones are risky.", tellMy: "ယုံကြည်ရတဲ့ ဆိုင်မှာ သမိုင်း ရှိတယ်။ တစ်ပတ်သား page က ဖုန်း စျေးချိုချို ရောင်းရင် သတိထားပါ။" },
      { labelEn: "Payment", labelMy: "ငွေပေးချေမှု", real: "Cash on delivery, or bank transfer to the shop name", fake: "Personal Wave account only, pay in full first",
        tellEn: "Real shops offer cash on delivery. 'Full payment first to a personal account' is the classic trap.", tellMy: "ဆိုင် အစစ်က ပစ္စည်းရောက် ငွေချေ ရတယ်။ ကိုယ်ပိုင် အကောင့်ကို အပြည့် အရင် လွှဲခိုင်းတာက ထောင်ချောက် အကြီးစားပဲ။" },
      { labelEn: "Address", labelMy: "လိပ်စာ", real: "Shop address and phone on the page", fake: "No address, 'DM only'",
        tellEn: "A real shop shows where it is. No address and DM only means nowhere to complain.", tellMy: "ဆိုင် အစစ်က လိပ်စာ ပြတယ်။ လိပ်စာ မရှိ၊ DM ပဲ ဆိုရင် တိုင်စရာ နေရာ မရှိဘူး။" },
    ],
  },
  {
    kindEn: "App store page: photo editor", kindMy: "App store စာမျက်နှာ: ဓာတ်ပုံ ပြင် app", fakeSide: "left",
    fields: [
      { labelEn: "App size", labelMy: "App အရွယ်", real: "48 MB", fake: "3 MB",
        tellEn: "A full editor is tens of MB. A 3 MB copy is usually a wrapper hiding something else.", tellMy: "Editor အပြည့်က MB ဆယ်ချီ ရှိတယ်။ 3 MB အတုက တခြားဟာ ဖုံးထားတာ များတယ်။" },
      { labelEn: "Reviews", labelMy: "Reviews", real: "Mixed reviews, some complaints", fake: "All 5 stars, same words repeated",
        tellEn: "Real apps have mixed reviews. Rows of identical 5 star praise are bought or faked.", tellMy: "App အစစ်မှာ review အစုံ ရှိတယ်။ စကားလုံး တူတူ 5 star ချည်းပဲ ဆိုရင် ဝယ်ထားတာ ဒါမှမဟုတ် အတုပဲ။" },
      { labelEn: "Permissions", labelMy: "Permissions", real: "Photos and storage", fake: "Photos, SMS, contacts and calls",
        tellEn: "An editor needs photos, not your SMS and call log. Extra permissions are the tell.", tellMy: "Editor က ဓာတ်ပုံပဲ လိုတယ်၊ SMS နဲ့ call log မလိုဘူး။ ပိုနေတဲ့ permission က လက္ခဏာပဲ။" },
    ],
  },
];

/* ================= Deepfake Detective ================= */
export interface DeepfakeCase {
  kindEn: string; kindMy: string;
  titleEn: string; titleMy: string;
  descEn: string; descMy: string;
  isFake: boolean;
  tells: { en: string; my: string }[];
}
export const DEEPFAKE_CASES: DeepfakeCase[] = [
  { kindEn: "Video", kindMy: "ဗီဒီယို",
    titleEn: "A celebrity selling a money app", titleMy: "နာမည်ကြီး တစ်ယောက် ငွေ app ကြော်ငြာနေတာ",
    descEn: "A famous actor smiles at the camera and says: 'I doubled my money with this app, join now.' His lips move a little late after the words.",
    descMy: "နာမည်ကြီး သရုပ်ဆောင် တစ်ယောက် camera ကို ပြုံးပြီး ပြောတယ်: 'ဒီ app နဲ့ ငွေ နှစ်ဆ ဖြစ်သွားပြီ၊ အခု ဝင်ပါ။' သူ့ နှုတ်ခမ်းက စကားထက် နည်းနည်း နောက်ကျပြီး ရွေ့နေတယ်။",
    isFake: true,
    tells: [
      { en: "Lip sync slips: the mouth lags behind the voice.", my: "နှုတ်ခမ်း လှုပ်တာ အသံနဲ့ မကိုက်၊ နောက်ကျနေတယ်။" },
      { en: "A celebrity pushing a money app in an ad is a classic deepfake scam pattern.", my: "နာမည်ကြီးက ငွေ app ကြော်ငြာတာက deepfake လိမ်နည်း ပုံစံ အတိအကျပဲ။" },
    ] },
  { kindEn: "Voice note", kindMy: "အသံ မှတ်စု",
    titleEn: "Your 'brother' asking for money", titleMy: "'အစ်ကို' က ငွေ တောင်းတဲ့ အသံ",
    descEn: "A voice note that sounds like your brother: 'I lost my wallet, send 50,000 MMK to this number, quick.' The breathing sounds flat and every word is the same volume.",
    descMy: "အစ်ကို့အသံနဲ့ တူတဲ့ voice note: 'ပိုက်ဆံအိတ် ပျောက်သွားပြီ၊ ဒီနံပါတ်ကို ကျပ် ၅၀,၀၀၀ မြန်မြန် ပို့ပေး။' အသက်ရှူသံက ပြားနေပြီး စကားလုံးတိုင်း အသံ အတိုင်းအတာ တူနေတယ်။",
    isFake: true,
    tells: [
      { en: "Cloned voices sound flat: no natural breathing or volume changes.", my: "အသံ အတုက ပြားတယ်: သဘာဝ အသက်ရှူသံနဲ့ အနိမ့်အမြင့် ပြောင်းလဲမှု မရှိဘူး။" },
      { en: "Urgent money to a new number is the scam, whatever the voice sounds like. Call back on the number you know.", my: "နံပါတ် အသစ်ကို အရေးတကြီး ငွေ ပို့ခိုင်းတာက အသံ ဘယ်လောက် တူတူ လိမ်တာပဲ။ သိတဲ့ နံပါတ်ကို ပြန်ဆက်ပြီး စစ်ပါ။" },
    ] },
  { kindEn: "Photo", kindMy: "ဓာတ်ပုံ",
    titleEn: "A flood rescue photo going viral", titleMy: "ရေကြီး ကယ်ဆယ်မှု ဓာတ်ပုံ ပျံ့နေတာ",
    descEn: "A dramatic photo of soldiers rescuing children from flood water. Look closely: one rescuer has six fingers, and the boat's name is written in letters that are not any language.",
    descMy: "ရေကြီးထဲက ကလေးတွေကို ကယ်နေတဲ့ စိတ်လှုပ်ရှားဖွယ် ဓာတ်ပုံ။ သေချာ ကြည့်ရင် ကယ်သူ တစ်ယောက်မှာ လက်ချောင်း ၆ ချောင်း ပါနေပြီး လှေ နာမည်က ဘယ်ဘာသာနဲ့မှ မဟုတ်တဲ့ စာလုံးတွေ ဖြစ်နေတယ်။",
    isFake: true,
    tells: [
      { en: "AI images still stumble on hands: count the fingers.", my: "AI ပုံတွေက လက်မှာ အခုထိ လွဲတတ်တယ်: လက်ချောင်း ရေကြည့်ပါ။" },
      { en: "Gibberish text on signs and labels is a strong AI tell.", my: "ဆိုင်းဘုတ်နဲ့ စာတွေမှာ အဓိပ္ပာယ် မရှိတဲ့ စာလုံးတွေ ပါရင် AI လက္ခဏာ ခိုင်တယ်။" },
    ] },
  { kindEn: "Video", kindMy: "ဗီဒီယို",
    titleEn: "Your teacher's exam announcement", titleMy: "ဆရာမရဲ့ စာမေးပွဲ ကြေညာချက် ဗီဒီယို",
    descEn: "Your teacher posts a video on the school's official page saying tomorrow's exam moves to next week. Her voice, face and the classroom behind her all look natural, and the school page confirms it in a comment.",
    descMy: "ဆရာမက ကျောင်း တရားဝင် page မှာ ဗီဒီယို တင်တယ်၊ မနက်ဖြန် စာမေးပွဲ နောက်အပတ် ရွေ့တယ်တဲ့။ အသံ၊ မျက်နှာ၊ နောက်က အတန်းခန်း အကုန် သဘာဝ ကျပြီး ကျောင်း page ကလည်း comment မှာ အတည်ပြုထားတယ်။",
    isFake: false,
    tells: [
      { en: "It is on the official page, and the page itself confirms it. Source matters more than pixels.", my: "တရားဝင် page မှာ တင်ထားပြီး page ကိုယ်တိုင်က အတည်ပြုထားတယ်။ ပုံထက် အရင်းအမြစ်က ပို အရေးကြီးတယ်။" },
      { en: "Nothing here shows the classic tells: sync is clean and details are consistent.", my: "လက္ခဏာ အဟောင်းတွေ တစ်ခုမှ မတွေ့ဘူး: နှုတ်ခမ်း ကိုက်ပြီး အသေးစိတ် တွေ ညီနေတယ်။" },
    ] },
  { kindEn: "Photo", kindMy: "ဓာတ်ပုံ",
    titleEn: "A 'new species' animal photo", titleMy: "'မျိုးစိတ်သစ်' တိရစ္ဆာန် ဓာတ်ပုံ",
    descEn: "A glowing blue frog sitting on a leaf, shared thousands of times. Its skin looks waxy like plastic, and its shadow falls the opposite way from the leaf's shadow.",
    descMy: "အရွက်ပေါ်မှာ ထိုင်နေတဲ့ အပြာရောင် တောက်နေတဲ့ ဖား တစ်ကောင်၊ အကြိမ်ရေ ထောင်ချီ မျှဝေခံထားရတယ်။ သူ့ အရေပြားက ပလတ်စတစ် လို ချောနေပြီး အရိပ်က အရွက်ရဲ့ အရိပ်နဲ့ ဆန့်ကျင်ဘက် ကျနေတယ်။",
    isFake: true,
    tells: [
      { en: "Waxy, plastic looking skin is a common AI texture problem.", my: "ဖယောင်း လို၊ ပလတ်စတစ် လို ချောနေတဲ့ အရေပြားက AI ရဲ့ ပြဿနာ အဖြစ်များတယ်။" },
      { en: "Shadows must agree with each other. Two light directions means the scene was generated, not photographed.", my: "အရိပ်တွေ အချင်းချင်း ညီရမယ်။ အလင်း နှစ်ဘက် လာရင် ဒါ ရိုက်ထားတာ မဟုတ်၊ ထုတ်လုပ်ထားတာပဲ။" },
    ] },
  { kindEn: "Screenshot", kindMy: "Screenshot",
    titleEn: "A bank transfer receipt", titleMy: "ဘဏ် ငွေလွှဲ လက်ခံ",
    descEn: "A buyer sends you a screenshot: 'Paid 300,000 MMK' with your name on it. But the font of the amount is slightly different from the rest, and your banking app shows no money arrived.",
    descMy: "ဝယ်သူက screenshot ပို့တယ်: 'ကျပ် ၃၀၀,၀၀၀ ပေးပြီးပြီ' သင့် နာမည် ပါတယ်။ ဒါပေမယ့် ပမာဏရဲ့ font က ကျန်တာနဲ့ နည်းနည်း ကွဲနေပြီး သင့် ဘဏ် app မှာ ငွေ ဝင်တာ မပြဘူး။",
    isFake: true,
    tells: [
      { en: "Edited receipts often mix fonts. Compare the amount's font with the rest.", my: "ပြင်ထားတဲ့ လက်ခံတွေမှာ font ရောတတ်တယ်။ ပမာဏ font ကို ကျန်တာနဲ့ ယှဉ်ကြည့်ပါ။" },
      { en: "The only proof of payment is money inside your own app, never a picture someone sends.", my: "ငွေ ပေးချေမှုရဲ့ သက်သေက သင့် app ထဲ ငွေ ဝင်တာပဲ၊ သူများ ပို့တဲ့ ပုံ မဟုတ်ဘူး။" },
    ] },
];
