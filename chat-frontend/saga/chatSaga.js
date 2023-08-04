import { takeLatest, call, put } from "redux-saga/effects";
import { getMessageAction } from "../api/messageAction";
import { getMessages } from "../redux/chat";

function* getMessagesSaga(actions) {
  try {
    const response = yield call(getMessageAction, actions.payload);
    if (response.status === 200) {
      yield put(getMessages({ messages: response.data.messages }));
    }
  } catch (error) {
    console.log(error);
  }
}

export function* watchAsyncChatSaga() {
  yield takeLatest("GET_MESSAGES", getMessagesSaga);
}
