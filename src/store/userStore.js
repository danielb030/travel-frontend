import { create } from 'zustand';

const initialState = {
  isAuth: false,
  email: '',
  id: '',
  permissions: {},
  role:'',
  isAdmin: false,
};

const userStore = create((set) => ({
  ...initialState,
  setUser: (user) => set(() => ({ ...user })),
}));

export default userStore;
