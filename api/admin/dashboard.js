import { requireAuth, corsHeaders } from '../middleware.js';

// Protected admin dashboard API
function dashboardHandler(req, res) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return dashboard data for authenticated admin
    const dashboardData = {
      success: true,
      message: 'Dashboard data retrieved successfully',
      user: req.auth.user,
      data: {
        totalLeads: 142,
        todayLeads: 8,
        conversionRate: 12.5,
        totalValue: 348000,
        recentActivity: [
          {
            id: 1,
            type: 'lead',
            company: 'Tech Solutions Ltd',
            timestamp: new Date().toISOString(),
            value: 5000
          },
          {
            id: 2,
            type: 'demo',
            company: 'Industrial Corp',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            value: 12000
          }
        ],
        stats: {
          leads: {
            total: 142,
            thisWeek: 23,
            thisMonth: 89,
            conversionRate: 12.5
          },
          revenue: {
            total: 348000,
            thisWeek: 45000,
            thisMonth: 156000,
            projected: 420000
          },
          performance: {
            responseTime: '1.2h',
            satisfaction: 4.6,
            followUpRate: 89
          }
        }
      },
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(dashboardData);
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'OPTIONS']);
  return res.status(405).json({
    success: false,
    message: `Method ${req.method} not allowed`
  });
}

// Export the protected handler
export default requireAuth(dashboardHandler);