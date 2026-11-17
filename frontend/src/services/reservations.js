import api from './api';

export const createReservation = (values) => api.post('/reservations', values).then((r) => r.data);
