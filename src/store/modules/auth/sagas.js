import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '../../../services/history';
import api from '../../../services/api';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;
    const response = yield call(api.post, '/sessions/users', {
      email,
      password,
    });
    const { user, token } = response.data;
    api.defaults.headers.Authorization = `Bearer ${token}`;
    yield put(signInSuccess(token, user));

    history.push('/dashboard');
  } catch (err) {
    toast.error('Authentication failed, check your data');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password, phone, birth, type } = payload;
    const response = yield call(api.post, '/users', {
      name,
      email,
      password,
      phone,
      birth,
      type,
      group: 1,
    });
    toast.success('User created successfully.');
    history.push(`/accounts/user/${response.data.id}`);
  } catch (err) {
    if (err.response.data.message === 'The email is already in use') {
      toast.error('The email is already in use.');
      yield put(signFailure());
    } else {
      toast.error(err.response.data.message);
      yield put(signFailure());
    }
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
