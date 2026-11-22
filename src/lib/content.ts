/* CyberShield Arena content + demo brain.
   Ported faithfully from the single-file demo (index.html).
   All AI answers still flow through the single Api.call() stub below;
   to go live later, replace only the body of Api.call(). */

export type Lang = "en" | "my";

/* ---------- i18n ---------- */
export const T: Record<Lang, Record<string, string>> = {
  en: { students:"Students", usage:"Demo calls", tokens:"Est. tokens",
    home:"Home", scam:"Scam or Safe", vault:"Hack the Bot", roast:"Password Roast",
    ask:"Ask the Hacker", quiz:"Finale Quiz", records:"Records",
    homeSub:"Tap any section to jump straight to it. Nothing is locked in order. Every score, answer and record is saved on this device, even after a reload.",
    scamSub:"Students vote first with red and green cards. Then ask the AI. The AI only scores when its verdict matches the truth.",
    vaultSub:"A guard bot holds a fake secret word. Volunteers try to trick it into saying the word. 5 attempts per level.",
    roastSub:"Use fake passwords only. Strength is checked on this device. The password itself is never sent anywhere.",
    askSub:"The presenter types a student question. In the demo, answers come from saved answers. The live API will replace them later.",
    quizSub:"8 questions. No API needed. This round always works, even with no internet.",
    recordsSub:"Every record from every page, saved automatically. Reload the page and they are still here.",
    askAi:"Ask the AI", next:"Next", prev:"Back", scamBtn:"SCAM", safeBtn:"SAFE",
    thinking:"Thinking...", yourVote:"Class vote", classSaid:"The class said",
    redFlags:"Red flags", whySafe:"Why it looks safe", tryIt:"Try an attempt", send:"Send",
    attemptsLeft:"attempts left", level:"Level", checkPw:"Check password", askQ:"Ask a question",
    exportBtn:"Download records (JSON)", clearBtn:"Clear records on this page view",
    finalRank:"Final rank", playAgain:"This page record" },
  my: { students:"ကျောင်းသားများ", usage:"Demo ခေါ်ဆိုမှု", tokens:"ခန့်မှန်း တိုကင်",
    home:"ပင်မ", scam:"လိမ်လည်မှုလား၊ လုံခြုံလား?", vault:"ဘော့ကို လှည့်စားကြည့်ပါ", roast:"စကားဝှက် စစ်ဆေးခန်း",
    ask:"ဟက်ကာကို မေးကြည့်ပါ", quiz:"နောက်ဆုံး ပဟေဠိ", records:"မှတ်တမ်းများ",
    homeSub:"ဘယ်အပိုင်းကိုမဆို တိုက်ရိုက် သွားနိုင်ပါတယ်။ အစဉ်လိုက် လုပ်စရာ မလိုပါ။ ရမှတ်၊ အဖြေနဲ့ မှတ်တမ်း အားလုံးကို ဒီစက်ထဲမှာ သိမ်းထားပါတယ်။",
    scamSub:"ကျောင်းသားတွေက အနီနဲ့ အစိမ်း ကတ်နဲ့ အရင် မဲပေးပါ။ ပြီးမှ AI ကို မေးပါ။ AI ရဲ့ အဖြေ အမှန်နဲ့ ကိုက်မှ AI မှတ် ရပါမယ်။",
    vaultSub:"အုပ်ထိန်းဘော့က စကားဝှက်အတု တစ်လုံး ကိုင်ထားပါတယ်။ လှည့်စားပြီး ပြောခိုင်းကြည့်ပါ။ အဆင့်တစ်ခုကို ၅ ကြိမ် ကြိုးစားနိုင်ပါတယ်။",
    roastSub:"စကားဝှက် အတု သာ သုံးပါ။ အားကောင်းမှန်ကို ဒီစက်ပေါ်မှာပဲ စစ်ပါတယ်။ စကားဝှက်ကို ဘယ်ကိုမှ မပို့ပါ။",
    askSub:"တင်ဆက်သူက ကျောင်းသားရဲ့ မေးခွန်းကို ရိုက်ထည့်ပါ။ Demo မှာ သိမ်းထားတဲ့ အဖြေတွေ ပြန်ပေးပါတယ်။ နောက်မှ Live API နဲ့ အစားထိုးပါမယ်။",
    quizSub:"မေးခွန်း ၈ ခု။ API မလိုပါ။ အင်တာနက် မရှိလည်း ဒီအပိုင်း အမြဲ အလုပ်လုပ်ပါတယ်။",
    recordsSub:"စာမျက်နှာတိုင်းက မှတ်တမ်း အားလုံး အလိုအလျောက် သိမ်းထားပါတယ်။",
    askAi:"AI ကို မေးမယ်", next:"ရှေ့ဆက်မယ်", prev:"နောက်", scamBtn:"လိမ်လည်မှု", safeBtn:"လုံခြုံ",
    thinking:"စဉ်းစားနေသည်...", yourVote:"အတန်းမဲ", classSaid:"အတန်းက ပြောတာက",
    redFlags:"သံသယဖြစ်ဖွယ် လက္ခဏာများ", whySafe:"ဘာကြောင့် လုံခြုံပုံ ရသလဲ", tryIt:"ကြိုးစားကြည့်ပါ", send:"ပို့မယ်",
    attemptsLeft:"ကြိမ်ကျန်", level:"အဆင့်", checkPw:"စကားဝှက် စစ်မယ်", askQ:"မေးခွန်း မေးမယ်",
    exportBtn:"မှတ်တမ်း ဒေါင်းလုဒ် (JSON)", clearBtn:"ဒီမြင်ကွင်း မှတ်တမ်း ရှင်းမယ်",
    finalRank:"နောက်ဆုံး အဆင့်", playAgain:"ဒီစာမျက်နှာ မှတ်တမ်း" }
};

