import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const userController = {
  // User Registration
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, phone, restaurantId } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        restaurantId
      });

      await user.save();

      // Create token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ message: 'Error registering user', error });
    }
  },

  // User Login
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  },

  // Get user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error });
    }
  },

  // Update user profile
  updateProfile: async (req: Request, res: Response) => {
    try {
      const { name, phone } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, phone },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error updating profile', error });
    }
  },

  // Change password
  changePassword: async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error changing password', error });
    }
  }
};