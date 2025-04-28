import axios from 'axios';

export const getNewerFirebaseTokenClient = async () => {
  const token = getCookie('myroutine-auth-token-refresh');
  const token_time_str = getCookie('myroutine-auth-token-time');
  if (!token || !token_time_str) {
    return '';
  }

  const token_time = new Date(token_time_str);

  const now = new Date(); // Current time

  const diffMs = now.getTime() - token_time.getTime(); // Difference in milliseconds
  const diffMinutes = Math.round(diffMs / 60000); // Convert to minutes (1000ms * 60s)

  if (diffMinutes < 1) {
    return token;
  } else {
    //get a new token from firebase
    const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_APIKEY;
    const url = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;

    try {
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: token,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const new_token = response.data.id_token || 'Null token';
      const new_token_refresh = response.data.refresh_token || 'Null token';
      localStorage.setItem('myroutine-auth-token', new_token);
      localStorage.setItem('myroutine-auth-token-refresh', new_token_refresh);
      localStorage.setItem('myroutine-auth-token-time', now.toUTCString() || 'Null token');

      return new_token;
    } catch (error) {
      console.error('Error fetching user from token:', error);
      return '';
    }
  }
};

function getCookie(name: string): string | undefined {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split('=')[1];

  return value;
}