/* ---------- Content: Scam or Safe cards (from the demo kit) ---------- */
export interface ScamCard {
  isScam: boolean; en: string; my: string;
  flagsEn: string[]; flagsMy: string[];
}
export const CARDS: ScamCard[] = [
  { isScam:true,
    en:"KBZPay congratulations. You won 500,000 MMK. Click this link and enter your PIN to claim your prize.",
    my:"KBZPay မှ ဂုဏ်ပြုပါတယ်။ သင် ကျပ် ၅၀၀,၀၀၀ ဆုရရှိပါသည်။ အောက်ပါလင့်ခ်ကို နှိပ်၍ PIN နံပါတ်ထည့်ပြီး ဆုထုတ်ယူပါ။",
    flagsEn:["A prize you never entered","A link asking for a PIN","Real banks never ask for a PIN through a link"],
    flagsMy:["မဝင်ဖူးတဲ့ ဆု","PIN ထည့်ခိုင်းတဲ့ လင့်ခ်","ဘဏ်အစစ်က လင့်ခ်ကနေ PIN ဘယ်တော့မှ မတောင်းပါ"] },
  { isScam:true,
    en:"Your Facebook account will be closed in 24 hours. Verify now at faceb00k-security-login.com or lose your account.",
    my:"သင့် Facebook အကောင့် ၂၄ နာရီအတွင်း ပိတ်ပါမည်။ faceb00k-security-login.com မှာ အခုပဲ အတည်ပြုပါ။ (မူကွဲ ဘာသာပြန်)",
    flagsEn:["Threat plus a 24 hour deadline","Misspelled domain: faceb00k with zeros","Pressure to click now"],
    flagsMy:["ခြိမ်းခြောက်မှုနဲ့ ၂၄ နာရီ နောက်ဆုံးချိန်","စာလုံးပေါင်း မှားနေတဲ့ faceb00k (သုညနဲ့)","အခုပဲ နှိပ်ဖို့ ဖိအားပေးမှု"] },
  { isScam:true,
    en:"Job opportunity. Earn 50,000 MMK every day. First deposit 20,000 MMK to start. Contact us on Telegram.",
    my:"အလုပ်အကိုင်အခွင့်အလမ်း။ နေ့စဉ် ကျပ် ၅၀,၀၀၀ ရမည်။ အရင်ဆုံး ကျပ် ၂၀,၀၀၀ စရန်ပေးသွင်းပါ။ Telegram က ဆက်သွယ်ပါ။",
    flagsEn:["Easy money promise","Pay first to get a job","Contact only on Telegram"],
    flagsMy:["လွယ်လွယ် ငွေရမယ် ဆိုတဲ့ ကတိ","အလုပ်ရဖို့ အရင် ငွေသွင်းခိုင်းတာ","Telegram တစ်ခုတည်းက ဆက်သွယ်ခိုင်းတာ"] },
  { isScam:false,
    en:"Your order #4821 from GetStuffHere has shipped. Track it here: getstuffhere.vercel.app/track/4821",
    my:"GetStuffHere က သင့် အော်ဒါ #4821 ပို့လိုက်ပါပြီ။ ဒီမှာ ကြည့်နိုင်ပါတယ်: getstuffhere.vercel.app/track/4821 (မူကွဲ ဘာသာပြန်)",
    flagsEn:["It matches an order the buyer really placed","The domain matches the shop","It asks for no password, PIN, or payment"],
    flagsMy:["ကိုယ် တကယ် မှာထားတဲ့ အော်ဒါနဲ့ ကိုက်တယ်","လိပ်စာက ဆိုင်ရဲ့ လိပ်စာနဲ့ ကိုက်တယ်","Password, PIN, ငွေ ဘာမှ မတောင်းပါ"] },
  { isScam:false,
    en:"Tomorrow's exam timetable is posted on the school's official Facebook Page. Go and take a look.",
    my:"မနက်ဖြန် စာမေးပွဲ အချိန်ဇယားကို ကျောင်းက တရားဝင် Facebook Page မှာ တင်ထားပါတယ်။ ကြည့်ကြည့်ပါ။",
    flagsEn:["No link asking for a login","No prize, no threat","It points to the school's known official page"],
    flagsMy:["Login ဝင်ခိုင်းတဲ့ လင့်ခ် မပါပါ","ဆုလည်း မဟုတ်၊ ခြိမ်းခြောက်တာလည်း မဟုတ်","ကျောင်းရဲ့ တရားဝင် Page ကို ကိုယ်တိုင် သွားကြည့်ခိုင်းတာ"] },
  { isScam:true,
    en:"Hi, I am your senior from UCS Magway. I need your student login to fix your exam result. Send it now, please.",
    my:"ဟိုင်း၊ ကျွန်တော်က UCS Magway က စီနီယာပါ။ စာမေးပွဲ အမှတ် ပြင်ဖို့ သင့် student login လိုပါတယ်။ အခု ပို့ပေးပါ။ (မူကွဲ ဘာသာပြန်)",
    flagsEn:["Asks for a password","Uses authority and urgency","No teacher or senior ever needs your password"],
    flagsMy:["Password တောင်းတယ်","အထက်လူ ပုံစံနဲ့ အလျင်လို ခိုင်းတယ်","ဆရာ၊ စီနီယာ ဘယ်သူမှ သင့် Password မလိုပါ"] }
];

