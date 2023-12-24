import Installment from '../models/installment.js';
import User from '../models/user.js';
import ExpressError from '../utilities/express-error.js';

export const repayInstallment = async (req, res) => {
  const { amount } = req.body;
  const { installment_id } = req.params;
  const { user } = req;

  const installment = await Installment.findById(installment_id).populate({
    path: 'loan',
    populate: {
      path: 'installments'
    }
  });

  if (!installment) {
    throw new ExpressError('Installment not found!', 400);
  }
  if (installment.loan.status === 'pending')
    throw new ExpressError('Your loan is not approved yet!', 400);
  if (installment.user.toString() !== user._id.toString()) {
    throw new ExpressError('You are now authorized!', 401);
  }
  if (installment.status === 'paid')
    throw new ExpressError('This installment is already paid', 400);
  if (amount !== installment.minimum_amount - installment.paid_amount) {
    throw new ExpressError("Unpaid installment amount doesn't match!", 400);
  }

  const allInstallments = installment.loan.installments;
  for (let installm of allInstallments) {
    if (installm.status === 'paid') continue;
    if (installm._id.toString() !== installment_id)
      throw new ExpressError('Another previous installment is unpaid..', 400);

    installment.paid_amount += amount;
    installment.loan.paid_amount += amount;
    if (installment.paid_amount === installment.minimum_amount) {
      installment.status = 'paid';
    }

    await installment.loan.save();
    await installment.save();
    break;
  }

  res.status(200).json({ success: true });
};

export const fetchUnpaidInstallments = async (req, res) => {
  const {
    user: { _id: user_id }
  } = req;

  const installments = await Installment.aggregate([
    {
      $match: { status: 'pending', user: user_id } // Match installments with status 'pending'
    },
    {
      $lookup: {
        from: 'loans',
        localField: 'loan',
        foreignField: '_id',
        as: 'loan'
      }
    },
    {
      $match: { 'loan.approval_status': 'approved' } // Filter based on approval_status of the loan
    }
  ]).exec();

  res.status(200).json({
    success: true,
    installments
  });
};
