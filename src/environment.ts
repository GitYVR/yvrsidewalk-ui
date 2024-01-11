import { cleanEnv, url } from 'envalid';

export default cleanEnv(process.env, {
  REACT_APP_BACKEND_BASE_URL: url(),
});
