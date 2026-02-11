import io from 'socket.io-client';

 const socketConnection = io('http://localhost:3333', {
    withCredentials: true,
    transports: ['websocket']
})

export default socketConnection;