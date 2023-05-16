const socket = io();

let user;
const mesaggeInput = document.getElementById('msg');
Swal.fire({
  title: 'Bienvenido, Identifiquiticate!',
  text: 'PACOOO IDENTIFIQUITICATEEEEEE',
  input: 'text',
  icon: 'success',
  inputValidator: (value) => {
    if (!value) {
      return 'Necesitas IDENTIFIQUITARTE!';
    }
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit('newUser', user);
});

mesaggeInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    let msgvalue = mesaggeInput.value;
    if (msgvalue.trim().length > 0) {
      socket.emit('message', { user, msgvalue });
    }
    mesaggeInput.value = '';
  }
});

socket.on('messages', (messages) => {
  renderMessages(messages);
});

const renderMessages = (messages) => {
  const html = messages
    .map((message) => {
      return `
      <div class="message">
        <strong class="user">${message.user}:</strong><br>
        <span class="message-text">${message.msgvalue}</span>
      </div>
    `;
    })
    .join(' ');
  document.getElementById('history').innerHTML = html;
};
socket.on('newUser', (user) => {
  Swal.fire({
    title: `${user}`,
    toast: true,
    position: 'top-end',
  });
  console.log(JSON.stringify(user));
});
