import client from './client';

// ─────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────

export const productService = {
  getAll: async () => {
    const res = await client.get('/products/');
    return res.data;
  },

  getById: async (id) => {
    const res = await client.get(`/products/${id}`);
    return res.data;
  },

  getImages: async (productId) => {
    const res = await client.get(`/product-images/product/${productId}`);
    return res.data;
  },

  create: async (data) => {
    const res = await client.post('/products/', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await client.put(`/products/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await client.delete(`/products/${id}`);
    return res.data;
  },
};

// ─────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────

export const categoryService = {
  getAll: async () => {
    const res = await client.get('/categories/');
    return res.data;
  },
};

// ─────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────

export const brandService = {
  getAll: async () => {
    const res = await client.get('/brands/');
    return res.data;
  },
};

// ─────────────────────────────────────────
// SHOPS
// ─────────────────────────────────────────

export const shopService = {
  getAll: async () => {
    const res = await client.get('/shops/');
    return res.data;
  },
};

// ─────────────────────────────────────────
// RENTALS
// ─────────────────────────────────────────

export const rentalService = {
  // POST /rentals/
  create: async (data) => {
    const res = await client.post('/rentals/', data);
    return res.data;
  },

  // GET /rentals/my
  getMy: async () => {
    const res = await client.get('/rentals/my');
    return res.data;
  },

  // GET /rentals/my/{id}
  getMyById: async (id) => {
    const res = await client.get(`/rentals/my/${id}`);
    return res.data;
  },

  // ADMIN: GET /rentals/
  getAll: async () => {
    const res = await client.get('/rentals/');
    return res.data;
  },

  // ADMIN: GET /rentals/status/{status}
  getByStatus: async (status) => {
    const res = await client.get(`/rentals/status/${status}`);
    return res.data;
  },

  // ADMIN: GET /rentals/{id}/details
  getDetails: async (id) => {
    const res = await client.get(`/rentals/${id}/details`);
    return res.data;
  },

  // ADMIN: PUT /rentals/{id}/status
  updateStatus: async (id, data) => {
    const res = await client.put(`/rentals/${id}/status`, data);
    return res.data;
  },
};

// ─────────────────────────────────────────
// UPLOAD (admin only)
// ─────────────────────────────────────────

export const uploadService = {
  // POST /upload/image — returns { url, public_id }
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

// ─────────────────────────────────────────
// ERROR HELPER
// ─────────────────────────────────────────

export const getApiError = (error) => {
  const detail = error?.response?.data?.detail;

  // FastAPI validation errors return detail as an array of objects
  if (Array.isArray(detail)) {
    return detail.map((e) => e.msg || JSON.stringify(e)).join(', ');
  }

  return (
    detail ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'
  );
};