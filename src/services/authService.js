const API_URL = 'http://127.0.0.1:8000/api/auth/login/';

export const loginService = async (email, password) => {
  try {
    console.log('Intentando login con:', email);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: 'Error desconocido del servidor' };
      }
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Login exitoso:', data);

    // Extraer información del token JWT (sin validación, solo decodificación)
    const decodeToken = (token) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        return {};
      }
    };

    const accessTokenData = decodeToken(data.access);
    const userType = data.userType || accessTokenData.userType || 'user';

    return {
      tokens: {
        refresh: data.refresh,
        access: data.access,
      },
      user: {
        email: data.email || accessTokenData.email || email,
        nombre: data.nombre || accessTokenData.nombre || 'Usuario',
        userType: userType,
      },
    };
  } catch (error) {
    throw error;
  }
};
