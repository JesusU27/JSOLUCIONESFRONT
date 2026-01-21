import api from './api';

export const clientService = {
  // Obtener perfil del usuario
  getProfile: () => {
    return api.get('/clientes/cuenta/perfil/');
  },

  // Actualizar perfil del usuario
  updateProfile: (profileData) => {
    return api.put('/clientes/cuenta/actualizar_perfil/', profileData);
  },

  // Cambiar contraseña
  changePassword: (currentPassword, newPassword, newPassword2) => {
    return api.post('/clientes/cuenta/cambiar_password/', {
      password_actual: currentPassword,
      password_nueva: newPassword,
      password_nueva2: newPassword2,
    });
  },
};
