import axios from 'axios';
import { generateCodeVerifier, generateCodeChallenge, generateState } from './pkce';

const redirectUri = import.meta.env.VITE_REDIRECT_URI

const AuthService = {
  state: {
    accessToken: localStorage.getItem('access_token') || null
  },

  async initiatePKCE() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    const state = generateState();


    localStorage.setItem('pkce_verifier', verifier);
    localStorage.setItem('auth_state', state);

    window.location.href = `https://tonerTest.test/oauth/authorize?` +
      `client_id=2&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `state=${state}&` +
      `code_challenge=${challenge}&` +
      `code_challenge_method=S256`;
  },

  async handlePKCECallback(code) {
    const verifier = localStorage.getItem('pkce_verifier');

    try {
      const response = await axios.post('https://tonerTest.test/oauth/token', {
        grant_type: 'authorization_code',
        client_id: 2,
        redirect_uri: redirectUri,
        code_verifier: verifier,
        code: code,
      });

      console.log(response.data);

      this.state.accessToken = response.data.access_token;
      localStorage.setItem('access_token', this.state.accessToken);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.removeItem('pkce_verifier');

      return true;
    } catch (error) {
      throw error.response.data;
    }
  },

  logout() {
    const headers = {
      Authorization: `Bearer ${this.state.accessToken}`
    };

    axios.post('https://tonerTest.test/api/logout', {}, { headers })
      .then(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.state.accessToken = null;
      })
      .catch(error => {
        if (error.response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        console.error('Logout failed:', error);
      });
  }
};

export default AuthService;
