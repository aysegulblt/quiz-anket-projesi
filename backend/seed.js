const path = require("path");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const QuizResult = require("./models/QuizResult");

const DEMO_PASSWORD = "Quizora123!";
const CLEAN_ONLY = process.argv.includes("--clean-only");

const buildDate = (daysAgo, hour) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const pickIncorrectAnswer = (question, offset = 0) => {
  const incorrectOptions = question.options.filter(
    (option) => option !== question.correctAnswer
  );

  return incorrectOptions[offset % incorrectOptions.length];
};

const buildAnswers = (questions, score, offset = 0) => {
  const totalQuestions = questions.length;
  const correctIndexes = new Set(
    Array.from({ length: score }, (_, index) => (index + offset) % totalQuestions)
  );

  return questions.map((question, index) => {
    const isCorrect = correctIndexes.has(index);
    const selectedAnswer = isCorrect
      ? question.correctAnswer
      : pickIncorrectAnswer(question, index + offset);

    return {
      questionText: question.questionText,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
    };
  });
};

const DEMO_USERS = [
  {
    _id: "681000000000000000000001",
    name: "Ayse Kaya",
    email: "ayse.kaya@demo.quizora.local",
  },
  {
    _id: "681000000000000000000002",
    name: "Mehmet Demir",
    email: "mehmet.demir@demo.quizora.local",
  },
  {
    _id: "681000000000000000000003",
    name: "Zeynep Acar",
    email: "zeynep.acar@demo.quizora.local",
  },
  {
    _id: "681000000000000000000004",
    name: "Can Yildiz",
    email: "can.yildiz@demo.quizora.local",
  },
  {
    _id: "681000000000000000000005",
    name: "Elif Arslan",
    email: "elif.arslan@demo.quizora.local",
  },
];