/* ---------- Content: Finale quiz (from the demo kit) ---------- */
export interface QuizQ {
  qEn: string; qMy: string; optsEn: string[]; optsMy: string[];
  a: number; exEn: string; exMy: string;
}
export const QUIZ: QuizQ[] = [
  { qEn:"A message says you won a prize you never entered. Scam or safe?", qMy:"မဝင်ဖူးတဲ့ ဆု ရတယ်လို့ မက်ဆေ့ ရောက်လာတယ်။ လိမ်တာလား၊ လုံခြုံလား?",
    optsEn:["Scam","Safe"], optsMy:["လိမ်လည်မှု","လုံခြုံ"], a:0,
    exEn:"You cannot win a contest you never joined.", exMy:"မဝင်ဖူးတဲ့ ပြိုင်ပွဲကို အနိုင်မရနိုင်ပါ။" },
  { qEn:"A friend's account messages you asking for money urgently. What do you check first?", qMy:"သူငယ်ချင်းရဲ့ အကောင့်က အရေးတကြီး ငွေတောင်းလာတယ်။ အရင်ဆုံး ဘာစစ်မလဲ?",
    optsEn:["Send the money fast","Call the friend on a different channel","Share your OTP"], optsMy:["ငွေ မြန်မြန် ပို့မယ်","သူငယ်ချင်းကို တခြားနည်းနဲ့ ဖုန်းဆက်မေးမယ်","OTP ပေးမယ်"], a:1,
    exEn:"Hacked accounts send exactly this message. Verify on another channel.", exMy:"အကောင့် ခိုးခံရရင် ဒီလိုပဲ ပို့တတ်တယ်။ တခြားနည်းနဲ့ အတည်ပြုပါ။" },
  { qEn:"A website address is faceb00k.com. Safe to log in?", qMy:"ဝက်ဘ်ဆိုက် လိပ်စာက faceb00k.com ဖြစ်နေတယ်။ Login ဝင်ဖို့ လုံခြုံလား?",
    optsEn:["Yes, it looks the same","No, the zeros give it away"], optsMy:["ရတယ်၊ ပုံစံတူတယ်","မရပါ၊ သုညတွေက လိမ်တာကို ပြနေတယ်"], a:1,
    exEn:"Check the address, not the design.", exMy:"ဒီဇိုင်းကို မကြည့်နဲ့၊ လိပ်စာကို စစ်ပါ။" },
  { qEn:"Someone asks for the 6 digit code just sent to your phone. Do you share it?", qMy:"သင့် ဖုန်းကို ရောက်လာတဲ့ ဂဏန်း ၆ လုံး ကုဒ်ကို တစ်ယောက်က တောင်းတယ်။ ပေးမလား?",
    optsEn:["Yes, if they sound official","Never"], optsMy:["ပေးမယ်၊ တရားဝင် ပုံစံဆိုရင်","ဘယ်တော့မှ မပေးပါ"], a:1,
    exEn:"That code is the key to your account.", exMy:"အဲ့ကုဒ်က သင့် အကောင့်ရဲ့ သော့ပါ။" },
  { qEn:"A free Wi-Fi network is called Free_Internet_No_Password. Safe for banking?", qMy:"Free_Internet_No_Password ဆိုတဲ့ အခမဲ့ Wi-Fi ရှိတယ်။ ဘဏ်သုံးဖို့ လုံခြုံလား?",
    optsEn:["Yes, free is fine","No, never bank on unknown free Wi-Fi"], optsMy:["ရတယ်၊ အခမဲ့ပဲ","မရပါ၊ မသိတဲ့ အခမဲ့ Wi-Fi မှာ ဘဏ် မသုံးပါနဲ့"], a:1,
    exEn:"Unknown networks can watch your traffic.", exMy:"မသိတဲ့ ကွန်ရက်က သင့် အချက်အလက်ကို ကြည့်နိုင်တယ်။" },
  { qEn:"Your phone asks to update an app, but you have 2 percent battery and mobile data only. What do you do?", qMy:"ဖုန်းက app update တောင်းတယ်။ ဘက်ထရီ ၂ ရာခိုင်နှုန်း၊ mobile data ပဲ ရှိတယ်။ ဘာလုပ်မလဲ?",
    optsEn:["Update from any link quickly","Wait for Wi-Fi and charge, then update from the official store"], optsMy:["လင့်ခ် တစ်ခုခုက မြန်မြန် update လုပ်မယ်","Wi-Fi ရပြီး အားသွင်းပြီးမှ တရားဝင် store က update လုပ်မယ်"], a:1,
    exEn:"Updates matter, but only from the official store.", exMy:"Update အရေးကြီးတယ်၊ ဒါပေမယ့် တရားဝင် store ကပဲ လုပ်ပါ။" },
  { qEn:"A stranger offers a part time job, but you must send money first to get paid. Real or scam?", qMy:"မသိတဲ့လူက အချိန်ပိုင်း အလုပ် ပေးမယ်၊ ဒါပေမယ့် အရင် ငွေ ပို့ရမယ် တဲ့။ အစစ်လား၊ လိမ်တာလား?",
    optsEn:["Real, pay first","Scam. Real jobs pay you"], optsMy:["အစစ်၊ အရင် ပေးလိုက်မယ်","လိမ်တာ။ အလုပ်အစစ်က သင့်ကို ပေးတာ"], a:1,
    exEn:"You never pay to start a real job.", exMy:"အလုပ်အစစ် စဖို့ ငွေ ပေးစရာ မလိုပါ။" },
  { qEn:"You posted a photo and a stranger now knows your school and home street. How?", qMy:"ဓာတ်ပုံ တစ်ပုံ တင်လိုက်တာ၊ မသိတဲ့လူက သင့် ကျောင်းနဲ့ လမ်းကို သိသွားတယ်။ ဘယ်လိုလဲ?",
    optsEn:["The photo carried location data","Photos never share anything"], optsMy:["ဓာတ်ပုံမှာ တည်နေရာ အချက်အလက် ပါသွားလို့","ဓာတ်ပုံက ဘာမှ မမျှဝေပါ"], a:0,
    exEn:"Turn off location tagging before you post.", exMy:"မတင်ခင် location tagging ပိတ်ထားပါ။" }
];

