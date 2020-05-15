import express from 'express';
import { auth, requiresAuth } from 'express-openid-connect';

import { config } from './controllers/authController';
import authRoute from './routes/auth';

const app = express();

app.use(express.json());

app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.openid.user));
});

app.use('/api/v1/user', authRoute);

app.get('/api/v1/callback', (req, res) => res.send('callback page'));

export default app;
