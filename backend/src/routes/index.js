import express from 'express';
import authRoute from '../routes/auth.route.js'
import workSpaceRoute  from '../routes/workspace.route.js'
import boardRoute from '../routes/board.route.js'
import taskRoute from '../routes/task.route.js'
import dashboardRoute from '../routes/dashboard.routes.js'

const router = express.Router();

router.use('/auth', authRoute);
router.use('/workspace', workSpaceRoute);
router.use('/board', boardRoute);
router.use('/task', taskRoute);
router.use('/dashboard', dashboardRoute);
export default router;