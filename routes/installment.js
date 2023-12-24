import { Router } from 'express';
import catchAsync from '../utilities/catch-async.js';
import {
  fetchUnpaidInstallments,
  repayInstallment
} from '../controllers/installment.js';

const router = Router();

// All routes the Authenticated
router.post('/:installment_id/repay', catchAsync(repayInstallment));
router.get('/', catchAsync(fetchUnpaidInstallments));

export default router;