const DEMO_QUIZZES = [
  {
    _id: "682000000000000000000001",
    title: "Web Programlama Temelleri",
    description:
      "Kategori: Web Programlama. HTML, CSS ve tarayici davranislarini kapsayan demo quiz.",
    createdBy: "681000000000000000000001",
    questions: [
      {
        questionText: "Semantik bir sayfa yapisi icin hangisi uygun bir HTML etiketi ornegidir?",
        options: ["<section>", "<font>", "<center>", "<blink>"],
        correctAnswer: "<section>",
      },
      {
        questionText: "Bir CSS sinifini secmek icin hangi isaret kullanilir?",
        options: [".", "#", "*", ":"],
        correctAnswer: ".",
      },
      {
        questionText: "HTTP durum kodu 404 neyi ifade eder?",
        options: ["Yetkisiz erisim", "Sunucu hatasi", "Kaynak bulunamadi", "Basarili istek"],
        correctAnswer: "Kaynak bulunamadi",
      },
      {
        questionText: "Tarayicida JavaScript hangi yapi ile tekrar eden islemler planlayabilir?",
        options: ["setTimeout", "querySelector", "localStorage", "fetch"],
        correctAnswer: "setTimeout",
      },
    ],
  },
  {
    _id: "682000000000000000000002",
    title: "Java Core Bilgisi",
    description:
      "Kategori: Java. JVM, koleksiyonlar ve nesne yonelimli programlama temelini olcen demo quiz.",
    createdBy: "681000000000000000000002",
    questions: [
      {
        questionText: "Java kodu hangi ortam tarafindan calistirilir?",
        options: ["JVM", "V8", "CLR", "CPython"],
        correctAnswer: "JVM",
      },
      {
        questionText: "Bir siniftan nesne olusturmak icin hangi anahtar kelime kullanilir?",
        options: ["new", "class", "static", "extends"],
        correctAnswer: "new",
      },
      {
        questionText: "ArrayList yapisinin en onemli ozelligi nedir?",
        options: [
          "Sabit boyutlu olmasi",
          "Dinamik olarak buyuyebilmesi",
          "Sadece sayi tutmasi",
          "Sadece thread-safe olmasi",
        ],
        correctAnswer: "Dinamik olarak buyuyebilmesi",
      },
      {
        questionText: "Interface icindeki metotlar varsayilan olarak nasil kabul edilir?",
        options: ["private", "protected", "public abstract", "final"],
        correctAnswer: "public abstract",
      },
    ],
  },
  {
    _id: "682000000000000000000003",
    title: "Python Pratikleri",
    description:
      "Kategori: Python. Temel dil ozellikleri ve gelistirme pratikleri icin olusturulmus demo quiz.",
    createdBy: "681000000000000000000003",
    questions: [
      {
        questionText: "Python'da degistirilemez veri tipi hangisidir?",
        options: ["list", "dict", "tuple", "set"],
        correctAnswer: "tuple",
      },
      {
        questionText: "Liste uretmek icin kisa ve okunabilir yapi hangisidir?",
        options: ["lambda", "list comprehension", "decorator", "generator exit"],
        correctAnswer: "list comprehension",
      },
      {
        questionText: "Sanal ortam yonetimi icin yaygin arac hangisidir?",
        options: ["venv", "npm", "gradle", "composer"],
        correctAnswer: "venv",
      },
      {
        questionText: "PEP 8 ne ile ilgilidir?",
        options: [
          "Veri tabani baglantisi",
          "Kod yazim stili",
          "Makine ogrenmesi algoritmasi",
          "Aglama protokolu",
        ],
        correctAnswer: "Kod yazim stili",
      },
    ],
  },
  {
    _id: "682000000000000000000004",
    title: "Yapay Zeka Giris",
    description:
      "Kategori: Yapay Zeka. Makine ogrenmesi ve model degerlendirme mantigini kapsayan demo quiz.",
    createdBy: "681000000000000000000004",
    questions: [
      {
        questionText: "Etiketli veri ile egitilen yaklasim hangisidir?",
        options: [
          "Supervised learning",
          "Reinforcement learning",
          "Clustering",
          "Rule engine",
        ],
        correctAnswer: "Supervised learning",
      },
      {
        questionText: "Bir modelin egitim verisine asiri uyum saglamasina ne ad verilir?",
        options: ["Overfitting", "Normalization", "Tokenization", "Caching"],
        correctAnswer: "Overfitting",
      },
      {
        questionText: "Transformer mimarisini guclu yapan mekanizma hangisidir?",
        options: ["Self-attention", "Hash map", "Binary search", "Recursion"],
        correctAnswer: "Self-attention",
      },
      {
        questionText: "Siniflandirma problemlerinde precision neyi olcer?",
        options: [
          "Dogru pozitif tahminlerin pozitif tahminlere orani",
          "Toplam tahmin sayisi",
          "Modelin egitim suresi",
          "Ozellik sayisi",
        ],
        correctAnswer: "Dogru pozitif tahminlerin pozitif tahminlere orani",
      },
    ],
  },
  {
    _id: "682000000000000000000005",
    title: "Siber Guvenlik Farkindaligi",
    description:
      "Kategori: Siber Güvenlik. Temel saldiri turleri ve korunma yontemlerini iceren demo quiz.",
    createdBy: "681000000000000000000005",
    questions: [
      {
        questionText: "Kimlik avina yonelik saldirilarin yaygin adi nedir?",
        options: ["Phishing", "Caching", "Sharding", "Minification"],
        correctAnswer: "Phishing",
      },
      {
        questionText: "MFA kisaltmasi guvenlikte neyi ifade eder?",
        options: [
          "Multi-factor authentication",
          "Mainframe access",
          "Managed file archive",
          "Manual firewall action",
        ],
        correctAnswer: "Multi-factor authentication",
      },
      {
        questionText: "SQL injection riskini azaltmak icin hangi yontem uygundur?",
        options: [
          "Parametreli sorgular kullanmak",
          "Tum inputlari loglamak",
          "Sadece GET istegi kullanmak",
          "Sunucu saatini gizlemek",
        ],
        correctAnswer: "Parametreli sorgular kullanmak",
      },
      {
        questionText: "Hashleme ile sifreleme arasindaki temel fark nedir?",
        options: [
          "Hashleme tek yonludur",
          "Sifreleme her zaman daha hizlidir",
          "Hashleme sadece resimler icindir",
          "Sifreleme geri dondurulemez",
        ],
        correctAnswer: "Hashleme tek yonludur",
      },
    ],
  },
  {
    _id: "682000000000000000000006",
    title: "Ag Sistemleri Temelleri",
    description:
      "Kategori: Ağ Sistemleri. Protokoller, adresleme ve baglanti mantigini olcen demo quiz.",
    createdBy: "681000000000000000000001",
    questions: [
      {
        questionText: "IP adresini mantiksal olarak hangi OSI katmani kullanir?",
        options: ["Network", "Physical", "Session", "Presentation"],
        correctAnswer: "Network",
      },
      {
        questionText: "Alan adlarini IP adreslerine cevirmekten hangi servis sorumludur?",
        options: ["DNS", "DHCP", "SSH", "FTP"],
        correctAnswer: "DNS",
      },
      {
        questionText: "TCP'nin UDP'ye gore temel avantaji nedir?",
        options: [
          "Baglanti guvenilirligi saglamasi",
          "Daha az bant kullanmasi",
          "Her zaman daha hizli olmasi",
          "Sifir gecikme sunmasi",
        ],
        correctAnswer: "Baglanti guvenilirligi saglamasi",
      },
      {
        questionText: "255.255.255.0 maskesi yaygin olarak kac host biti birakir?",
        options: ["8", "16", "24", "32"],
        correctAnswer: "8",
      },
    ],
  },
  {
    _id: "682000000000000000000007",
    title: "Veri Tabani Temelleri",
    description:
      "Kategori: Veri Tabanı. SQL, normalizasyon ve veri modelemesini kapsayan demo quiz.",
    createdBy: "681000000000000000000002",
    questions: [
      {
        questionText: "Primary key bir tabloda neyi garanti eder?",
        options: [
          "Kayitlarin benzersiz olmasini",
          "Tum kolonlarin null olmasini",
          "Tablonun sadece okunabilir olmasini",
          "Verinin sifrelenmesini",
        ],
        correctAnswer: "Kayitlarin benzersiz olmasini",
      },
      {
        questionText: "Index kullanmanin temel amaci nedir?",
        options: [
          "Sorgu performansini iyilestirmek",
          "Dosya boyutunu sifirlamak",
          "Tum veriyi silmek",
          "Sadece tablo adini degistirmek",
        ],
        correctAnswer: "Sorgu performansini iyilestirmek",
      },
      {
        questionText: "INNER JOIN ne yapar?",
        options: [
          "Eslesen kayitlari birlestirir",
          "Tum tablolari siler",
          "Sadece sol tabloyu dondurur",
          "Sadece indeksleri kopyalar",
        ],
        correctAnswer: "Eslesen kayitlari birlestirir",
      },
      {
        questionText: "Normalizasyonun hedeflerinden biri hangisidir?",
        options: [
          "Veri tekrarini azaltmak",
          "CPU hizini artirmak",
          "Sunucu kablolamasini sadeletirmek",
          "Tarayici uyumlulugunu arttirmak",
        ],
        correctAnswer: "Veri tekrarini azaltmak",
      },
    ],
  },
  {
    _id: "682000000000000000000008",
    title: "React Bilesen Mantigi",
    description:
      "Kategori: React. State, JSX ve component yapisini olcen demo quiz.",
    createdBy: "681000000000000000000003",
    questions: [
      {
        questionText: "React'te yerel component durumunu yonetmek icin yaygin hook hangisidir?",
        options: ["useState", "useRouter", "usePathname", "useClass"],
        correctAnswer: "useState",
      },
      {
        questionText: "Liste render ederken key prop neden kullanilir?",
        options: [
          "React'in elemanlari takip etmesini saglamak icin",
          "CSS stillerini zorlamak icin",
          "API anahtari saklamak icin",
          "Component'i dondurmek icin",
        ],
        correctAnswer: "React'in elemanlari takip etmesini saglamak icin",
      },
      {
        questionText: "JSX teknik olarak neye donusur?",
        options: [
          "JavaScript fonksiyon cagrilarina",
          "SQL sorgusuna",
          "Binary dosyaya",
          "Tarayici eklentisine",
        ],
        correctAnswer: "JavaScript fonksiyon cagrilarina",
      },
      {
        questionText: "Parent component child component'e veri nasil gonderir?",
        options: ["props ile", "sadece context ile", "localStorage ile", "middleware ile"],
        correctAnswer: "props ile",
      },
    ],
  },
  {
    _id: "682000000000000000000009",
    title: "Node.js Backend Akisi",
    description:
      "Kategori: Node.js. Event loop ve paket ekosistemi uzerine kurulu demo quiz.",
    createdBy: "681000000000000000000004",
    questions: [
      {
        questionText: "Node.js hangi calisma modeliyle taninir?",
        options: [
          "Event-driven, non-blocking I/O",
          "Sadece blocking I/O",
          "Sadece multi-thread rendering",
          "GUI first architecture",
        ],
        correctAnswer: "Event-driven, non-blocking I/O",
      },
      {
        questionText: "Projede bagimlilik yonetimi icin yaygin dosya hangisidir?",
        options: ["package.json", "Dockerfile", "tsconfig.json", "README.md"],
        correctAnswer: "package.json",
      },
      {
        questionText: "CommonJS modul sisteminde import icin hangi yapi kullanilir?",
        options: ["require()", "import type", "include()", "attach()"],
        correctAnswer: "require()",
      },
      {
        questionText: "Express middleware hangi amaca hizmet eder?",
        options: [
          "Request-response dongusunde araya giren islemler icin",
          "Sadece veritabani migrasyonu yapmak icin",
          "Sadece frontend stil yazmak icin",
          "CPU cekirdegini artirmak icin",
        ],
        correctAnswer: "Request-response dongusunde araya giren islemler icin",
      },
    ],
  },
  {
    _id: "68200000000000000000000a",
    title: "Genel Kultur Karisik",
    description:
      "Kategori: Genel Kültür. Farkli alanlardan temel bilgi sorulari iceren demo quiz.",
    createdBy: "681000000000000000000005",
    questions: [
      {
        questionText: "Dunya'nin en buyuk okyanusu hangisidir?",
        options: ["Pasifik Okyanusu", "Atlas Okyanusu", "Hint Okyanusu", "Arktik Okyanusu"],
        correctAnswer: "Pasifik Okyanusu",
      },
      {
        questionText: "Ay'a ilk ayak basan insan kimdir?",
        options: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "Alan Shepard"],
        correctAnswer: "Neil Armstrong",
      },
      {
        questionText: "Bir yilin artik yil olabilmesi icin yaygin kural nedir?",
        options: [
          "4'e bolunebilmesi",
          "5'e bolunebilmesi",
          "7 ile carpiliyor olmasi",
          "Her zaman 365 gun surmesi",
        ],
        correctAnswer: "4'e bolunebilmesi",
      },
      {
        questionText: "Turkiye'nin baskenti hangisidir?",
        options: ["Ankara", "Istanbul", "Izmir", "Bursa"],
        correctAnswer: "Ankara",
      },
    ],
  },
];

