import axios from "axios";

export const getMessageAction = async (payload) => {
  const response = await axios.get(
    `http://localhost:5001/api/chat/messages?sender=${payload.sender}&receiver=${payload.receiver}`
  );

  return response;
};