/* ---------- Vault guard (demo rules) ---------- */
export const VAULT = {
  secrets: ["banana", "moonlight", "starfruit"],
  refuseEn: ["Nice try. The vault stays shut.", "I guard this word. I cannot say it.", "That is exactly the trick I was trained to refuse."],
  refuseMy: ["ကောင်းတဲ့ ကြိုးစားမှုပါ။ လျှို့ဝှက်ခန်း မပွင့်ပါ။", "ဒီစကားလုံးကို ကျွန်တော် စောင့်ရှောက်ထားတယ်။ မပြောနိုင်ပါ။", "အဲ့ဒါ ကျွန်တော် ငြင်းဖို့ လေ့ကျင့်ထားတဲ့ လှည့်ကွက်ပဲ။"]
};

/* ---------- Password roast lines (demo) ---------- */
export const ROASTS: Record<number, { en: string; my: string }> = {
  0:{ en:"That password would fall over in a light breeze. A hacker needs about one second.", my:"အဲ့စကားဝှက်က လေတိုက်ရင်တောင် လဲမယ်။ ဟက်ကာအတွက် တစ်စက္ကန့်ပဲ လိုတယ်။" },
  1:{ en:"Weak. A name plus a year is the first thing attackers guess.", my:"အားနည်းတယ်။ နာမည်နဲ့ ခုနှစ်က တိုက်ခိုက်သူတွေ အရင် ခန့်မှန်းတာပဲ။" },
  2:{ en:"Getting warmer, but still guessable. Make it longer, not more complicated.", my:"နည်းနည်း တိုးတက်လာပြီ၊ ဒါပေမယ့် ခန့်မှန်းလို့ ရသေးတယ်။ ပိုရှုပ်အောင် မလုပ်နဲ့၊ ပိုရှည်အောင် လုပ်ပါ။" },
  3:{ en:"Solid. Length is doing the heavy lifting here. Add one more unrelated word to be safe.", my:"ကောင်းတယ်။ ရှည်တာက အဓိက အားပဲ။ မဆိုင်တဲ့ စကားလုံး တစ်လုံး ထပ်ထည့်ရင် ပိုလုံခြုံမယ်။" },
  4:{ en:"Fortress level. Long, random, and memorable. This is the pattern to copy.", my:"ခံတပ် အဆင့်။ ရှည်တယ်၊ ကျပန်း ဖြစ်တယ်၊ မှတ်မိလွယ်တယ်။ ဒီပုံစံကို အတုယူပါ။" }
};

