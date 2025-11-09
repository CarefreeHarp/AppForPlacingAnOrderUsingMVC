import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';

export const menuController = {
  // Get all menu items
  getAllItems: async (req: Request, res: Response) => {
    try {
      const items = await MenuItem.find();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching menu items', error });
    }
  },

  // Get menu items by restaurant
  getRestaurantMenu: async (req: Request, res: Response) => {
    try {
      const items = await MenuItem.find({ restaurantId: req.params.restaurantId });
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching restaurant menu', error });
    }
  },

  // Get menu item by ID
  getMenuItem: async (req: Request, res: Response) => {
    try {
      const item = await MenuItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching menu item', error });
    }
  },

  // Create menu item
  createMenuItem: async (req: Request, res: Response) => {
    try {
      const item = new MenuItem(req.body);
      await item.save();
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: 'Error creating menu item', error });
    }
  },

  // Update menu item
  updateMenuItem: async (req: Request, res: Response) => {
    try {
      const item = await MenuItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: 'Error updating menu item', error });
    }
  },

  // Update menu item availability
  toggleAvailability: async (req: Request, res: Response) => {
    try {
      const item = await MenuItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      item.available = !item.available;
      await item.save();
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: 'Error updating availability', error });
    }
  },

  // Delete menu item
  deleteMenuItem: async (req: Request, res: Response) => {
    try {
      const item = await MenuItem.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting menu item', error });
    }
  }
};