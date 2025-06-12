/* eslint-disable perfectionist/sort-imports */
// import { useEffect } from 'react';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

import { useAuth } from 'src/hooks/use-auth';
import userStore from './store/userStore';

// ----------------------------------------------------------------------

export default function App() {
  const user = useAuth();
  const setUser = userStore((state) => state.setUser);
  setUser(user);
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
