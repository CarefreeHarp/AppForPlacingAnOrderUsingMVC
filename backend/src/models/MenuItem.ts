import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating: number;
  restaurantId: Schema.Types.ObjectId;
  available: boolean;
}

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 0 },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  available: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);