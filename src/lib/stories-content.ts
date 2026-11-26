/* Branching story content: Scam Call Live, Friend or Fraud, Boss Fight.
   Scripts are node graphs. Each choice carries a money/heart effect and a
   short note. Endings are explicit nodes with kind: "end". */

import type { Lang } from "./content";
export const pick = (lang: Lang, en: string, my: string) => (lang === "my" ? my : en);

/* ================= Scam Call Live ================= */
export interface CallChoice {
  en: string; my: string;
  money: number;              // change to the money meter (starts at 100)
  noteEn: string; noteMy: string;
  next: string;               // node id
}
export interface CallNode {
  id: string;
  speakerEn: string; speakerMy: string;   // caller line (for kind "line")
  lineEn: string; lineMy: string;
  choices?: CallChoice[];
  endKind?: "win" | "lose" | "safe";
  endEn?: string; endMy?: string;
}
export interface CallScript {
  id: string; titleEn: string; titleMy: string;
  fromEn: string; fromMy: string;
  start: string; nodes: Record<string, CallNode>;
}

export const CALL_SCRIPTS: CallScript[] = [
  {
    id: "bank",
    titleEn: "The Bank That Was Not", titleMy: "ဘဏ် မဟုတ်တဲ့ ဘဏ်",
    fromEn: "Unknown number", fromMy: "မသိတဲ့ နံပါတ်",
    start: "n1",
    nodes: {
      n1: {
        id: "n1", speakerEn: "Caller", speakerMy: "ဖုန်းဆက်သူ",
        lineEn: "Hello, this is KBZ Bank security. Someone is stealing money from your account right now. We must act fast!",
        lineMy: "ဟယ်လို၊ KBZ Bank လုံခြုံရေး ဌာနကပါ။ သင့် အကောင့်ကနေ ငွေတွေ ခိုးနေပြီ။ မြန်မြန် လုပ်မှရမယ်!",
        choices: [
          { en: "Ask: how do you know my number?", my: "မေးမယ်: ကျွန်တော့် နံပါတ်ကို ဘယ်လို သိတာလဲ?",
            money: 0, next: "n2",
            noteEn: "Good instinct: real banks call from official numbers and never rush you.",
            noteMy: "ကောင်းတဲ့ ရွေးချယ်မှူပဲ : ဘဏ် အစစ်က တရားဝင် နံပါတ်နဲ့ ဆက်ပြီး အလျင်စလို မခိုင်းဘူး။" },
          { en: "Panic and ask what to do", my: "ထိတ်လန့်ပြီး ဘာလုပ်ရမလဲ မေးမယ်",
            money: -10, next: "n2",
            noteEn: "Panic is exactly what the caller wants. Fear makes people skip checking.",
            noteMy: "ထိတ်လန့်တာက ဖုန်းဆက်သူ လိုချင်တာပဲ။ ကြောက်နေရင် သေချာမစစ်ဆေးနိုင်ကြတော့ဘူး။" },
          { en: "Hang up and call the bank's official number yourself", my: "ဖုန်းချပြီး ဘဏ် တရားဝင် နံပါတ်ကို ကိုယ်တိုင် ဆက်မယ်",
            money: 0, next: "endSafe",
            noteEn: "Perfect move. Calling the official number yourself cuts the scammer out completely.",
            noteMy: "အကောင်းဆုံး လုပ်ရပ်ပဲ။ တရားဝင် နံပါတ်ကို ကိုယ်တိုင် ဆက်ရင် လူလိမ်ဘာမှမလုပ်နိုင်တော့ဘူး။" },
        ],
      },
      n2: {
        id: "n2", speakerEn: "Caller", speakerMy: "ဖုန်းဆက်သူ",
        lineEn: "To stop the thief, read me the 6 digit code we just sent to your phone. Quickly, or the money is gone!",
        lineMy: "သူခိုးကို ဆက်မခိုးနိုင်အောင် သင့်ဖုန်းကို ပို့ထားတဲ့ ဂဏန်း ၆ လုံး ကုဒ်ကို ဖတ်ပြပါ။ မြန်မြန်၊ မဟုတ်ရင် ငွေတွေဆုံးရှုံးသွားလိမ့်မယ်!",
        choices: [
          { en: "Read the code out", my: "ကုဒ်ကို ဖတ်ပြမယ်",
            money: -60, next: "n3",
            noteEn: "That code is the key to your account. The 'thief' is the person asking for it.",
            noteMy: "အဲ့ကုဒ်က သင့် အကောင့်ရဲ့ သော့ပဲ။ 'သူခိုး' က ကုဒ် တောင်းနေတဲ့ လူ ကိုယ်တိုင်ပဲ။" },
          { en: "Refuse: a real bank never asks for codes", my: "ငြင်းမယ်: ဘဏ် အစစ်က ကုဒ် ဘယ်တော့မှ မတောင်းဘူး",
            money: 0, next: "n3",
            noteEn: "Exactly right. No bank, ever, asks for an OTP on a call.",
            noteMy: "အတိအကျပဲ။ ဘယ်ဘဏ်မှ ဖုန်းနဲ့ OTP မတောင်းဘူး။" },
          { en: "Say you will go to the bank branch instead", my: "ဘဏ် ခွဲတန်းကို ကိုယ်တိုင် သွားမယ် လို့ ပြောမယ်",
            money: 0, next: "endSafe",
            noteEn: "Going in person is always safe. Scammers hate anything slow and checkable.",
            noteMy: "ကိုယ်တိုင် သွားတာက အမြဲ လုံခြုံတယ်။ လူလိမ်တွေက အဆင့်တွေများပြီးစစ်ဆေးလို့ရတာမျိုးတွေကို မကြိုက်ဘူး။" },
        ],
      },
      n3: {
        id: "n3", speakerEn: "Caller", speakerMy: "ဖုန်းဆက်သူ",
        lineEn: "You are making a mistake! If you hang up now, the bank is not responsible for your loss. Stay on the line!",
        lineMy: "သင် မှားနေပြီ! အခု ဖုန်းချရင် ဘဏ်က တာဝန် မယူဘူး။ လိုင်းပေါ်မှာ ဆက်နေပါ!",
        choices: [
          { en: "Hang up and check the app yourself", my: "ဖုန်းချပြီး app ထဲမှာ ကိုယ်တိုင် စစ်မယ်",
            money: 0, next: "endWin",
            noteEn: "Threats are pressure, not policy. Checking the app yourself shows the truth.",
            noteMy: "ခြိမ်းခြောက်တာက ဖိအားပဲ၊ မူဝါဒ မဟုတ်ဘူး။ App ထဲ ကိုယ်တိုင် စစ်ဆေးတာကသာ အမှန်တရားကို တွေ့နိုင်မယ်။" },
          { en: "Stay on the line, just in case", my: "မချသေးဘဲ လိုင်းပေါ် ဆက်နေမယ်",
            money: -20, next: "endLose",
            noteEn: "Staying on the line keeps you inside the scammer's script, step by step.",
            noteMy: "လိုင်းပေါ် ဆက်နေရင် လူလိမ်ရဲ့ အလိမ်အညာဇာတ်လမ်းထဲ တစ်ဆင့်ချင်း ဝင်သွားတာပဲ။" },
        ],
      },
      endSafe: {
        id: "endSafe", speakerEn: "", speakerMy: "", lineEn: "", lineMy: "", endKind: "safe",
        endEn: "You ended the call and verified through an official channel. The scammer got nothing. That is exactly how these calls should end.",
        endMy: "ဖုန်းချပြီး တရားဝင် နည်းလမ်းနဲ့ အတည်ပြုလိုက်တယ်။ လူလိမ် ဘာမှ မရဘူး။ ဒီလို ဖုန်းခေါ်မှုတွေ ဒီလိုပဲ ဆုံးသင့်တယ်။",
      },
      endWin: {
        id: "endWin", speakerEn: "", speakerMy: "", lineEn: "", lineMy: "", endKind: "win",
        endEn: "You hung up and checked yourself: your money never moved. The caller was the only thief in the story, and you exposed him.",
        endMy: "ဖုန်းချပြီး ကိုယ်တိုင် စစ်လိုက်တယ်: ငွေတွေရှိသေးတယ်။ ဒီဇာတ်လမ်းထဲက သူခိုးက ဖုန်းဆက်သူ တစ်ယောက်ပဲ ရှိတယ်၊ သင်က သူ့ကို ဖော်ထုတ်လိုက်ပြီ။",
      },
      endLose: {
        id: "endLose", speakerEn: "", speakerMy: "", lineEn: "", lineMy: "", endKind: "lose",
        endEn: "The meter shows what these calls cost when fear wins. In real life there is no restart button, so remember the pattern: urgency plus a code request equals scam.",
        endMy: "ကြောက်ရွံ့မှုကသာ နိုင်သွားရင် ဒီလိုဖုန်းခေါ်မှုတွေက ဘယ်လောက်ထိ ဆုံးရှုံးသွားနိုင်လည်း ဆိုတာကိုပြနေတယ်။ တကယ့် ဘဝက gameလိုမျိုး ပြန်စလို့ မရဘူး၊ ဒီလိုပုံစံတွေကို မှတ်ထားပါ: အလျင်စလို ခိုင်းပြီး ကုဒ် တောင်းရင် လိမ်တာပဲ။",
      },
    },
  },
  {
    id: "parcel",
    titleEn: "The Stuck Parcel", titleMy: "မရောက်သေးတဲ့ ပါဆယ်",
    fromEn: "Delivery company?", fromMy: "Delivery ကုမ္ပဏီ?",
    start: "p1",
    nodes: {
      p1: {
        id: "p1", speakerEn: "Caller", speakerMy: "ဖုန်းဆက်သူ",
        lineEn: "Hello, your parcel from overseas is held at customs. Pay a small clearance fee today or it will be returned.",
        lineMy: "ဟယ်လို၊ သင့်ရဲ့ နိုင်ငံခြားက ပါဆယ် အကောက်ခွန်ရုံးမှာ ရောက်နေတယ်။ ဒီနေ့ ရှင်းခ ပေးမှ၊ မဟုတ်ရင် ပြန်ပို့လိုက်ရပါမယ်။",
        choices: [
          { en: "Ask for the tracking number and check it yourself", my: "Tracking နံပါတ် တောင်းပြီး ကိုယ်တိုင် စစ်မယ်",
            money: 0, next: "p2",
            noteEn: "Real parcels have tracking numbers you can check in the official app.",
            noteMy: "ပါဆယ် အစစ်မှာ တရားဝင် app ထဲ စစ်လို့ ရတဲ့ tracking နံပါတ် ရှိတယ်။" },
          { en: "Ask how to pay right away", my: "အခု ဘယ်လို ပေးရမလဲ မေးမယ်",
            money: -15, next: "p2",
            noteEn: "Rushing to pay is the trap. No fee should be paid before you verify the parcel exists.",
            noteMy: "ပေးဖို့ အလောတကြီး လုပ်တာက ထောင်ချောက်ပဲ။ ပါဆယ် ရှိတာ အရင် အတည်မပြုဘဲ ဘာမှ မပေးသင့်ဘူး။" },
        ],
      },
      p2: {
        id: "p2", speakerEn: "Caller", speakerMy: "ဖုန်းဆက်သူ",
        lineEn: "Just send 30,000 MMK to this personal Wave account. It is faster than the office, trust me.",
        lineMy: "ကျပ် ၃၀,၀၀၀ ကို ဒီ ကိုယ်ပိုင် Wave အကောင့်ကို ပို့ရုံပဲ။ ရုံးထက် မြန်တယ်၊ ယုံပါ။",
        choices: [
          { en: "Send it, it is not much money", my: "ပို့လိုက်မယ်၊ ငွေ နည်းနည်းပဲ",
            money: -40, next: "endLose",
            noteEn: "Small amounts are the business model: thousands of small payments add up, and the parcel never existed.",
            noteMy: "နည်းနည်း စီယူတာက သူတို့ စီးပွားရေးပဲ: လူ ထောင်ချီကနေ နည်းနည်းစီ စုရင် များသွားတယ်၊ ပါဆယ်ကတော့ အစကတည်းက မရှိဘူး။" },
          { en: "Refuse: companies never collect fees into personal accounts", my: "ငြင်းမယ်: ကုမ္ပဏီက ကိုယ်ပိုင် အကောင့်နဲ့ ပို့ခ ဘယ်တော့မှ မကောက်ဘူး",
            money: 0, next: "endWin",
            noteEn: "That one sentence ends most delivery scams. Official fees go through official channels.",
            noteMy: "အဲ့စကားတစ်ခွန်းနဲ့ delivery လိမ်နည်း တော်တော်များများ အဆုံးသတ်သွားတယ်။ တရားဝင် ပို့ခ က တရားဝင် နည်းလမ်းနဲ့ပဲ ပေးရတယ်။" },
        ],
      },
      endWin: {
        id: "endWin", speakerEn: "", speakerMy: "", lineEn: "", lineMy: "", endKind: "win",
        endEn: "You exposed the trick: a 'company' collecting into a personal account. The parcel was imaginary, your money is not.",
        endMy: "လှည့်ကွက်ကို ဖော်ထုတ်လိုက်ပြီ: 'ကုမ္ပဏီ' က ကိုယ်ပိုင် အကောင့်နဲ့ ပို့ခ ကောက်နေတာ။ ပါဆယ်က စိတ်ကူးသက်သက်ဖြစ်ပြီး၊ သင့် ငွေကတော့ အစစ်ပဲ။",
      },
      endLose: {
        id: "endLose", speakerEn: "", speakerMy: "", lineEn: "", lineMy: "", endKind: "lose",
        endEn: "The fee vanished into a personal account and no parcel ever came. Remember: verify first, pay second, and never to a personal account.",
        endMy: "ပို့ခ က ကိုယ်ပိုင် အကောင့်ထဲ ပျောက်သွားပြီး ပါဆယ် ဘယ်တော့မှ မရောက်ဘူး။ မှတ်ထားပါ: အရင် အတည်ပြု၊ ပြီးမှ ပေး၊ ကိုယ်ပိုင် အကောင့်ကို ဘယ်တော့မှ မပေးနဲ့။",
      },
    },
  },
];

