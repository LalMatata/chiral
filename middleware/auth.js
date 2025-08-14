import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prepare } from '../database/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const SALT_ROUNDS = 12;

class Auth {
  static async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static async createUser(userData) {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const stmt = prepare(`
      INSERT INTO users (username, password_hash, email, role)
      VALUES (@username, @password_hash, @email, @role)
    `);

    try {
      const info = stmt.run({
        username: userData.username,
        password_hash: hashedPassword,
        email: userData.email,
        role: userData.role || 'sales'
      });

      return this.findUserById(info.lastInsertRowid);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  }

  static findUserById(id) {
    const stmt = prepare('SELECT id, username, email, role, is_active, last_login, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findUserByUsername(username) {
    const stmt = prepare('SELECT * FROM users WHERE username = ? AND is_active = 1');
    return stmt.get(username);
  }

  static findUserByEmail(email) {
    const stmt = prepare('SELECT * FROM users WHERE email = ? AND is_active = 1');
    return stmt.get(email);
  }

  static updateLastLogin(userId) {
    const stmt = prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(userId);
  }

  static async login(username, password) {
    const user = this.findUserByUsername(username);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    this.updateLastLogin(user.id);
    
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static middleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Auth.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  }

  static requireRole(allowedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }

  static async initializeDefaultUser() {
    try {
      const existingAdmin = this.findUserByUsername('admin');
      
      if (!existingAdmin) {
        await this.createUser({
          username: 'admin',
          password: 'ChiralAdmin123!',
          email: 'admin@chiral-robotics.com',
          role: 'admin'
        });
        
        console.log('Default admin user created:');
        console.log('Username: admin');
        console.log('Password: ChiralAdmin123!');
        console.log('Please change this password after first login!');
      }
    } catch (error) {
      console.error('Error creating default user:', error.message);
    }
  }
}

export default Auth;