import express from 'express';
import authRoute from '../routes/auth.route.js'
import workSpaceRoute  from '../routes/workspace.route.js'
import boardRoute from '../routes/board.route.js'

const router = express.Router();

router.use('/auth', authRoute);
router.use('/workspace', workSpaceRoute);
router.use('/board', boardRoute);
export default router;