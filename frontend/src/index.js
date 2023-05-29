import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import './assets/application.scss';
import init from './init.jsx';

const app = async () => {
  const socket = io();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(await init(socket));
};

app();
