import Loan from '../models/loan.js';
import ExpressError from '../utilities/express-error.js';

export const approveLoan = async (req, res) => {
  const { loan_id } = req.body;

  const loan = await Loan.findByIdAndUpdate(loan_id, {
    approval_status: 'approved'
  });

  if (!loan) {
    throw new ExpressError("Loan doesn't exist", 400);
  }

  res.status(200).json({
    success: true
  });
};

export const fetchLoans = async (req, res) => {
  const { approval_status, min_amount = 0, max_amount = 9999999 } = req.query;
  const loans = await Loan.find({
    $and: [
      approval_status ? { approval_status } : {},
      {
        total_amount: {
          $gte: parseInt(min_amount),
          $lte: parseInt(max_amount)
        }
      }
    ]
  });

  res.status(200).json({
    success: true,
    loans
  });
};
