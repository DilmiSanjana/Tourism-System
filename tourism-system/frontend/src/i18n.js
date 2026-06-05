import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome', login: 'Login', register: 'Register', logout: 'Logout',
      home: 'Home', hotels: 'Hotels', vehicles: 'Vehicles', guides: 'Tour Guides',
      bookings: 'Bookings', reviews: 'Reviews', profile: 'Profile', admin: 'Admin',
      search: 'Search', filter: 'Filter', book_now: 'Book Now', check_availability: 'Check Availability',
      available: 'Available', not_available: 'Not Available', price: 'Price', location: 'Location',
      name: 'Name', email: 'Email', phone: 'Phone', password: 'Password', submit: 'Submit',
      cancel: 'Cancel', save: 'Save', delete: 'Delete', edit: 'Edit', view: 'View',
      status: 'Status', pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed',
      cancelled: 'Cancelled', loading: 'Loading...', error: 'Error', success: 'Success',
      no_results: 'No results found', back: 'Back', next: 'Next', previous: 'Previous',
      total_price: 'Total Price', start_date: 'Start Date', end_date: 'End Date',
      special_requests: 'Special Requests', download_pdf: 'Download PDF',
      forgot_password: 'Forgot Password', reset_password: 'Reset Password',
      change_password: 'Change Password', my_bookings: 'My Bookings', my_reviews: 'My Reviews',
      wishlist: 'Wishlist', dashboard: 'Dashboard', nationality: 'Nationality',
      languages: 'Languages', experience: 'Experience', rating: 'Rating', reviews_count: 'Reviews',
      tour_packages: 'Tour Packages', room_type: 'Room Type', fuel_estimate: 'Fuel Estimate',
      travel_package: 'Travel Package', payment_status: 'Payment Status',
      booking_reference: 'Booking Reference', reply: 'Reply', report: 'Report',
    }
  },
  si: {
    translation: {
      welcome: 'සාදරයෙන් පිළිගනිමු', login: 'පිවිසෙන්න', register: 'ලියාපදිංචි වන්න',
      logout: 'ඉවත් වන්න', home: 'මුල් පිටුව', hotels: 'හෝටල්', vehicles: 'වාහන',
      guides: 'සංචාරක මාර්ගෝපදේශකයන්', bookings: 'වෙන්කිරීම්', reviews: 'සමාලෝචන',
      profile: 'පැතිකඩ', admin: 'පරිපාලක', search: 'සොයන්න', filter: 'පෙරහන',
      book_now: 'දැන් වෙන් කරන්න', check_availability: 'ලබාගත හැකිද බලන්න',
      available: 'ලබාගත හැක', not_available: 'ලබාගත නොහැක', price: 'මිල',
      location: 'ස්ථානය', name: 'නම', email: 'විද්‍යුත් තැපෑල', phone: 'දුරකථන',
      password: 'මුරපදය', submit: 'ඉදිරිපත් කරන්න', cancel: 'අවලංගු කරන්න',
      save: 'සුරකින්න', delete: 'මකන්න', edit: 'සංස්කරණය', view: 'බලන්න',
      status: 'තත්ත්වය', pending: 'අපේක්ෂිත', confirmed: 'තහවුරු කළ',
      completed: 'සම්පූර්ණ කළ', cancelled: 'අවලංගු කළ', loading: 'පූරණය වෙමින්...',
      error: 'දෝෂය', success: 'සාර්ථකයි', no_results: 'ප්‍රතිඵල නොමැත',
      back: 'ආපසු', next: 'ඊළඟ', previous: 'පෙර', total_price: 'මුළු මිල',
      start_date: 'ආරම්භ දිනය', end_date: 'අවසාන දිනය', download_pdf: 'PDF බාගන්න',
      forgot_password: 'මුරපදය අමතකද', reset_password: 'මුරපදය නැවත සකසන්න',
      my_bookings: 'මගේ වෙන්කිරීම්', wishlist: 'ආශා ලැයිස්තුව',
      dashboard: 'පාලක පුවරුව', rating: 'ශ්‍රේණිගත කිරීම', reply: 'පිළිතුරු දෙන්න',
    }
  },
  ta: {
    translation: {
      welcome: 'வரவேற்கிறோம்', login: 'உள்நுழைக', register: 'பதிவு செய்க',
      logout: 'வெளியேறு', home: 'முகப்பு', hotels: 'ஹோட்டல்கள்', vehicles: 'வாகனங்கள்',
      guides: 'சுற்றுலா வழிகாட்டிகள்', bookings: 'முன்பதிவுகள்', reviews: 'மதிப்புரைகள்',
      profile: 'சுயவிவரம்', admin: 'நிர்வாகி', search: 'தேடு', filter: 'வடிகட்டு',
      book_now: 'இப்போது முன்பதிவு செய்க', check_availability: 'கிடைக்குமா என சரிபார்க்கவும்',
      available: 'கிடைக்கும்', not_available: 'கிடைக்காது', price: 'விலை',
      location: 'இடம்', name: 'பெயர்', email: 'மின்னஞ்சல்', phone: 'தொலைபேசி',
      password: 'கடவுச்சொல்', submit: 'சமர்ப்பி', cancel: 'ரத்து செய்', save: 'சேமி',
      delete: 'நீக்கு', edit: 'திருத்து', view: 'பார்', status: 'நிலை',
      pending: 'நிலுவையில்', confirmed: 'உறுதிப்படுத்தப்பட்டது', completed: 'முடிந்தது',
      cancelled: 'ரத்து செய்யப்பட்டது', loading: 'ஏற்றுகிறது...', error: 'பிழை',
      success: 'வெற்றி', no_results: 'முடிவுகள் இல்லை', back: 'பின்',
      total_price: 'மொத்த விலை', download_pdf: 'PDF பதிவிறக்கம்',
      my_bookings: 'என் முன்பதிவுகள்', wishlist: 'விருப்பப்பட்டியல்',
      dashboard: 'கட்டுப்பாட்டு பலகை', rating: 'மதிப்பீடு', reply: 'பதில் சொல்',
    }
  },
  de: {
    translation: {
      welcome: 'Willkommen', login: 'Anmelden', register: 'Registrieren', logout: 'Abmelden',
      home: 'Startseite', hotels: 'Hotels', vehicles: 'Fahrzeuge', guides: 'Reiseführer',
      bookings: 'Buchungen', reviews: 'Bewertungen', profile: 'Profil', search: 'Suchen',
      book_now: 'Jetzt buchen', available: 'Verfügbar', not_available: 'Nicht verfügbar',
      price: 'Preis', location: 'Standort', name: 'Name', email: 'E-Mail',
      password: 'Passwort', submit: 'Einreichen', cancel: 'Abbrechen', save: 'Speichern',
      status: 'Status', loading: 'Laden...', error: 'Fehler', success: 'Erfolg',
    }
  },
  zh: {
    translation: {
      welcome: '欢迎', login: '登录', register: '注册', logout: '退出',
      home: '首页', hotels: '酒店', vehicles: '车辆', guides: '导游',
      bookings: '预订', reviews: '评价', profile: '个人资料', search: '搜索',
      book_now: '立即预订', available: '可用', not_available: '不可用',
      price: '价格', location: '位置', name: '姓名', email: '邮箱',
      password: '密码', submit: '提交', cancel: '取消', save: '保存',
      status: '状态', loading: '加载中...', error: '错误', success: '成功',
    }
  },
  fr: {
    translation: {
      welcome: 'Bienvenue', login: 'Connexion', register: "S'inscrire", logout: 'Déconnexion',
      home: 'Accueil', hotels: 'Hôtels', vehicles: 'Véhicules', guides: 'Guides',
      bookings: 'Réservations', reviews: 'Avis', profile: 'Profil', search: 'Rechercher',
      book_now: 'Réserver maintenant', available: 'Disponible', not_available: 'Indisponible',
      price: 'Prix', location: 'Lieu', name: 'Nom', email: 'E-mail',
      password: 'Mot de passe', submit: 'Soumettre', cancel: 'Annuler', save: 'Enregistrer',
      status: 'Statut', loading: 'Chargement...', error: 'Erreur', success: 'Succès',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
