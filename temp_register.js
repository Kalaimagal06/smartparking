const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/register', {
      name: 'Temp User',
      email: 'temp' + Date.now() + '@example.com',
      password: 'Pass123!',
      role: 'USER'
    });
    console.log('Response:', res.data);
  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
})();
