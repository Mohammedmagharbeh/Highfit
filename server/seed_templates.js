const mongoose = require("mongoose");
require("dotenv").config();
const FitnessPlan = require("./models/FitnessPlan");
const NutritionProgram = require("./models/NutritionProgram");

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Base diet for all programs
const baseDiet = {
  desc: "خيارات متعددة لوجبات متوازنة يومياً. قم باختيار وجبة واحدة من كل قسم للحفاظ على سعراتك.",
  meals: [
    {
      type: "وجبة الإفطار",
      calories: "335 - 430",
      options: [
        { desc: "200غ زبادي يوناني لايت + 10 غ مكسرات ني + فانيلا أو قرفة + 120 غ بطاطا حلوة مشوية/مسلوقة", c: 335, p: 23, carbs: 33, f: 12 },
        { desc: "بيض مسلوق عدد 2 + 180 غرام بطاطا مسلوق/مشوي + خيار أو خس", c: 380, p: 24, carbs: 38, f: 15 },
        { desc: "علبة تونا بالماء (مصفاة) + 2 توست أسمر + 40غ افوكادو + سلطة خشنة (خيار مع خس وبندورة عصرة ليمون ورشة فلفل اسود)", c: 390, p: 30, carbs: 32, f: 16 },
        { desc: "حمص مسلوق 120 غ + بطاطا مسلوقة 120 غ + 1ملعقة كبيرة زيت زيتون + عصرة ليمون ورشة كمون + خيار أو بندورة", c: 430, p: 18, carbs: 55, f: 15 }
      ]
    },
    {
      type: "سناك 1",
      calories: "190 - 260",
      options: [
        { desc: "تفاحة + 15 غ مكسرات ني", c: 190, p: 4, carbs: 22, f: 10 },
        { desc: "شوفان 40غ + 150 مل حليب خالي الدسم +1م صغيرة عسل+فراولة 80غ+ رشة قرفة", c: 260, p: 10, carbs: 46, f: 4 }
      ]
    },
    {
      type: "وجبة الغداء",
      calories: "395 - 460",
      options: [
        { desc: "بطاطا مسلوقة/مشوية 200 غ + سمك مشوي 150غ+سلطة خضراء + 1م صغيرة زيت زيتون", c: 395, p: 34, carbs: 42, f: 10 },
        { desc: "علبة تونا بالماء(مصفاة)+عصرة ليمون ورشة فلفل اسود +بطاطا حلوة مسلوقة/مشوية 200غ+سلطة خضراء + 1م صغيرة طحينية", c: 420, p: 28, carbs: 50, f: 12 },
        { desc: "رز مسلوق 150 غرام , صدر دجاج 150 غرام + سلطة خضراء + 1م صغيرة زيت زيتون", c: 450, p: 40, carbs: 48, f: 11 },
        { desc: "برغل مسلوق 150 غرام , لحم بقري مشوي 130 غرام + سلطة خضراء + 1م صغيرة زيت زيتون", c: 460, p: 34, carbs: 47, f: 15 }
      ]
    },
    {
      type: "سناك 2",
      calories: "175 - 280",
      options: [
        { desc: "شوكولاته دارك 10غ + مكسرات ني 15غ", c: 175, p: 3, carbs: 12, f: 13 },
        { desc: "موزة + 20 غ زبدة فول سوداني", c: 280, p: 7, carbs: 22, f: 18 }
      ]
    },
    {
      type: "وجبة العشاء",
      calories: "115 - 285",
      options: [
        { desc: "زبادي يوناني خالي الدسم 200غ + 1م كبيرة بذور الشيا", c: 115, p: 20, carbs: 9, f: 0 },
        { desc: "سمك مشوي 150 غ + سلطة خضراء + 1م صغيرة زيت زيتون", c: 260, p: 32, carbs: 8, f: 11 },
        { desc: "صدر دجاج مشوي 150غ+خضار مسلوقة + 1م صغيرة زيت زيتون", c: 285, p: 36, carbs: 10, f: 11 }
      ]
    }
  ]
};