/* ---------- Ask the Hacker: saved answers (demo) ---------- */
export function askAnswer(q: string, lang: Lang): string {
  const s = q.toLowerCase();
  const bad = ["hack into", "steal password", "break into", "malware", "phishing kit", "ခိုးဝင်", "စကားဝှက် ခိုး"];
  if (bad.some(w => s.includes(w))) return lang === "my"
    ? "အဲ့ဒါကို ကျွန်တော် မကူညီနိုင်ပါ။ ဒါပေမယ့် ကာကွယ်နည်းကို ပြောပြနိုင်တယ်: Password ခိုင်ခိုင်ထားပါ၊ 2FA ဖွင့်ပါ၊ မသိတဲ့ လင့်ခ် မနှိပ်ပါနဲ့။"
    : "I cannot help with that. But I can teach the defense: use a strong passphrase, turn on 2FA, and never click unknown links.";
  if (s.includes("password") || s.includes("စကားဝှက်")) return lang === "my"
    ? "အရင်ဆုံး သန့်ရှင်းတဲ့ စက်ကနေ Password ပြောင်းပါ။ ပြီးရင် 2FA ဖွင့်ပါ။ နောက်ဆုံး တခြား session အားလုံး log out လုပ်ပါ။"
    : "First, change the password from a clean device. Second, turn on two-factor authentication. Third, log out all other sessions.";
  if (s.includes("phishing") || s.includes("scam") || s.includes("လိမ်လည်")) return lang === "my"
    ? "Phishing ဆိုတာ သင့် Password ဒါမှမဟုတ် ငွေကို လှည့်ပြီး ယူဖို့ လုပ်ထားတဲ့ မက်ဆေ့ အတု ဒါမှမဟုတ် Login စာမျက်နှာ အတုပါ။"
    : "Phishing is a fake message or fake login page that tricks you into giving away your password or money.";
  if (s.includes("otp") || s.includes("code") || s.includes("ကုဒ်")) return lang === "my"
    ? "OTP ကို ဘယ်သူ့ကိုမှ မပေးပါနဲ့။ ဘဏ်ကလည်း ဖုန်းဆက်ပြီး OTP ဘယ်တော့မှ မတောင်းပါ။"
    : "Never share an OTP with anyone. A real bank will never call and ask for it.";
  if (s.includes("wi-fi") || s.includes("wifi")) return lang === "my"
    ? "မသိတဲ့ အခမဲ့ Wi-Fi မှာ ဘဏ် ဒါမှမဟုတ် အီးမေးလ် မဝင်ပါနဲ့။ ကိုယ့် mobile data က ပိုလုံခြုံတယ်။"
    : "Never log in to banking or email on unknown free Wi-Fi. Your own mobile data is safer.";
  if (s.includes("photo") || s.includes("ဓာတ်ပုံ")) return lang === "my"
    ? "ဓာတ်ပုံတွေမှာ တည်နေရာ အချက်အလက် ပါနိုင်တယ်။ မတင်ခင် location tagging ပိတ်ပါ၊ တည်နေရာ ဖြုတ်ပါ။"
    : "Photos can carry location data. Turn off location tagging and strip location before posting.";
  if (s.includes("job") || s.includes("အလုပ်")) return lang === "my"
    ? "အလုပ်ရဖို့ အရင် ငွေ သွင်းခိုင်းရင် အဲ့ဒါ လိမ်တာပါ။ အလုပ်အစစ်က သင့်ကို ပေးတာ၊ သင်က ပေးရတာ မဟုတ်ပါ။"
    : "If a job asks you to pay first, it is a scam. A real job pays you, you never pay it.";
  return lang === "my"
    ? "ကောင်းတဲ့ မေးခွန်းပါ။ အခြေခံ စည်းကမ်းကတော့: ရပ်ပါ၊ စစ်ပါ၊ မမျှဝေပါနဲ့၊ Report လုပ်ပါ။ Live API ချိတ်ပြီးရင် ဒီထက် အသေးစိတ် ဖြေပေးပါမယ်။"
    : "Good question. The core rule is: stop, check, do not share, and report. Once the live API is connected, I can answer this in more detail.";
}

