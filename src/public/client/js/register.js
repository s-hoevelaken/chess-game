document.getElementById('registerForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.headers.get('content-type')?.includes('application/json')) {
      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        window.location.href = '/auth/login';
      } else {
        alert('Registration failed');
      }
    } else {
      const errorText = await response.text();
      console.error('Error: Expected JSON, received:', errorText);
      alert('An unexpected error occurred. Please check the console.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
