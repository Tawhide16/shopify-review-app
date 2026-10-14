import React from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  Smile, 
  Meh, 
  Frown, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import StarRating from './StarRating';
import GuideBeacon from './GuideBeacon';

export default function AnalyticsTab({
  stats = {},
  reviews = [],
  products = [],
  showGuideHints = true
}) {
  // Calculate Sentiment Breakdown
  const totalApproved = reviews.filter(r => r.status === 'APPROVED');
  const positiveCount = totalApproved.filter(r => r.rating >= 4).length;
  const neutralCount = totalApproved.filter(r => r.rating === 3).length;
  const criticalCount = totalApproved.filter(r => r.rating <= 2).length;

  const total = totalApproved.length || 1;
  const positivePct = Math.round((positiveCount / total) * 100);
  const neutralPct = Math.round((neutralCount / total) * 100);
  const criticalPct = Math.round((criticalCount / total) * 100);

  // Per Product Breakdown
  const productStats = products.map(prod => {
    const prodReviews = reviews.filter(r => r.productId === prod.shopifyId && r.status === 'APPROVED');
    const count = prodReviews.length;
    const avg = count > 0 ? (prodReviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1) : '5.0';
    return {
      ...prod,
      count,
      avg: Number(avg)
    };
  }).sort((a, b) => b.count - a.count);

  // Export CSV Function
  const handleExportCSV = () => {
    if (reviews.length === 0) {
      alert('No reviews available to export.');
      return;
    }

    const headers = ['ID', 'Product Title', 'Rating', 'Review Title', 'Review Body', 'Customer Name', 'Customer Email', 'Status', 'Verified Buyer', 'Created Date'];
    const rows = reviews.map(r => [
      `"${r.id}"`,
      `"${(r.productTitle || '').replace(/"/g, '""')}"`,
      r.rating,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${(r.body || '').replace(/"/g, '""')}"`,
      `"${(r.customerName || '').replace(/"/g, '""')}"`,
      `"${r.customerEmail || ''}"`,
      r.status,
      r.verified ? 'YES' : 'NO',
      new Date(r.createdAt).toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reviewflow_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Header */}
      <div className="rf-page-header">
        <div>
          <h1 className="rf-page-title">
            <span>Customer Feedback Analytics</span>
          </h1>
          <p className="rf-page-subtitle">
            Understand customer sentiment, rating distributions, and top-rated catalog products.
          </p>
        </div>

        <GuideBeacon text="👉 Click to export customer feedback to CSV" position="bottom" show={showGuideHints}>
          <button 
            type="button" 
            className="rf-btn rf-btn-secondary"
            onClick={handleExportCSV}
            id="rf-analytics-export-csv"
          >
            <Download size={15} />
            Export Reviews to CSV
          </button>
        </GuideBeacon>
      </div>

      {/* Top 4 Insight Cards */}
      <div className="rf-metrics-grid">
        <div className="rf-metric-card">
          <div className="rf-metric-top">
            <span className="rf-metric-label">All Time Reviews</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#ecfdf5', color: '#047857' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="rf-metric-value">{stats.totalReviews || 0}</div>
          <div className="rf-metric-footer trend-positive">
            <TrendingUp size={13} />
            <span>Active review collection</span>
          </div>
        </div>

        <div className="rf-metric-card">
          <div className="rf-metric-top">
            <span className="rf-metric-label">Average Satisfaction</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#fffbeb', color: '#b45309' }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>
          <div className="rf-metric-value">
            {stats.averageRating ? stats.averageRating.toFixed(1) : '5.0'} / 5.0
          </div>
          <div className="rf-metric-footer">
            <span>Customer trust rating</span>
          </div>
        </div>

        <div className="rf-metric-card">
          <div className="rf-metric-top">
            <span className="rf-metric-label">Verified Buyer Rate</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="rf-metric-value">{stats.verifiedPercentage || 0}%</div>
          <div className="rf-metric-footer">
            <span>Shopify order-verified buyers</span>
          </div>
        </div>

        <div className="rf-metric-card">
          <div className="rf-metric-top">
            <span className="rf-metric-label">Reviews This Month</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div className="rf-metric-value">{stats.reviewsThisMonth || 0}</div>
          <div className="rf-metric-footer trend-positive">
            <span>New customer submissions</span>
          </div>
        </div>
      </div>

      {/* Grid: Sentiment Analysis & Rating Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Sentiment Analysis */}
        <div className="rf-card">
          <div className="rf-card-header">
            <div className="rf-card-title">
              <Smile size={16} color="#008060" />
              <span>Customer Sentiment Distribution</span>
            </div>
          </div>
          <div className="rf-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Positive */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: '#15803d' }}>
                    <Smile size={16} /> Positive (4-5 Stars)
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{positivePct}% ({positiveCount})</span>
                </div>
                <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${positivePct}%`, height: '100%', background: '#22c55e', borderRadius: 999 }} />
                </div>
              </div>

              {/* Neutral */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: '#b45309' }}>
                    <Meh size={16} /> Neutral (3 Stars)
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{neutralPct}% ({neutralCount})</span>
                </div>
                <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${neutralPct}%`, height: '100%', background: '#f59e0b', borderRadius: 999 }} />
                </div>
              </div>

              {/* Critical */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: '#b91c1c' }}>
                    <Frown size={16} /> Critical / Needs Attention (1-2 Stars)
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{criticalPct}% ({criticalCount})</span>
                </div>
                <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${criticalPct}%`, height: '100%', background: '#ef4444', borderRadius: 999 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="rf-card">
          <div className="rf-card-header">
            <div className="rf-card-title">
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <span>5-Star Breakdown</span>
            </div>
          </div>
          <div className="rf-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = stats.breakdown ? (stats.breakdown[star] || 0) : 0;
                const totalApp = stats.approvedReviews || 0;
                const pct = totalApp > 0 ? Math.round((count / totalApp) * 100) : 0;

                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                    <span style={{ width: 50, fontWeight: 600, color: '#374151' }}>{star} Stars</span>
                    <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: 999 }} />
                    </div>
                    <span style={{ width: 36, textAlign: 'right', color: '#6b7280', fontVariantNumeric: 'tabular-nums' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="rf-card">
        <div className="rf-card-header">
          <div className="rf-card-title">
            <BarChart3 size={16} color="#008060" />
            <span>Product Catalog Review Performance</span>
          </div>
        </div>
        <div className="rf-card-body" style={{ padding: 0 }}>
          <table className="rf-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ width: 140 }}>Average Rating</th>
                <th style={{ width: 140 }}>Total Approved</th>
                <th style={{ width: 140 }}>Storefront Badge</th>
              </tr>
            </thead>
            <tbody>
              {productStats.map(prod => (
                <tr key={prod.shopifyId}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{prod.title}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>${prod.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{prod.avg.toFixed(1)}</span>
                      <StarRating rating={Math.round(prod.avg)} size={14} />
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{prod.count} reviews</span>
                  </td>
                  <td>
                    <span className="rf-badge rf-badge-success">
                      ✓ Extension Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
