import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  mobile_no: {
    type: String,
    unique: true,
    required: true
  },
  hash_password: {
    type: String,
    required: true
  },
  user_type: {
    type: String,
    required: true,
    default: 'consumer',
    enum: ['consumer', 'admin']
  },
  loans: [
    {
      type: Schema.ObjectId,
      ref: 'Loan'
    }
  ]
});

const User = model('User', userSchema);
export default User;
