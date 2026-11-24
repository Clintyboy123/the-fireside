import api from './api';
import { previewOnly } from './preview';
import { IS_PREVIEW } from '../utils/asset';

export const createReservation = (values) => (IS_PREVIEW ? previewOnly() : api.post('/reservations', values).then((r) => r.data));
