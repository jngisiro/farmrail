import express from 'express';
import passport from 'passport';

import { register, login } from '../../controllers/authController';

const router = express.Router();

router.post('/register', register);

router.get('/login', passport.authenticate('auth0', { scope: 'openid email profile' }), login);

export default router;
