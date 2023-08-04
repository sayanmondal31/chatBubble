import { call, put, takeLatest } from "redux-saga/effects";
import {
  getUsersAction,
  loginUserAction,
  signupUserAction,
} from "../api/userAction";
import { setToken, setUser, setUsersList } from "../redux/user";

function* loginSaga(action) {
  try {
    console.log(action.payload, "login saga");
    const response = yield call(loginUserAction, action.payload);
    if (response.status === 200) {
      yield put(setToken({ token: response.data.token }));
      yield put(setUser({ user: response.data.user }));
    }
  } catch (error) {
    console.log(error);
  }
}

function* signupSaga(action) {
  try {
    const response = yield call(signupUserAction, action.payload);

    if (response.status === 200) {
      alert("user created");
    }
  } catch (error) {
    console.log(error);
  }
}

function* getUsersSaga() {
  try {
    const response = yield call(getUsersAction);

    if (response.status === 200) {
      yield put(setUsersList({ users: response.data.users }));
    }
  } catch (error) {
    console.log(error);
  }
}

export function* watchAsyncUserSaga() {
  yield takeLatest("LOGIN", loginSaga);
  yield takeLatest("SIGNUP", signupSaga);
  yield takeLatest("GET_USERS", getUsersSaga);
}