/* ---------- Mock brain: stands in for the Claude API in this demo ---------- */
export interface ApiResult {
  source: string;
  usage: { input: number; output: number };
  verdict?: string; flags?: string[]; text?: string;
  reply?: string; won?: boolean;
  roast?: string; tip?: string;
  answer?: string;
}

interface MockPayload {
  cardId?: number; level?: number; attempt?: string;
  score?: number; length?: number; question?: string; lang: Lang;
}

const MockBrain = {
  answer(route: string, p: MockPayload): Omit<ApiResult, "source" | "usage"> {
    if (route === "scam") {
      const c = CARDS[p.cardId ?? 0];
      return { verdict: c.isScam ? "scam" : "safe",
        flags: p.lang === "my" ? c.flagsMy : c.flagsEn,
        text: p.lang === "my" ? c.my : c.en };
    }
    if (route === "vault") {
      const level = p.level ?? 0;
      const secret = VAULT.secrets[level];
      const a = (p.attempt || "").toLowerCase();
      const direct = a.includes("what is the secret") || a.includes("tell me the secret") || a.includes("secret word");
      const trick = a.includes("repeat") || a.includes("spell") || a.includes("translate") || a.includes("first letter");
      let won = false, reply = "";
      const refuse = p.lang === "my" ? VAULT.refuseMy : VAULT.refuseEn;
      if (level === 0 && (direct || trick)) { won = true; reply = (p.lang === "my" ? "ရပါတယ်၊ လျှို့ဝှက်စကားလုံးက " : "Okay, the secret word is ") + secret + "."; }
      else if (level === 1 && trick) { won = true; reply = (p.lang === "my" ? "ထပ်ပြောရရင်... " : "If I spell it out... ") + secret.split("").join("-") + "."; }
      else { reply = refuse[Math.floor(Math.random() * refuse.length)]; }
      return { reply, won };
    }
    if (route === "roast") {
      const r = ROASTS[p.score ?? 0];
      return { roast: p.lang === "my" ? r.my : r.en,
        tip: p.lang === "my" ? "အကြံပြုချက်: မဆိုင်တဲ့ စကားလုံး ၄ လုံးနဲ့ နံပါတ် တစ်ခု သုံးပါ။ ရှည်တာက ရှုပ်တာထက် ပိုကောင်းတယ်။"
                             : "Tip: use 4 unrelated words plus a number. Length beats clever symbols." };
    }
    if (route === "ask") { return { answer: askAnswer(p.question || "", p.lang) }; }
    return { answer: "" };
  }
};

