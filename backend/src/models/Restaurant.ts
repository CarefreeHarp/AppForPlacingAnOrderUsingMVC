import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  cuisine: string[];
  isOpen: boolean;
  image?: string;
}

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  deliveryTime: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  cuisine: [{ type: String }],
  isOpen: { type: Boolean, default: true },
  image: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);