const DEMO_RESULT_BLUEPRINTS = [
  {
    _id: "683000000000000000000001",
    user: "681000000000000000000001",
    quiz: "682000000000000000000001",
    score: 4,
    createdAt: buildDate(60, 10),
  },
  {
    _id: "683000000000000000000002",
    user: "681000000000000000000001",
    quiz: "682000000000000000000008",
    score: 3,
    createdAt: buildDate(52, 14),
  },
  {
    _id: "683000000000000000000003",
    user: "681000000000000000000001",
    quiz: "68200000000000000000000a",
    score: 2,
    createdAt: buildDate(10, 9),
  },
  {
    _id: "683000000000000000000004",
    user: "681000000000000000000002",
    quiz: "682000000000000000000002",
    score: 3,
    createdAt: buildDate(58, 11),
  },
  {
    _id: "683000000000000000000005",
    user: "681000000000000000000002",
    quiz: "682000000000000000000005",
    score: 1,
    createdAt: buildDate(34, 16),
  },
  {
    _id: "683000000000000000000006",
    user: "681000000000000000000002",
    quiz: "682000000000000000000009",
    score: 4,
    createdAt: buildDate(6, 13),
  },
  {
    _id: "683000000000000000000007",
    user: "681000000000000000000003",
    quiz: "682000000000000000000003",
    score: 2,
    createdAt: buildDate(49, 12),
  },
  {
    _id: "683000000000000000000008",
    user: "681000000000000000000003",
    quiz: "682000000000000000000006",
    score: 0,
    createdAt: buildDate(28, 15),
  },
  {
    _id: "683000000000000000000009",
    user: "681000000000000000000003",
    quiz: "682000000000000000000007",
    score: 3,
    createdAt: buildDate(8, 10),
  },
  {
    _id: "68300000000000000000000a",
    user: "681000000000000000000004",
    quiz: "682000000000000000000004",
    score: 4,
    createdAt: buildDate(43, 9),
  },
  {
    _id: "68300000000000000000000b",
    user: "681000000000000000000004",
    quiz: "682000000000000000000001",
    score: 1,
    createdAt: buildDate(20, 17),
  },
  {
    _id: "68300000000000000000000c",
    user: "681000000000000000000004",
    quiz: "682000000000000000000008",
    score: 2,
    createdAt: buildDate(5, 11),
  },
  {
    _id: "68300000000000000000000d",
    user: "681000000000000000000005",
    quiz: "682000000000000000000005",
    score: 3,
    createdAt: buildDate(37, 14),
  },
  {
    _id: "68300000000000000000000e",
    user: "681000000000000000000005",
    quiz: "682000000000000000000002",
    score: 2,
    createdAt: buildDate(15, 12),
  },
  {
    _id: "68300000000000000000000f",
    user: "681000000000000000000005",
    quiz: "68200000000000000000000a",
    score: 4,
    createdAt: buildDate(2, 18),
  },
];

