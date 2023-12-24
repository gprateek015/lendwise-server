import { Router } from 'express';
import catchAsync from '../utilities/catch-async.js';
import {
  fetchAllLoans,
  repayLoan,
  requestNewLoan
} from '../controllers/loan.js';

const router = Router();

// All routes the Authenticated
router
  .route('/')
  .post(catchAsync(requestNewLoan))
  .get(catchAsync(fetchAllLoans));

router.post('/:loan_id/repay', catchAsync(repayLoan));

export default router;
