import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import { updateProfileSuccess } from './actions';

export function* updateProfile({ payload }) {
  try {
    const {
      name,
      oldPassword,
      password,
      confirmPassword,
      phone,
      birth,
      avatar_id,
    } = payload;

    if (password === '') {
      const response = yield call(api.put, '/users', {
        name,
        oldPassword,
        phone,
        birth,
        avatar_id,
      });
      yield put(updateProfileSuccess(response.data));
    } else {
      const response = yield call(api.put, '/users', {
        name,
        oldPassword,
        password,
        confirmPassword,
        phone,
        birth,
        avatar_id,
      });
      yield put(updateProfileSuccess(response.data));
    }
    toast.success('Profile updated successfully.');
  } catch (err) {
    toast.error('Profile update failed, check your data');
  }
}

export default all([takeLatest('@update/PROFILE_REQUEST', updateProfile)]);
