import express from 'express';
import authRoute from '../routes/auth.route.js'
import workSpaceRoute  from '../routes/workspace.route.js'
const router = express.Router();

router.use('/auth', authRoute);
router.use('/workspace', workSpaceRoute);
export default router;