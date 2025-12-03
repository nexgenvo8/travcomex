import Pusher from 'pusher-js';

const pusher = new Pusher('300eb8438e851ff02c52', {
  cluster: 'ap2',
  encrypted: true,
});

pusher.connection.bind('state_change', (states) => {
  console.log(`🔄 Pusher state changed1: ${states.previous} → ${states.current}`);
});

pusher.connection.bind('connected', () => {
  console.log('✅ Pusher connected successfully!');
});

pusher.connection.bind('error', (err) => {
  console.error('❌ Pusher connection error:', err);
});

export default pusher;
