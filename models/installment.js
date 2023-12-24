import { Schema, model } from 'mongoose';

const installmentSchema = new Schema({
  paid_amount: {
    type: Number,
    required: true,
    default: 0
  },
  minimum_amount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['paid', 'pending'],
    default: 'pending'
  },
  scheduled_date: {
    type: Date,
    required: true
  },
  paid_date: {
    // Date when this installment is paid
    type: Date,
    required: false
  },
  loan: {
    type: Schema.ObjectId,
    ref: 'Loan'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

const Installment = model('Installment', installmentSchema);
export default Installment;