/* ================= Friend or Fraud ================= */
export interface FriendNode {
  id: string;
  fromFriendEn?: string; fromFriendMy?: string;   // incoming chat line
  choices?: CallChoice[];
  endKind?: "win" | "lose";
  endEn?: string; endMy?: string;
}
export interface FriendScript {
  titleEn: string; titleMy: string; friendEn: string; friendMy: string;
  start: string; nodes: Record<string, FriendNode>;
}

export const FRIEND_SCRIPT: FriendScript = {
  titleEn: "A Friend in Trouble?", titleMy: "ဒုက္ခရောက်နေတဲ့ သူငယ်ချင်းလား?",
  friendEn: "May Thazin (Messenger)", friendMy: "May Thazin (Messenger)",
  start: "f1",
  nodes: {
    f1: {
      id: "f1",
      fromFriendEn: "Hi, it is me. I changed my number. My wallet is gone and I am stuck, can you send 100,000 MMK to this account quickly? I will pay you back tonight.",
      fromFriendMy: "ဟိုင်း၊ ငါပဲ။ နံပါတ် ပြောင်းလိုက်တယ်။ ပိုက်ဆံအိတ် ပျောက်သွားလို့ ဒုက္ခရောက်နေတယ်၊ ဒီ အကောင့်ကို ကျပ် ၁၀၀,၀၀၀ မြန်မြန် ပို့ပေးနိုင်မလား? ဒီည ပြန်ဆပ်ပါမယ်။",
      choices: [
        { en: "Ask a question only the real friend would know", my: "သူငယ်ချင်း အစစ်ပဲ သိမယ့် မေးခွန်း မေးမယ်",
          money: 0, next: "f2",
          noteEn: "A secret question is a strong test. Scammers on stolen accounts fail it.",
          noteMy: "လျှို့ဝှက် မေးခွန်းက စမ်းသပ်ချက် ကောင်းတယ်။ အကောင့် ခိုးထားတဲ့ လူလိမ်တွေ ဒါကို မဖြေနိုင်ဘူး။" },
        { en: "Send the money now, friends help friends", my: "အခု ပို့လိုက်မယ်၊ သူငယ်ချင်း အချင်းချင်း ကူရမှာပဲ",
          money: -70, next: "endLose1",
          noteEn: "That account was stolen. The money went to the scammer, not your friend.",
          noteMy: "အဲ့အကောင့်က ခိုးခံထားရတာ။ ငွေက သူငယ်ချင်းဆီ မဟုတ်ဘဲ လူလိမ်ဆီ ရောက်သွားတယ်။" },
        { en: "Call the friend's old number to check", my: "သူငယ်ချင်းရဲ့ နံပါတ် အဟောင်းကို ဆက်ပြီး စစ်မယ်",
          money: 0, next: "f2",
          noteEn: "Verifying on a channel you already trust is the golden rule.",
          noteMy: "ကိုယ် ယုံပြီးသား နည်းလမ်းနဲ့ အတည်ပြုတာက အကောင်းဆုံးနည်းလမ်းပဲ။" },
      ],
    },
    f2: {
      id: "f2",
      fromFriendEn: "Please do not call, my battery is dying and this is urgent. Just send it, I beg you. Why do you not trust me?",
      fromFriendMy: "ဖုန်း မဆက်ပါနဲ့၊ ဘက်ထရီ ကုန်တော့မယ်၊ အရမ်း အရေးကြီးတယ်။ ပို့လိုက်ပါ၊ တောင်းပန်ပါတယ်။ ဘာလို့ ငါ့ကို မယုံတာလဲ?",
      choices: [
        { en: "Insist: one quick call, or no money", my: "တိတိကျကျ ပြောမယ်: ဖုန်း တစ်ခါ ဆက်ခွင့်ပေး၊ မဟုတ်ရင် မပို့ဘူး",
          money: 0, next: "endWin",
          noteEn: "Guilt is a pressure tool. Real friends survive a 30 second check.",
          noteMy: "အပြစ်ရှိ သလို ခံစားခိုင်းတာက ဖိအားပေးနည်းတစ်မျိုးပဲ။ သူငယ်ချင်း အစစ်က စက္ကန့် ၃၀လောက်တော့ စစ်ဆေးတာကို ခံနိုင်တယ်။" },
        { en: "Feel guilty and send a smaller amount", my: "စိတ်မကောင်း ဖြစ်ပြီး နည်းနည်း ပို့လိုက်မယ်",
          money: -40, next: "endLose2",
          noteEn: "Half a scam is still a scam. Any amount sent to an unverified account is gone.",
          noteMy: "တစ်ဝက် လိမ်တာလည်း လိမ်တာပဲ။ အတည်မပြုတဲ့ အကောင့်ကို ပို့တဲ့ ငွေ ဘယ်လောက်ဖြစ်ဖြစ် ပျောက်တာပဲ။" },
        { en: "Ask them to send a voice note saying today's date", my: "ဒီနေ့ ရက်စွဲ ပြောတဲ့ voice note ပို့ခိုင်းမယ်",
          money: 0, next: "endWin",
          noteEn: "A live voice note with today's date is hard for a stolen account to fake on the spot.",
          noteMy: "ဒီနေ့ ရက်စွဲ ပါတဲ့ တိုက်ရိုက် voice note ကို ခိုးထားတဲ့ အကောင့်က ချက်ချင်း အတု လုပ်ဖို့ ခက်တယ်။" },
      ],
    },
    endWin: {
      id: "endWin", endKind: "win",
      endEn: "The 'friend' went silent. It was a scammer on a stolen account. Your verification habit saved your money, and your real friend still has a friend worth trusting.",
      endMy: "'သူငယ်ချင်း' တိတ်သွားတယ်။ အကောင့် ခိုးခံရပြီး လူလိမ်က ပို့နေတာပဲ။ အတည်ပြုတဲ့ အကျင့်က သင့် ငွေကို မဆုံးရှုံးစေတော့ဘူး။",
    },
    endLose1: {
      id: "endLose1", endKind: "lose",
      endEn: "The money is gone. Later your real friend posts: 'My account was hacked, ignore any money requests.' Verify first, even when it feels rude.",
      endMy: "ငွေ ပျောက်သွားပြီ။ နောက်မှ သူငယ်ချင်း အစစ်က တင်တယ်: 'ငါ့ အကောင့် hack ခံရတယ်၊ ငွေ တောင်းတာတွေ ignoreလုပ်လိုက်ပါ။' ရိုင်းတယ် ထင်ရပေမယ့် ဘာမှမလုပ်ခင် ငါဟုတ်မဟုတ် အရင်အတည်ပြုကြပါ။",
    },
    endLose2: {
      id: "endLose2", endKind: "lose",
      endEn: "Even a smaller amount teaches the scammer that pressure works on you. Next time the story will be bigger. Verify first, every time.",
      endMy: "ဖိအားနည်းနည်းပဲပေးရင်တောင် သင့်ဆီကနေလိုချင်တာရနိင်တယ်ဆိုတာကို လူလိမ်သိသွားပြီ။ နောက်တစ်ခါဆို ကိစ္စက ပိုကြီးလာလိမ့်မယ်။ အကြိမ်တိုင်း အရင် အတည်ပြုပါ။",
    },
  },
};

