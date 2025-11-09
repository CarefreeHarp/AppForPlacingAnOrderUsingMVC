import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';

export const restaurantController = {
  // Get all restaurants
  getAllRestaurants: async (req: Request, res: Response) => {
    try {
      const restaurants = await Restaurant.find();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching restaurants', error });
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching restaurant', error });
    }
  },

  // Create restaurant
  createRestaurant: async (req: Request, res: Response) => {
    try {
      const restaurant = new Restaurant(req.body);
      await restaurant.save();
      res.status(201).json(restaurant);
    } catch (error) {
      res.status(400).json({ message: 'Error creating restaurant', error });
    }
  },

  // Update restaurant
  updateRestaurant: async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ message: 'Error updating restaurant', error });
    }
  },

  // Delete restaurant
  deleteRestaurant: async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting restaurant', error });
    }
  }
};