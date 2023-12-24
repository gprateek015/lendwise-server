import Loan from '../models/loan.js';
import Installment from '../models/installment.js';
import User from '../models/user.js';
import ExpressError from '../utilities/express-error.js';

export const requestNewLoan = async (req, res) => {
  const { user } = req;
  const { amount, duration } = req.body;
  if (amount > 10 ** 5)
    throw new ExpressError('Maximum loan amount can be $1,000,000 only!', 400);
  const newLoan = new Loan({
    total_amount: amount,
    duration,
    date: new Date(),
    user
  });

  const installments = [...Array(parseInt(duration))].map((_, i) => ({
    scheduled_date: new Date(
      new Date().setDate(new Date().getDate() + 7 * (i + 1))
    ),
    minimum_amount: amount / duration,
    loan: newLoan,
    user
  }));

  newLoan.installments = await Installment.insertMany(installments);
  await newLoan.save();

  res.status(200).json({
    success: true
  });
};

export const fetchAllLoans = async (req, res) => {
  const { user } = req;

  const loans = await Loan.find({ user: user._id })
    .populate({
      path: 'installments',
      options: { sort: { scheduled_date: 1 } } // Sort by scheduled_date in ascending order
    })
    .sort({ scheduled_date: 1 });

  res.status(200).json({
    success: true,
    loans
  });
};

export const repayLoan = async (req, res) => {
  let { amount } = req.body;
  const { loan_id } = req.params;

  const loan = await Loan.findById(loan_id).populate('installments');

  if (!loan) throw new ExpressError('Invalid Loan repay request', 400);
  if (loan.total_amount - loan.paid_amount < amount)
    throw new ExpressError(
      'You have paid more than the amount left to pay',
      400
    );
  if (loan.approval_status === 'pending')
    throw new ExpressError('Loan is not yet approved', 400);

  loan.paid_amount += amount;

  let flag = false;

  const installments = loan.installments.sort(
    (a, b) => a.scheduled_date - b.scheduled_date
  );
  for (let installment of installments) {
    if (installment.status === 'paid') continue;
    if (amount === 0) break;

    const { minimum_amount } = installment;
    let { paid_amount } = installment;

    if (!flag && amount < minimum_amount - paid_amount) {
      throw new ExpressError(
        `Minimum amount to be paid must be ${minimum_amount - paid_amount}`,
        400
      );
    }

    if (amount >= minimum_amount - paid_amount) {
      installment.status = 'paid';
      amount -= minimum_amount - paid_amount;
      installment.paid_date = new Date();
      paid_amount += minimum_amount - paid_amount;
    } else {
      paid_amount += amount;
      amount = 0;
    }

    flag = true;
    installment.paid_amount = paid_amount;
    await installment.save();
  }

  if (loan.paid_amount === loan.total_amount) {
    loan.status = 'paid';
  }
  await loan.save();

  res.status(200).json({
    success: true
  });
};
