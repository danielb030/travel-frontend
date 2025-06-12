import { Navigate } from 'react-router-dom';

import userStore from 'src/store/userStore';

export default function Signout() {
  const { setUser } = userStore();

  setUser({ isAuth: false });
  localStorage.removeItem('token');

  return <Navigate to="/" replace />;
}
