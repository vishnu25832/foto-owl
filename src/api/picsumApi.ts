import axios from 'axios';
import { PicsumImage } from '../types/image';

const PICSUM_API = 'https://picsum.photos/v2/list';

const api = axios.create({
  baseURL: PICSUM_API,
  timeout: 10000,
});

export const fetchImages = async (
  page: number,
  limit: number = 20,
): Promise<PicsumImage[]> => {
  const response = await api.get<PicsumImage[]>('', {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};