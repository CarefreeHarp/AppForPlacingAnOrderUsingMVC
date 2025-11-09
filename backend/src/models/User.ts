import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'restaurant' | 'admin' | 'operator';
  phone?: string;
  restaurantId?: string;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['customer', 'restaurant', 'admin', 'operator'] },
  phone: { type: String },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);