const plans = [
  {
    planId: "beginner",
    title: "Beginner Template",
    arabicTitle: "برنامج المبتدئين - بناء قاعدة عضلية",
    desc: "الأحماء علي جهاز المشي 5 دقائق قبل التمرين\nالالتزام بأوزان متوسطة لعدم التعرض الي الاصابات",
    training: [
      {
        day: "اليوم الاول ( ضهر+ باي)",
        cardio: "كارديو ( جهاز المشي ) 30 دقيقة سرعة 3.5",
        exercises: [
          { name: "سحب lat واسع ( B32 )", sets: 3, reps: "10 عدات" },
          { name: "سحب جالس قبضة مثلث( B32 )", sets: 3, reps: "10 عدات" },
          { name: "تجديف T بار واسع", sets: 3, reps: "10 عدات" },
          { name: "قطنية بوزن الجسم", sets: 3, reps: "10 عدات" },
          { name: "باي بار واسع EZ", sets: 3, reps: "10 عدات" },
          { name: "هامر دامبل", sets: 3, reps: "10 عدات" },
        ]
      },
      {
        day: "اليوم الثاني ( صدر+ تراي)",
        cardio: "كارديو ( جهاز الكروس ) 20 دقيقة ارتفاع 4 مقاومة 6",
        exercises: [
          { name: "صدر مستوي جهاز (CH36)", sets: 3, reps: "10 عدات" },
          { name: "صدر علوي جهاز (CH35)", sets: 3, reps: "10 عدات" },
          { name: "تجميع فلاي ( 38 CH )", sets: 3, reps: "10 عدات" },
          { name: "تراي كابل قبضة مستقيمة", sets: 3, reps: "10 عدات" },
          { name: "تراي جهاز ( A35 )", sets: 3, reps: "10 عدات" },
        ]
      },
      {
        day: "اليوم الثالث ( أكتاف + سواعد)",
        cardio: "كارديو ( جهاز المشي ) 30 دقيقة سرعة 3.5",
        exercises: [
          { name: "دفع امامي جهاز ( S32 )", sets: 3, reps: "10 عدات" },
          { name: "رفرفة جانبي دامبل", sets: 3, reps: "10 عدات" },
          { name: "فلاي خلفي جهاز(S36)", sets: 3, reps: "10 عدات" },
          { name: "ترابيس دامبل", sets: 3, reps: "10 عدات" },
          { name: "سواعد جهاز", sets: 3, reps: "10 عدات" },
        ]
      },
      {
        day: "اليوم الرابع (أرجل + معده )",
        cardio: "كارديو ( بسكليت ) 20 دقيقة مقاومة 2",
        exercises: [
          { name: "استطالة امامي جهاز ( L32 )", sets: 3, reps: "15 عدات" },
          { name: "ثني خلفي جهاز ( 33 L )", sets: 3, reps: "15 عدات" },
          { name: "دفاش جالس جهاز ( L35 )", sets: 3, reps: "15 عدات" },
          { name: "بطات جهاز ( L40 )", sets: 3, reps: "15 عدات" },
          { name: "معدة علوي جهاز ( A46 )", sets: 3, reps: "15 عدات" },
          { name: "معدة سفلي جهاز ( A37 )", sets: 3, reps: "15 عدات" },
        ]
      }
    ]
  },
  {
    planId: "advanced",
    title: "Advanced Template",
    arabicTitle: "برنامج المتقدمين - تطوير القوة والكتلة",
    desc: "الأحماء علي جهاز المشي 5 دقائق قبل التمرين\nالالتزام بأوزان مناسبة لعدم التعرض الي الاصابات",
    training: [
      {
        day: "اليوم الاول ( ضهر+ باي)",
        cardio: "كارديو ( جهاز المشي ) 20 دقيقة ارتفاع 4 سرعة 3",
        exercises: [
          { name: "سحب lat واسع ( B32 )", sets: 3, reps: "10 عدات" },
          { name: "منشار دامبل حر", sets: 3, reps: "10+10 عدات" },
          { name: "تجديف بالبار حر", sets: 3, reps: "10 عدات" },
          { name: "منشار علوي فردي جهاز", sets: 3, reps: "10 عدات" },
          { name: "قطنية بار حر", sets: 3, reps: "10 عدات" },
          { name: "باي تكوير جهاز", sets: 3, reps: "10 عدات" },
          { name: "هامر ( داخلي + خارجي ) دامبل", sets: 3, reps: "10 عدات" },
        ]
      },
      {
        day: "اليوم الثاني ( صدر+ تراي)",
        cardio: "كارديو ( جهاز الكروس ) 15 دقيقة ارتفاع 4 مقاومة 4",
        exercises: [
          { name: "صدر مستوي جهاز بناتا", sets: 3, reps: "10 عدات" },
          { name: "صدر علوي دامبل + تفتيح دامبل", sets: 3, reps: "10 عدات" },
          { name: "صدر سفلي جهاز بناتا", sets: 3, reps: "10 عدات" },
          { name: "تجميع فلاي ( 38 CH )", sets: 3, reps: "10 عدات" },
          { name: "تراي كابل قبضة ( ثمانية )", sets: 3, reps: "10 عدات" },
          { name: "تراي اعلي الرأس كابل ( حبل )", sets: 3, reps: "10 عدات" },
        ]
      },
      {
        day: "اليوم الثالث ( أكتاف + سواعد)",
        cardio: "كارديو ( جهاز المشي ) 20 دقيقة ارتفاع 4 سرعة 3",
        exercises: [
          { name: "دفع امامي جالس دامبل", sets: 3, reps: "10 عدات" },
          { name: "رفرفة جانبي دامبل", sets: 3, reps: "15 عدات" },
          { name: "رفرفة امامي كابل", sets: 3, reps: "15 عدات" },
          { name: "فلاي خلفي كابل ( S36 )", sets: 3, reps: "12 عدات" },
          { name: "ترابيس دامبل", sets: 3, reps: "15 عدات" },
          { name: "سواعد جهاز", sets: 3, reps: "15+15 عدات" },
        ]
      },
      {
        day: "اليوم الرابع (أرجل + معده )",
        cardio: "كارديو ( بسكليت ) 15 دقيقة مقاومة 4",
        exercises: [
          { name: "استطالة امامي جهاز ( L32 ) + سكوات بالطاره", sets: 3, reps: "10+10 عدات" },
          { name: "ثني خلفي جهاز ( 33 L )", sets: 3, reps: "10 عدات" },
          { name: "دفاش مائل جهاز ( L36 )", sets: 3, reps: "10 عدات" },
          { name: "فتح + ضم جهاز ( L37 )", sets: 3, reps: "10 عدات" },
          { name: "بطات جهاز ( L40 )", sets: 3, reps: "10 عدات" },
          { name: "معدة علوي ارضي حر + سفلي", sets: 3, reps: "15+15 عدات" },
          { name: "خواصر ارضي + بلانك", sets: 3, reps: "1 دقيقة + 15 عدات" },
        ]
      }
    ]
  },
  {
    planId: "athlete",
    title: "Athlete Template",
    arabicTitle: "برنامج الرياضيين المحترفين (تهيئة متقدمة)",
    desc: "الأحماء علي جهاز المشي 5 دقائق قبل التمرين\nالالتزام بأوزان خفيفة لعدم التعرض الي الاصابات",
    training: [
      {
        day: "اليوم الاول ( ضهر+ باي)",
        cardio: "كارديو ( جهاز المشي ) 20 دقيقة",
        exercises: [
          { name: "سحب lat واسع ( B32 )", sets: 2, reps: "10 عدات" },
          { name: "سحب جالس قبضة مثلث( B32 )", sets: 2, reps: "10 عدات" },
          { name: "تجديف T بار واسع", sets: 2, reps: "10 عدات" },
          { name: "قطنية بوزن الجسم", sets: 2, reps: "10 عدات" },
          { name: "باي بار واسع EZ", sets: 2, reps: "10 عدات" },
          { name: "هامر دامبل", sets: 2, reps: "10 عدات" },
        ]
      },
      {
        day: "اليوم الثاني ( صدر+ تراي)",
        cardio: "كارديو ( جهاز الكروس ) 10 دقيقة ارتفاع 4 مقاومة 4",
        exercises: [
          { name: "صدر مستوي جهاز (CH36)", sets: 2, reps: "10 عدات" },
          { name: "صدر علوي جهاز (CH35)", sets: 2, reps: "10 عدات" },
          { name: "تجميع فلاي ( 38 CH )", sets: 2, reps: "10 عدات" },
          { name: "تراي كابل قبضة مستقيمة", sets: 2, reps: "10 عدات" },
          { name: "تراي جهاز ( A35 )", sets: 2, reps: "10 عدات" },
        ]
      },
      {
        day: "اليوم الثالث ( أكتاف + سواعد)",
        cardio: "كارديو ( جهاز المشي ) 20 دقيقة",
        exercises: [
          { name: "دفع امامي جهاز ( S32 )", sets: 2, reps: "10 عدات" },
          { name: "رفرفة جانبي دامبل", sets: 2, reps: "10 عدات" },
          { name: "فلاي خلفي جهاز(S36)", sets: 2, reps: "10 عدات" },
          { name: "ترابيس دامبل", sets: 2, reps: "10 عدات" },
          { name: "سواعد جهاز", sets: 2, reps: "10 عدات" },
        ]
      },
      {
        day: "اليوم الرابع (أرجل + معده )",
        cardio: "كارديو ( بسكليت ) 15 دقيقة مقاومة 1",
        exercises: [
          { name: "استطالة امامي جهاز ( L32 )", sets: 2, reps: "15 عدات" },
          { name: "ثني خلفي جهاز ( 33 L )", sets: 2, reps: "15 عدات" },
          { name: "دفاش جالس جهاز ( L35 )", sets: 2, reps: "15 عدات" },
          { name: "بطات جهاز ( L40 )", sets: 2, reps: "15 عدات" },
          { name: "معدة علوي جهاز ( A46 )", sets: 2, reps: "15 عدات" },
          { name: "معدة سفلي جهاز ( A37 )", sets: 2, reps: "15 عدات" },
        ]
      }
    ]
  }
];

const nutritions = [
  {
    programId: "beginner",
    title: "تغذية برنامج المبتدئين بناء قاعدة (1500 - 1900 سعرة)",
    ...baseDiet
  },
  {
    programId: "advanced",
    title: "تغذية برنامج المتقدمين (1500 - 1900 سعرة)",
    ...baseDiet
  },
  {
    programId: "athlete",
    title: "تغذية برنامج الرياضيين المحترفين (1500 - 1900 سعرة)",
    ...baseDiet
  }
];

const seedData = async () => {
  try {
    for (const plan of plans) {
      await FitnessPlan.findOneAndUpdate({ planId: plan.planId }, plan, { upsert: true, new: true });
    }
    console.log("Fitness plans seeded successfully!");

    for (const n of nutritions) {
      await NutritionProgram.findOneAndUpdate({ programId: n.programId }, n, { upsert: true, new: true });
    }
    console.log("Nutrition programs seeded successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

seedData();
