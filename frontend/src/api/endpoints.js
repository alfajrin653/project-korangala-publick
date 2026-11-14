import apiClient from './client';

export const authApi = {
  login: (payload) => apiClient.post('/auth/login', payload),
  register: (payload) => apiClient.post('/auth/register', payload),
  me: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
  googleSignIn: (token) => apiClient.post('/auth/google', { token }),
};

export const articlesApi = {
  list: (params) => apiClient.get('/articles', { params }),
  hero: () => apiClient.get('/articles/hero'),
  detail: (slug) => apiClient.get(`/articles/${slug}`),
  search: (keyword) => apiClient.get(`/articles/search?q=${keyword}`),

  // 1. Fungsi untuk menarik antrean moderasi (Khusus Editor)
  getPending: () => apiClient.get('/articles/editor/pending'),

  // 2. Fungsi untuk menyetujui atau menolak artikel
  review: (id, payload) => apiClient.put(`/articles/${id}/review`, payload),

  // Fungsi untuk menarik artikel berdasarkan ID (digunakan saat mau edit/ubah konten)
  getById: (id) => apiClient.get(`/articles/id/${id}`),

  // Fungsi create diubah agar mendukung pengiriman file gambar (FormData)
  create: (formData) =>
    apiClient.post('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Fungsi update untuk menyimpan editan draf atau artikel yang ditolak
  update: (id, formData) =>
    apiClient.put(`/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Fungsi khusus untuk menarik konten milik kreator yang sedang login
  getMyArticles: (status) => apiClient.get(`/articles/my-articles?status=${status}`),
  // SEBELUMNYA: apiClient.get(`/api/articles/${articleId}/comments`)
  // UBAH MENJADI:
  getComments: (articleId) => apiClient.get(`/articles/${articleId}/comments`),

  // Perbarui baris ini agar menerima token (config)
  addComment: (articleId, data, config) => apiClient.post(`/articles/${articleId}/comments`, data, config),
};

export const categoriesApi = {
  list: () => apiClient.get('/categories'),
};

export const regionsApi = {
  list: (params) => apiClient.get('/regions', { params }),
  detail: (slug) => apiClient.get(`/regions/${slug}`),
};

export const hoaxApi = {
  list: (params) => apiClient.get('/hoax', { params }),
  detail: (id) => apiClient.get(`/hoax/${id}`),
};

export const tickerApi = {
  list: () => apiClient.get('/ticker'),
};

export const corpusApi = {
  search: (params) => apiClient.get('/corpus/search', { params }),
  citation: (id) => apiClient.get(`/corpus/${id}/citation`),
};