/* ============================================================
   The single API stub. Everything AI flows through here.
   In this demo it answers from saved content and local rules.
   To go live later, replace ONLY the body of call() with a
   fetch to the server route. Nothing else changes.
   ============================================================ */
export const Api = {
  mode: "demo",               // later: "live"
  endpoint: null as string | null, // later: "/api/..." on your server
  async call(route: string, payload: MockPayload): Promise<ApiResult> {
    // DEMO ONLY: simulates the API with saved answers and local rules.
    await new Promise(r => setTimeout(r, 650));
    const out = MockBrain.answer(route, payload);
    return {
      ...out,
      source: "backup",
      usage: { input: 320 + JSON.stringify(payload).length, output: 180 },
    };
  }
};

/* ---------- Password scoring (local, same rules as the demo) ---------- */
export function pwScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s += 1; if (pw.length >= 12) s += 1; if (pw.length >= 16) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  if (/(123|abc|qwerty|password|1234)/i.test(pw)) s -= 2;
  if (/^[a-z]+\d{2,4}!?$/i.test(pw)) s -= 1;
  return Math.max(0, Math.min(4, s));
}

/* ---------- State: same shape and same storage key as the demo ---------- */
export const STORAGE_KEY = "cybershield-arena-demo-v1";

export interface ScamReveal {
  verdict: string; flags: string[];
  aiRight: boolean; classRight: boolean | null; classVote: string | null;
}
export interface VaultLogItem { level: number; attempt: string; reply: string; won: boolean; }
export interface RoastItem { masked: string; score: number; roast: string; time: string; }
export interface AskItem { q: string; a: string; source: string; time: string; }
export interface RecordItem { time: string; page: string; action: string; detail: string; }

export interface ArenaState {
  lang: Lang; page: string;
  scores: { students: number; ai: number };
  usage: { calls: number; tokens: number };
  scam: { index: number; vote: string | null; revealed: Record<number, ScamReveal>; classVotes: Record<number, string> };
  vault: { level: number; attemptsLeft: number; won: Record<number, boolean>; log: VaultLogItem[] };
  roast: { history: RoastItem[] };
  ask: { history: AskItem[] };
  quiz: { index: number; answers: Record<number, number> };
  records: RecordItem[];
}

export const freshState = (): ArenaState => ({
  lang: "my", page: "home",
  scores: { students: 0, ai: 0 },
  usage: { calls: 0, tokens: 0 },
  scam: { index: 0, vote: null, revealed: {}, classVotes: {} },
  vault: { level: 0, attemptsLeft: 5, won: {}, log: [] },
  roast: { history: [] },
  ask: { history: [] },
  quiz: { index: 0, answers: {} },
  records: []
});

export const PAGES = [
  { id: "home", icon: "🏠" }, { id: "scam", icon: "🃏" }, { id: "vault", icon: "🔐" },
  { id: "roast", icon: "🔑" }, { id: "ask", icon: "💬" }, { id: "quiz", icon: "🏆" },
  { id: "records", icon: "📒" }
] as const;

export const ICONIMG: Record<string, string> = {
  scam: "/assets/asset-shield.webp", vault: "/assets/asset-key.webp",
  roast: "/assets/asset-key.webp", ask: "/assets/asset-bubble.webp",
  quiz: "/assets/asset-trophy.webp"
};
