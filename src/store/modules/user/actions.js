export function signInRequest(email, password) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { email, password },
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user },
  };
}

export function signFailure() {
  return {
    type: '@auth/SIGN_FAILURE',
  };
}

export function updateProfileRequest(
  name,
  oldPassword,
  password,
  confirmPassword,
  phone,
  birth,
  avatar_id,
) {
  return {
    type: '@update/PROFILE_REQUEST',
    payload: {
      name,
      oldPassword,
      password,
      confirmPassword,
      phone,
      birth,
      avatar_id,
    },
  };
}

export function updateProfileSuccess(user) {
  return {
    type: '@update/PROFILE_SUCCESS',
    payload: user,
  };
}
