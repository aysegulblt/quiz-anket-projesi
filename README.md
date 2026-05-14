# Quizora

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-0468D7?style=flat&logo=render&logoColor=white)

Quizora, kullanıcıların quiz oluşturabildiği, quiz çözebildiği ve sonuç geçmişini takip edebildiği modern bir MERN Stack uygulamasıdır. Platform; kullanıcıya özel quiz yönetimi sunarken bilgi ölçme, mini sınav ve anket benzeri senaryolara genişletilebilecek esnek bir yapı üzerine kuruludur.

## 1. Proje Tanıtımı

Quizora, teknik veya genel bilgi odaklı quiz içeriklerinin tek bir platformda yönetilmesini hedefleyen tam yığın bir web uygulamasıdır. Kullanıcılar hesap oluşturabilir, sisteme giriş yapabilir, quizleri listeleyebilir, quiz çözebilir, kendi quizlerini oluşturabilir ve geçmiş sonuçlarını görüntüleyebilir.

Proje iki ana parçadan oluşur:

- `frontend`: React + Vite ile geliştirilmiş kullanıcı arayüzü
- `backend`: Express.js, JWT ve MongoDB Atlas ile çalışan REST API

## 2. Özellikler

- JWT authentication
- Quiz oluşturma
- Quiz çözme
- Sonuç geçmişi görüntüleme
- Kullanıcıya özel quiz yönetimi
- Responsive tasarım
- Seed ve demo veri sistemi
- Protected routes
- RESTful API architecture
- MongoDB ref/populate ilişkileri
- Token-based route protection
- Frontend ve backend validasyonları
- Production-ready deployment structure

## 3. Kullanılan Teknolojiler

| Katman | Teknolojiler |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, React Hot Toast, Context API |
| Backend | Node.js, Express.js, JWT Authentication, bcryptjs, Mongoose ODM |
| Database | MongoDB Atlas, Mongoose |
| Deploy | Vercel, Render |

## 4. Sistem Mimarisi

Quizora aşağıdaki akışla çalışır:

```text
Browser
   |
   v
React + Vite Frontend
   |
   | Axios / REST API
   v
Node.js + Express Backend
   |
   | Mongoose
   v
MongoDB Atlas
```

- Frontend kullanıcı etkileşimini yönetir.
- Backend auth, quiz ve sonuç işlemlerini REST API ile sunar.
- Protected endpointler JWT ile korunur.
- Veriler MongoDB Atlas üzerinde saklanır.

## 5. Deployment Architecture

| Katman | Platform |
| --- | --- |
| Frontend | Vercel |
| Backend API | Render |
| Database | MongoDB Atlas |

Frontend Vercel üzerinde çalışır. API istekleri Render üzerindeki Express backend'e gönderilir. Backend verileri MongoDB Atlas üzerinde saklar.

## 6. Kurulum

### Ön Koşullar

- Node.js 18+
- npm
- MongoDB Atlas bağlantı bilgisi

### Repo Klonlama

```bash
git clone https://github.com/aysegulblt/quiz-anket-projesi.git
cd quiz-anket-projesi
```

### Backend Bağımlılıklarını Kurma

```bash
cd backend
npm install
```

### Frontend Bağımlılıklarını Kurma

```bash
cd ../frontend
npm install
```

### Backend Geliştirme Sunucusunu Başlatma

```bash
cd backend
npm run dev
```

### Frontend Geliştirme Sunucusunu Başlatma

```bash
cd frontend
npm run dev
```

### Demo Verileri Yükleme

```bash
cd backend
npm run seed
```

Seed script'i:

- demo kullanıcılar oluşturur
- demo quizler ve sonuç kayıtları üretir
- tekrar çalıştırıldığında duplicate veri oluşturmaz
- önce eski demo verileri temizleyip yeniden yükleyebilir

## 7. Environment Variables

### Backend

`backend/.env`

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

| Değişken | Açıklama |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas bağlantı adresi |
| `JWT_SECRET` | JWT token imzalama anahtarı |
| `PORT` | Backend servis portu |

### Frontend

`frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

| Değişken | Açıklama |
| --- | --- |
| `VITE_API_URL` | Frontend'in konuşacağı backend API tabanı |

Production notu: `VITE_API_URL`, production ortamında Render backend API adresine göre güncellenmelidir.

## 8. Demo Kullanıcı

| Alan | Değer |
| --- | --- |
| Ad Soyad | Ayse Kaya |
| Email | `ayse.kaya@demo.quizora.local` |
| Şifre | `Quizora123!` |

- Tüm demo kullanıcılar aynı şifreyi kullanır.
- Demo veriler `npm run seed` komutu ile tekrar yüklenebilir.

## 9. API Endpointleri

### Auth

| Method | Endpoint | Açıklama | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Yeni kullanıcı kaydı oluşturur | Hayır |
| `POST` | `/api/auth/login` | Kullanıcı girişi yapar ve JWT token döner | Hayır |
| `GET` | `/api/auth/profile` | Giriş yapan kullanıcının profilini döner | Evet |

### Quiz

| Method | Endpoint | Açıklama | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/quizzes` | Tüm quizleri listeler | Hayır |
| `GET` | `/api/quizzes/:id` | Tekil quiz detayını döner | Hayır |
| `POST` | `/api/quizzes` | Yeni quiz oluşturur | Evet |
| `PUT` | `/api/quizzes/:id` | Kullanıcının kendi quizini günceller | Evet |
| `DELETE` | `/api/quizzes/:id` | Kullanıcının kendi quizini siler | Evet |
| `GET` | `/api/quizzes/my/quizzes` | Giriş yapan kullanıcının quizlerini listeler | Evet |

### Result

| Method | Endpoint | Açıklama | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/results` | Quiz çözüm sonucunu kaydeder | Evet |
| `GET` | `/api/results/my-results` | Kullanıcının sonuç geçmişini listeler | Evet |

## 10. Klasör Yapısı

```text
quiz-anket-projesi/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── QuizResult.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   └── resultRoutes.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vercel.json
│   └── package.json
├── package.json
└── README.md
```

## 11. Canlı Linkler

| Servis | URL |
| --- | --- |
| Frontend | [Quizora Frontend](https://quiz-anket-projesi.vercel.app/) |
| Backend | [Quizora Backend API](https://quizora-backend-rzby.onrender.com) |

## 12. Ekran Görüntüleri

Bu bölüm için şimdilik placeholder tablo bırakılmıştır. İlgili dosyalar eklendiğinde aynı yapı korunarak güncellenebilir.

| Ekran | Placeholder |
| --- | --- |
| Home Page | `docs/screenshots/home-page.png` |
| Quiz List | `docs/screenshots/quiz-list.png` |
| Quiz Detail | `docs/screenshots/quiz-detail.png` |
| Create Quiz | `docs/screenshots/create-quiz.png` |
| My Results | `docs/screenshots/my-results.png` |

## 13. Gelecek Geliştirmeler

- kategori sistemi
- leaderboard
- zamanlı quiz
- admin paneli
- analytics ve kullanım raporları

## Notlar

- Frontend Vercel için optimize edilmiştir.
- Backend Render ortamı ile uyumludur.
- Seed sistemi MongoDB Atlas üzerinde demo veri üretir.
- SPA route yenilemeleri için `frontend/vercel.json` kullanılmıştır.
