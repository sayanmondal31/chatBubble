import { configureStore } from "@reduxjs/toolkit";
import { userSliceReducer } from "./user";
import { chatSliceReducer } from "./chat";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga/rootSaga";

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    chat: chatSliceReducer,
  },
  middleware,
});

sagaMiddleware.run(rootSaga);

export default store;
