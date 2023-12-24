import { Router } from 'express';
import catchAsync from '../utilities/catch-async.js';
import { approveLoan, fetchLoans } from '../controllers/admin.js';

const router = Router();

// All routes the Authenticated and Authorized
router.route('/loan').get(catchAsync(fetchLoans));
router.post('/loan/approve', catchAsync(approveLoan));

export default router;
