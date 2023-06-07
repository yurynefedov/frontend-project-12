import React, { useContext, useMemo } from 'react';
import { ApiContext } from './index.js';

const promisifySocket = (socket, type, data) => new Promise((resolve, reject) => {
  socket.timeout(5000).emit(type, data, (error, response) => {
    if (error) {
      console.error(error);
      reject(error);
    }
    resolve(response.data);
  });
});

const ApiProvider = ({ socket, children }) => {
  const api = useMemo(() => ({
    addMessage: (message) => promisifySocket(socket, 'newMessage', message),
    addChannel: (channel) => promisifySocket(socket, 'newChannel', channel),
    removeChannel: (id) => promisifySocket(socket, 'removeChannel', { id }),
    renameChannel: ({ id, name }) => promisifySocket(socket, 'renameChannel', { id, name }),
  }), [socket]);

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);

export default ApiProvider;
