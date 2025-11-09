import { Router } from 'express';
import { menuController } from '../controllers/menuController';

const router = Router();

// Get all menu items
router.get('/', menuController.getAllItems);

// Get menu items for a specific restaurant
router.get('/restaurant/:restaurantId', menuController.getRestaurantMenu);

// Get specific menu item
router.get('/:id', menuController.getMenuItem);

// Create new menu item
router.post('/', menuController.createMenuItem);

// Update menu item
router.put('/:id', menuController.updateMenuItem);

// Toggle menu item availability
router.patch('/:id/availability', menuController.toggleAvailability);

// Delete menu item
router.delete('/:id', menuController.deleteMenuItem);

export default router;