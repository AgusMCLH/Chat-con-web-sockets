const socket = io();

let user;
const messageInput = document.getElementById('msg');
const sendBtn = document.getElementById('send-btn');

// ── Identify user on load ────────────────────────────
Swal.fire({
  title: 'Bienvenido al chat',
  text: '¿Cómo quieres que te llamen?',
  input: 'text',
  inputPlaceholder: 'Tu nombre...',
  icon: 'question',
  confirmButtonText: 'Entrar',
  inputValidator: (value) => {
    if (!value || !value.trim()) {
      return 'Necesitas ingresar un nombre';
    }
  },
  allowOutsideClick: false,
  customClass: {
    popup: 'swal2-popup',
  },
}).then((result) => {
  user = result.value.trim();
  socket.emit('newUser', user);
  setTimeout(() => {
    Swal.fire({
      html: 'Exhortamos el buen uso de la plataforma. <br/> Los mensajes se borran cada 2 minutos.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#22222f',
      color: '#e2e2e6',
    });
  }, 3000);
});

// ── Send on Enter or button click ────────────────────
function sendMessage() {
  const msgvalue = messageInput.value.trim();
  if (msgvalue.length > 0) {
    socket.emit('message', { user, msgvalue });
    messageInput.value = '';
  }
}

messageInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') sendMessage();
});

sendBtn.addEventListener('click', sendMessage);

// ── Receive all messages ─────────────────────────────
socket.on('messages', (messages) => {
  renderMessages(messages);
});

// ── New user notification ────────────────────────────
socket.on('newUser', (msg) => {
  Swal.fire({
    title: msg,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#22222f',
    color: '#e2e2e6',
  });
});

// ── Render helpers ───────────────────────────────────
function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function renderMessages(messages) {
  const history = document.getElementById('history');

  const html = messages
    .map((message) => {
      const isOwn = message.user === user;
      const side = isOwn ? 'own' : 'other';
      const initials = getInitials(message.user);

      return `
        <div class="message ${side}">
          <div class="avatar">${initials}</div>
          <div class="bubble">
            ${!isOwn ? `<div class="bubble-meta"><span class="username">${escapeHtml(message.user)}</span></div>` : ''}
            <div class="bubble-body">${escapeHtml(message.msgvalue)}</div>
          </div>
        </div>
      `;
    })
    .join('');

  history.innerHTML = html;
  // Scroll to bottom on new message
  history.scrollTop = history.scrollHeight;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
