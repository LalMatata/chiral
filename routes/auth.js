import express from 'express';
import Auth from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await Auth.login(username, password);
    const token = Auth.generateToken(user);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

router.post('/register', Auth.middleware, Auth.requireRole(['admin']), async (req, res) => {
  try {
    const { username, password, email, role = 'sales' } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ 
        error: 'Username, password, and email are required' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }

    const validRoles = ['admin', 'manager', 'sales'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be admin, manager, or sales' 
      });
    }

    const user = await Auth.createUser({
      username,
      password,
      email,
      role
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/me', Auth.middleware, (req, res) => {
  try {
    const user = Auth.findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.last_login
      }
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});

router.post('/change-password', Auth.middleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: 'New password must be at least 8 characters long' 
      });
    }

    const user = Auth.findUserByUsername(req.user.username);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await Auth.verifyPassword(currentPassword, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await Auth.hashPassword(newPassword);
    
    const { prepare } = await import('../database/db.js');
    const stmt = prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(hashedNewPassword, req.user.id);

    res.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

router.get('/users', Auth.middleware, Auth.requireRole(['admin', 'manager']), (req, res) => {
  try {
    const { prepare } = require('../database/db.js');
    const stmt = prepare(`
      SELECT id, username, email, role, is_active, last_login, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    const users = stmt.all();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id', Auth.middleware, Auth.requireRole(['admin']), async (req, res) => {
  try {
    const { role, is_active } = req.body;
    const userId = req.params.id;
    
    if (!role && is_active === undefined) {
      return res.status(400).json({ error: 'Role or active status is required' });
    }

    const validRoles = ['admin', 'manager', 'sales'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const { prepare } = await import('../database/db.js');
    const fields = [];
    const params = { id: userId };

    if (role) {
      fields.push('role = @role');
      params.role = role;
    }

    if (is_active !== undefined) {
      fields.push('is_active = @is_active');
      params.is_active = is_active ? 1 : 0;
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      const stmt = prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = @id`);
      stmt.run(params);
    }

    const user = Auth.findUserById(userId);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', Auth.middleware, Auth.requireRole(['admin']), (req, res) => {
  try {
    const userId = req.params.id;
    
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const { prepare } = require('../database/db.js');
    const stmt = prepare('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const info = stmt.run(userId);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;