const DEMO_USER_IDS = DEMO_USERS.map((user) => user._id);
const DEMO_QUIZ_IDS = DEMO_QUIZZES.map((quiz) => quiz._id);
const DEMO_RESULT_IDS = DEMO_RESULT_BLUEPRINTS.map((result) => result._id);

const ensureEnvironment = () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in backend/.env");
  }
};

const buildUserDocuments = async () => {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);

  return DEMO_USERS.map((user) => ({
    ...user,
    password,
  }));
};

const buildQuizDocuments = () => {
  return DEMO_QUIZZES.map((quiz) => ({
    ...quiz,
  }));
};

const buildResultDocuments = () => {
  const quizzesById = new Map(DEMO_QUIZZES.map((quiz) => [quiz._id, quiz]));

  return DEMO_RESULT_BLUEPRINTS.map((result, index) => {
    const quiz = quizzesById.get(result.quiz);

    if (!quiz) {
      throw new Error(`Quiz not found for seed result: ${result.quiz}`);
    }

    return {
      _id: result._id,
      user: result.user,
      quiz: result.quiz,
      score: result.score,
      totalQuestions: quiz.questions.length,
      answers: buildAnswers(quiz.questions, result.score, index),
      createdAt: result.createdAt,
      updatedAt: result.createdAt,
    };
  });
};

