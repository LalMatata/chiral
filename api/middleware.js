// Authentication middleware for Vercel functions
export function authenticateRequest(req) {
  const adminApiKey = process.env.ADMIN_API_KEY || 'chiral_admin_2025_secure_key_change_in_production';
  
  // Check for API key in various places
  const authToken = 
    req.cookies?.chiral_auth_token ||
    req.headers['x-api-key'] || 
    req.headers['authorization']?.replace('Bearer ', '') ||
    req.query?.apiKey;

  return {
    isAuthenticated: authToken === adminApiKey,
    user: req.cookies?.chiral_auth_user || 'admin',
    token: authToken
  };
}

export function requireAuth(handler) {
  return (req, res) => {
    const auth = authenticateRequest(req);
    
    if (!auth.isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        authenticated: false
      });
    }

    // Add auth info to request
    req.auth = auth;
    return handler(req, res);
  };
}

export function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-API-Key'
  );
}