/* ================= Boss Fight: Scam Syndicate ================= */
export interface BossWave {
  kindEn: string; kindMy: string;
  attackEn: string; attackMy: string;
  shields: { en: string; my: string }[];   // exactly 3 options
  correct: number;
  hitEn: string; hitMy: string;           // shown when the right shield is picked
  hurtEn: string; hurtMy: string;         // shown when a wrong shield is picked
}
export const BOSS_WAVES: BossWave[] = [
  { kindEn: "Phishing link", kindMy: "Phishing လင့်ခ်",
    attackEn: "The boss fires a message: 'Prize won! Claim at kbzpay-prize-claim.com'. Pick your shield.",
    attackMy: "Boss က ဆုရရှိပြီဆိုတဲ့ မက်ဆေ့ ကိုပို့တယ်။ kbzpay-prize-claim.com မှာ ထုတ်ယူပါ'။ shield အသင့်ပြင်ထားပါ။",
    shields: [
      { en: "Tap the link fast, prizes expire", my: "လင့်ခ်ကို မြန်မြန် နှိပ်မယ်၊ ဆုက သက်တမ်း ကုန်တော့မယ်" },
      { en: "Check the domain: it is not kbzpay.com, ignore it", my: "Domain စစ်မယ်: kbzpay.com မဟုတ်ရင် ignoreလုပ်လိုက်ပါ" },
      { en: "Forward it to friends so they win too", my: "သူငယ်ချင်းတွေပါ ရအောင် ထပ်ပို့မယ်။" },
    ],
    correct: 1,
    hitEn: "Domain checked and rejected. The fake prize melts away.",
    hitMy: "Domain စစ်ပြီး ငြင်းလိုက်တယ်။ ဆု အတု မရှိတော့ဘူး။",
    hurtEn: "The link was a login trap. Your shield cracks.",
    hurtMy: "လင့်ခ်က login ထောင်ချောက်ပဲ။ shield ထိခိုက်သွားပြီ။" },
  { kindEn: "Scam call", kindMy: "အလိမ်အညာဖုန်း",
    attackEn: "The boss calls as 'the bank': 'Read me the code on your phone or lose everything!'",
    attackMy: "Boss က 'ဘဏ်' လိုမျိုး ဖုန်းဆက်တယ်: 'မင်းဖုန်းထဲက ကုဒ်ကို ဖတ်ပြပါ၊ မဟုတ်ရင် အားလုံးဆုံးရှုံးမယ်!'",
    shields: [
      { en: "Read the code, he sounds official", my: "ကုဒ် ဖတ်ပြမယ်၊ သူက တရားဝင် ပုံစံလို့ထင်တယ်" },
      { en: "Share half the code as a compromise", my: "တစ်ဝက် ပေးပြီး ညှိမယ်" },
      { en: "Hang up: banks never ask for codes", my: "ဖုန်းချမယ်: ဘဏ်က ကုဒ် ဘယ်တော့မှ မတောင်းဘူး" },
    ],
    correct: 2,
    hitEn: "Call ended. The boss's favourite trick bounces off.",
    hitMy: "ဖုန်း ချလိုက်တယ်။ Boss ရဲ့ အကြိုက်ဆုံး လှည့်ကွက် အလုပ်မဖြစ်တော့ဘူး။",
    hurtEn: "Any part of a code helps the attacker. Your shield cracks.",
    hurtMy: "ကုဒ် တစ်စိတ်တစ်ပိုင်း ပေးတာလည်း တိုက်ခိုက်သူကို ကူညီတာပဲ။" },
  { kindEn: "Permission grab", kindMy: "Permission လုယူမှု",
    attackEn: "The boss's flashlight app demands your contacts, SMS and location, always on.",
    attackMy: "Boss ရဲ့ flashlight app က contacts၊ SMS နဲ့ တည်နေရာ အမြဲဖွင့်ခွင့် တောင်းတယ်။",
    shields: [
      { en: "Deny all: a flashlight needs none of that", my: "အကုန် ငြင်းမယ်: appက အဲ့ဒါတွေ တစ်ခုမှ မလိုဘူး" },
      { en: "Allow location only, it seems harmless", my: "တည်နေရာပဲ ခွင့်ပြုမယ်၊ အန္တရာယ် မရှိလောက်ဘူး" },
      { en: "Allow all, apps know best", my: "အကုန် ခွင့်ပြုမယ်၊ app တွေက ပိုသိတယ်" },
    ],
    correct: 0,
    hitEn: "Denied. The greedy app starves with no data to steal.",
    hitMy: "ငြင်းလိုက်တယ်။ လောဘကြီးတဲ့ app ခိုးစရာ data မရတော့ဘူး။",
    hurtEn: "Every allowed permission is a door you opened yourself.",
    hurtMy: "ခွင့်ပြုတဲ့ permission တိုင်းက ကိုယ်တိုင် ဖွင့်ပေးတဲ့ တံခါးပဲ။" },
  { kindEn: "Fake friend", kindMy: "သူငယ်ချင်း အတု",
    attackEn: "A 'friend' begs: 'New number, send money now, do not call me, battery dying!'",
    attackMy: "'သူငယ်ချင်း'တစ်ယောက်လိုမျိုး နံပါတ်အသစ်နဲ့ တောင်းဆိုတယ်၊ အခု ငွေ ပို့ပေးပါ၊ ဖုန်း မဆက်ပါနဲ့၊ ဘက်ထရီ ကုန်တော့မယ်!'",
    shields: [
      { en: "Send it, a friend in need cannot wait", my: "ပို့လိုက်မယ်၊ ဒုက္ခရောက်တဲ့ သူငယ်ချင်းကို မစောင့်စေချင်ဘူး" },
      { en: "Verify on the old number first", my: "နံပါတ် အဟောင်းနဲ့ အရင် အတည်ပြုမယ်" },
      { en: "Ask in the group chat if it is really them", my: "Group chat မှာ သူတို့ အစစ် ဟုတ်လား မေးမယ်" },
    ],
    correct: 1,
    hitEn: "Verified and exposed. The stolen account goes dark.",
    hitMy: "အတည်ပြုပြီး ဖော်ထုတ်လိုက်တယ်။ ခိုးထားတဲ့ အကောင့် ပျောက်သွားပြီ။",
    hurtEn: "Urgency plus 'do not call' is the fraud signature. Your shield cracks.",
    hurtMy: "အလျင်စလို ခိုင်းပြီး 'ဖုန်း မဆက်ပါနဲ့' ဆိုတာက လိမ်နည်း တစ်မျိုးပဲ။" },
  { kindEn: "Deepfake video", kindMy: "Deepfake ဗီဒီယို",
    attackEn: "A video of a celebrity promises: 'This app doubled my money in a week!' His lips lag behind his voice.",
    attackMy: "နာမည်ကြီး တစ်ယောက်ရဲ့ ဗီဒီယို: 'ဒီ app က တစ်ပတ်အတွင်း သင့်ရဲ့ ငွေကို နှစ်ဆ ဖြစ်အောင်လုပ်ပေးလိမ့်မယ်!' သူ့ နှုတ်ခမ်းလှုပ်ရှားပုံက အသံထက်နောက်ကျနေတယ်။",
    shields: [
      { en: "Invest, a famous face cannot lie", my: "ရင်းနှီးမယ်၊ နာမည်ကြီးတစ်ယောက်ကတော့ မလိမ်လောက်ပါဘူး။" },
      { en: "Trust it, the video looks smooth", my: "ယုံလိုက်မယ်၊ ဗီဒီယိုကကြည့်ရတာအဆင်ပြေတယ်။" },
      { en: "Call it fake: lip lag plus a money promise is the deepfake pattern", my: "အတု လို့ သတ်မှတ်မယ်: နှုတ်ခမ်း လှုပ်ရှားတာနောက်ကျတာနဲ့ ငွေကိစ္စက deepfake ပုံစံပဲ။" },
    ],
    correct: 2,
    hitEn: "Deepfake named and shamed. The boss staggers.",
    hitMy: "Deepfake လိုခေါ်ပြီး တိုက်ခိုက်လိုက်မယ်။ Bossတော့ တုန်လှုပ်သွားပြီ။",
    hurtEn: "Famous faces are the easiest to fake now. Your shield cracks.",
    hurtMy: "နာမည်ကြီးတစ်ယောက်ဆိုတာက အခု အတု လုပ်ရ အလွယ်ဆုံးပဲ။ shield ထိခိုက်သွားပြီ။" },
  { kindEn: "Prize message", kindMy: "ဆု မက်ဆေ့",
    attackEn: "Final wave: 'You won a phone! Pay a 5,000 MMK delivery fee to this personal account to claim it.'",
    attackMy: "နောက်ဆုံး လှိုင်း: 'ဖုန်း ဆုပေါက်ပြီ! ထုတ်ယူဖို့ ကိုယ်ပိုင် အကောင့်ကို ပို့ခ ကျပ် ၅,၀၀၀ ပေးပါ။'",
    shields: [
      { en: "Real prizes never charge a fee into a personal account: refuse", my: "ဆု အစစ်က ကိုယ်ပိုင် အကောင့်ကို ပို့ခ မတောင်းဘူး: ငြင်းမယ်" },
      { en: "Pay it, 5,000 is cheap for a phone", my: "ပေးလိုက်မယ်၊ ဖုန်း တစ်လုံးအတွက် ၅,၀၀၀ ဆိုတာက ပေးရတာတန်တယ်။" },
      { en: "Ask the boss to halve the fee", my: "Boss ကို ပို့ခ တစ်ဝက် လျှော့ခိုင်းမယ်" },
    ],
    correct: 0,
    hitEn: "Refused. The Syndicate's last trick collapses, and the boss falls.",
    hitMy: "ငြင်းလိုက်တယ်။ Syndicate ရဲ့ နောက်ဆုံး trick ပျက်စီးပြီး Boss ကျရှုံးသွားပြီ။",
    hurtEn: "A fee for a 'free' prize is the oldest trick in the book.",
    hurtMy: "'အခမဲ့' ဆုအတွက် ငွေကြေးတောင်းခံခြင်းဟာ လှည့်ကွက်ဟောင်းတစ်ခုပဲ။" },
];

export const BOSS_MAX_HP = 100;
export const BOSS_HIT_DAMAGE = 20;   // 5 clean hits in 6 waves wins; one mistake is survivable
export const BOSS_PLAYER_HEARTS = 3;
