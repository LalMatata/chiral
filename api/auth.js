// Vercel Serverless Function for Authentication
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, headers, body } = req;

  // Get admin API key from environment
  const adminApiKey = process.env.ADMIN_API_KEY || 'chiral_admin_2025_secure_key_change_in_production';
  
  if (method === 'POST') {
    try {
      const { apiKey, action } = typeof body === 'string' ? JSON.parse(body) : body;

      if (action === 'verify') {
        // Verify API key
        if (apiKey === adminApiKey) {
          return res.status(200).json({
            success: true,
            message: 'Authentication successful',
            authenticated: true,
            timestamp: new Date().toISOString()
          });
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid API key',
            authenticated: false
          });
        }
      }

      if (action === 'login') {
        const { username, password } = typeof body === 'string' ? JSON.parse(body) : body;
        
        // Default admin credentials (should be changed in production)
        if (username === 'admin' && password === 'ChiralAdmin123!') {
          // Set authentication cookie
          res.setHeader('Set-Cookie', [
            `chiral_auth_token=${adminApiKey}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`,
            `chiral_auth_user=admin; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
          ]);

          return res.status(200).json({
            success: true,
            message: 'Login successful',
            authenticated: true,
            user: 'admin',
            token: adminApiKey
          });
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "verify" or "login".'
      });

    } catch (error) {
      console.error('Auth API Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Authentication failed'
      });
    }
  }

  if (method === 'GET') {
    // Check authentication status from cookies or headers
    const authToken = req.cookies?.chiral_auth_token || headers['x-api-key'] || headers['authorization']?.replace('Bearer ', '');
    
    if (authToken === adminApiKey) {
      return res.status(200).json({
        success: true,
        authenticated: true,
        user: req.cookies?.chiral_auth_user || 'admin',
        message: 'Authentication verified'
      });
    } else {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Not authenticated'
      });
    }
  }

  if (method === 'DELETE') {
    // Logout - clear authentication cookies
    res.setHeader('Set-Cookie', [
      'chiral_auth_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/',
      'chiral_auth_user=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
    ]);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      authenticated: false
    });
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'OPTIONS']);
  return res.status(405).json({
    success: false,
    message: `Method ${method} not allowed`
  });
}