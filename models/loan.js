import { Schema, model } from 'mongoose';
import User from './user.js';

const loanSchema = new Schema({
  total_amount: {
    type: Number,
    required: true
  },
  paid_amount: {
    type: Number,
    required: true,
    default: 0
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration of loan must be atleast 1 week']
  },
  approval_status: {
    type: String,
    required: true,
    enum: ['approved', 'pending'],
    default: 'pending'
  },
  status: {
    type: String,
    required: true,
    enum: ['paid', 'pending'],
    default: 'pending'
  },
  date: {
    type: Date,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  installments: [
    {
      type: Schema.ObjectId,
      ref: 'Installment'
    }
  ]
});

// To append the loan in the users loans attribute
loanSchema.pre('save', async function (next) {
  const user = await User.findById(this.user);
  user.loans.push(this);
  await user.save();
  next();
});

const Loan = model('Loan', loanSchema);
export default Loan;
