import api from './api';
import { previewOnly } from './preview';
import { IS_PREVIEW } from '../utils/asset';

export const sendEnquiry = (values) => (IS_PREVIEW ? previewOnly() : api.post('/enquiries', values).then((r) => r.data));
