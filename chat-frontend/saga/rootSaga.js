import { all } from "redux-saga/effects";
import { watchAsyncUserSaga } from "./userSaga";
import { watchAsyncChatSaga } from "./chatSaga";

export default function* rootSaga() {
  yield all([watchAsyncUserSaga(), watchAsyncChatSaga()]);
}