const cleanDemoData = async (session) => {
  await QuizResult.deleteMany({
    $or: [
      { _id: { $in: DEMO_RESULT_IDS } },
      { user: { $in: DEMO_USER_IDS } },
      { quiz: { $in: DEMO_QUIZ_IDS } },
    ],
  }).session(session);

  await Quiz.deleteMany({ _id: { $in: DEMO_QUIZ_IDS } }).session(session);
  await User.deleteMany({ _id: { $in: DEMO_USER_IDS } }).session(session);
};

const seedDatabase = async () => {
  ensureEnvironment();
  await connectDB();

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      console.log("[seed] Existing demo data is being cleaned...");
      await cleanDemoData(session);

      if (CLEAN_ONLY) {
        return;
      }

      const users = await buildUserDocuments();
      const quizzes = buildQuizDocuments();
      const results = buildResultDocuments();

      await User.insertMany(users, { session });
      await Quiz.insertMany(quizzes, { session });
      await QuizResult.insertMany(results, { session });
    });

    if (CLEAN_ONLY) {
      console.log("[seed] Demo data cleaned successfully.");
    } else {
      console.log(
        `[seed] Seed completed: ${DEMO_USERS.length} users, ${DEMO_QUIZZES.length} quizzes, ${DEMO_RESULT_BLUEPRINTS.length} results.`
      );
      console.log(`[seed] Demo user password: ${DEMO_PASSWORD}`);
    }
  } catch (error) {
    console.error("[seed] Seed process failed:", error.message);
    process.exitCode = 1;
  } finally {
    await session.endSession();
    await mongoose.disconnect();
  }
};

seedDatabase();
