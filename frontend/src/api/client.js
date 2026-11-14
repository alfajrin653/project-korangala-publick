// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
//   headers: { 'Content-Type': 'application/json' },
//   withCredentials: true, // <-- TAMBAHKAN INI: Wajib agar browser otomatis mengirim Cookie ke backend
// });

// export default apiClient;

// import axios from 'axios';

// const apiClient = axios.create({
//   // Kita kembali ke jalur aman dan profesional:
//   baseURL: 'https://zooming-enchantment-gala-koran.up.railway.app/api',
//   headers: { 'Content-Type': 'application/json' },
//   withCredentials: true, // <-- UBAH JADI TRUE
// });

// export default apiClient;



// import axios from 'axios';

// const apiClient = axios.create({
//   // UBAH SEMENTARA KE LOCALHOST UNTUK TESTING:
//   baseURL: 'https://zooming-enchantment-gala-koran.up.railway.app/api', 
//   headers: { 'Content-Type': 'application/json' },
//   withCredentials: true,
// });

// export default apiClient;


import axios from 'axios';

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:4000/api',

  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
