import User from '../models/user';

export const config = {
  required: false,
  auth0Logout: true,
  appSession: {
    secret: process.env.AUTH0_CLIENT_SECRET
  },
  baseURL: 'http://localhost:3001',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN || 'https://dev-jngisiro.auth0.com'
};

export const register = async (req, res) => {
  res.send('register');
};

export const login = (req, res) => res.redirect('/');
