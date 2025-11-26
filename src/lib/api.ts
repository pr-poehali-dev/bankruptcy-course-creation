const API_BASE = {
  auth: 'https://functions.poehali.dev/c499486b-a97c-4ff5-8905-0ccd7fddcf9d',
  admin: 'https://functions.poehali.dev/94be9de0-6f48-41a7-98b1-708c24fb05ad',
  course: 'https://functions.poehali.dev/f4829fa5-9666-4f09-b7bf-a94c39f727b1',
  payment: 'https://functions.poehali.dev/b3f3dab4-093d-45bf-98cb-86512e00886b',
  upload: 'https://functions.poehali.dev/93c0187f-a1dd-40e0-bf79-89dada66de86',
};

export const auth = {
  register: async (email: string, password: string, full_name: string, telegram_username?: string) => {
    const response = await fetch(API_BASE.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, full_name, telegram_username }),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(API_BASE.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    return response.json();
  },

  validateToken: async (token: string) => {
    const response = await fetch(API_BASE.auth, {
      method: 'GET',
      headers: { 'X-Auth-Token': token },
    });
    return response.json();
  },
};

export const admin = {
  getModules: async (token: string) => {
    const response = await fetch(`${API_BASE.admin}?resource=modules`, {
      headers: { 'X-Auth-Token': token },
    });
    return response.json();
  },

  createModule: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE.admin}?resource=modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateModule: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE.admin}?resource=modules`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getLessons: async (token: string, moduleId?: number) => {
    const url = moduleId 
      ? `${API_BASE.admin}?resource=lessons&module_id=${moduleId}`
      : `${API_BASE.admin}?resource=lessons`;
    const response = await fetch(url, {
      headers: { 'X-Auth-Token': token },
    });
    return response.json();
  },

  createLesson: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE.admin}?resource=lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateLesson: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE.admin}?resource=lessons`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getMaterials: async (token: string, lessonId?: number, moduleId?: number) => {
    let url = `${API_BASE.admin}?resource=materials`;
    if (lessonId) url += `&lesson_id=${lessonId}`;
    if (moduleId) url += `&module_id=${moduleId}`;
    const response = await fetch(url, {
      headers: { 'X-Auth-Token': token },
    });
    return response.json();
  },

  createMaterial: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE.admin}?resource=materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export const course = {
  getContent: async (token: string) => {
    const response = await fetch(API_BASE.course, {
      headers: { 'X-Auth-Token': token },
    });
    return response.json();
  },

  updateProgress: async (token: string, lessonId: number, completed: boolean, watchTime: number) => {
    const response = await fetch(API_BASE.course, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
      body: JSON.stringify({ 
        lesson_id: lessonId, 
        completed, 
        watch_time_seconds: watchTime 
      }),
    });
    return response.json();
  },
};

export const payment = {
  createPayment: async (userId: number, amount: number, email: string, returnUrl: string, name?: string, productType?: string) => {
    const response = await fetch(`${API_BASE.payment}?action=create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: userId, 
        amount, 
        email, 
        return_url: returnUrl,
        name: name || 'Клиент',
        product_type: productType || 'course'
      }),
    });
    return response.json();
  },

  checkStatus: async (paymentId: string) => {
    const response = await fetch(`${API_BASE.payment}?action=status&payment_id=${paymentId}`);
    return response.json();
  },
};

export const uploadFile = async (token: string, data: {
  fileName?: string;
  fileContent?: string;
  fileType: string;
  title: string;
  description: string;
  lessonId?: number;
  moduleId?: number;
  isWelcomeVideo?: boolean;
  externalUrl?: string;
}) => {
  const response = await fetch(API_BASE.upload, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getFiles = async (token: string, lessonId?: number, moduleId?: number) => {
  let url = API_BASE.upload;
  const params = new URLSearchParams();
  if (lessonId) params.append('lesson_id', lessonId.toString());
  if (moduleId) params.append('module_id', moduleId.toString());
  if (params.toString()) url += '?' + params.toString();
  
  const response = await fetch(url, {
    headers: { 'X-Auth-Token': token },
  });
  return response.json();
};

export const deleteFile = async (token: string, fileId: number) => {
  const response = await fetch(`${API_BASE.upload}?id=${fileId}`, {
    method: 'DELETE',
    headers: { 'X-Auth-Token': token },
  });
  return response.json();
};