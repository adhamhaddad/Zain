import { setAccessToken } from './setAccessToken';
import { setRefreshToken } from './setRefreshToken';
import { verifyAccessToken } from './verifyAccessToken';
import { verifyRefreshToken } from './verifyRefreshToken';
import { authMe } from './authMe';

interface Payload {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  role: string;
}
interface DecodedToken {
  id: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone: string;
  role: string;
}

export {
  setAccessToken,
  setRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  authMe,
  Payload,
  DecodedToken
};
