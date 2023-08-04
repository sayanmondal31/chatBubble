import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSound from "use-sound";
import io from "socket.io-client";
import { setMessages } from "../redux/chat";
import Select from "react-select";
import sendSound from "./assets/mixkit-light-button-2580.mp3";
import receiveSound from "./assets/mixkit-long-pop-2358.mp3";
import { setUsersList } from "../redux/user";

const socket = io("http://localhost:5001");
// const sendSound = new Audio("./assets/mixkit-light-button-2580.mp3");

function App() {
  const dispatch = useDispatch();
  const { token, user, users } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.chat);
  const [sendSoundplay] = useSound(sendSound);
  const [receiveSoundplay] = useSound(receiveSound);

  const [useCreatePayload, setuseCreatePayload] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginPayload, setloginPayload] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [receiver, setReceiver] = useState();

  useEffect(() => {
    dispatch({
      type: "GET_USERS",
    });
  }, []);

  useEffect(() => {
    socket.on("check-user-online", () => {
      dispatch(setUsersList({ users: [] }));
      dispatch({
        type: "GET_USERS",
      });
      if (user.length > 0) {
        users.map((user) => {
          if (receiver?.id === user._id) {
            setReceiver(user);
          }
        });
      }
    });
  }, []);

  console.log(receiver, "receiver");

  useEffect(() => {
    if (user?._id !== undefined && receiver !== "") {
      socket.emit("user-connected", user?._id);
      dispatch({
        type: "GET_MESSAGES",
        payload: {
          sender: user._id,
          receiver: receiver?.id,
        },
      });
    }
  }, [user?._id, receiver]);

  useEffect(() => {
    // Event listener for receiving new messages
    socket.on("receive-message", (message) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message, "message fromsocket");
      dispatch(
        setMessages({
          message: message,
        })
      );
      receiveSoundplay();
    });
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      // Emit the message to the server
      socket.emit("send-message", {
        message,
        sender: user._id,
        receiver: receiver?.id,
      });

      setMessage("");
      sendSoundplay();
    }
  };

  console.log(user?._id, "user");

  return (
    <>
      <div>
        {/* login */}
        {!token && (
          <div>
            <div>
              <input
                onChange={(e) => {
                  setloginPayload({
                    ...loginPayload,
                    email: e.target.value,
                  });
                }}
                type="text"
                placeholder="email"
              />
              <input
                onChange={(e) => {
                  setloginPayload({
                    ...loginPayload,
                    password: e.target.value,
                  });
                }}
                type="password"
                placeholder="password"
              />
              <button
                onClick={() => {
                  dispatch({
                    type: "LOGIN",
                    payload: loginPayload,
                  });
                }}
              >
                login
              </button>
            </div>
            <div>
              <input
                onChange={(e) => {
                  setuseCreatePayload({
                    ...useCreatePayload,
                    username: e.target.value,
                  });
                }}
                type="text"
                placeholder="username"
              />
              <input
                onChange={(e) => {
                  setuseCreatePayload({
                    ...useCreatePayload,
                    email: e.target.value,
                  });
                }}
                type="text"
                placeholder="email"
              />
              <input
                onChange={(e) => {
                  setuseCreatePayload({
                    ...useCreatePayload,
                    password: e.target.value,
                  });
                }}
                className="border-b px-2"
                type="password"
                placeholder="password"
              />
              <button
                onClick={() => {
                  dispatch({
                    type: "SIGNUP",
                    payload: useCreatePayload,
                  });
                  setuseCreatePayload({
                    username: "",
                    email: "",
                    password: "",
                  });
                }}
              >
                signup
              </button>
            </div>
          </div>
        )}
        {token && (
          <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Your username"
                  value={user?.email}
                  // onChange={(e) => setUsername(e.target.value)}
                />
                <Select
                  options={users?.map((u) => {
                    return {
                      value: { id: u._id, socketId: u.socketId },
                      label: u.email,
                    };
                  })}
                  onChange={(e) => {
                    setReceiver(e.value);
                  }}
                />
                {receiver?.socketId !== null ? (
                  <div className="text-green-500">Online</div>
                ) : (
                  <div className="text-red-500">Offline</div>
                )}
              </div>
              <div className="border border-gray-300 p-4 rounded-lg h-60 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg?.sender === user?._id
                        ? "flex justify-end"
                        : "flex justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        msg?.sender === user?._id
                          ? "bg-blue-500 text-white rounded-l-full rounded-tr-full "
                          : "bg-gray-200"
                      } p-2 `}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              {receiver?.id && (
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
              )}
              {receiver?.id && (
                <button
                  onClick={handleSendMessage}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                  // onClick={handleSendMessage}
                >
                  Send
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
