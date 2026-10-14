import React from 'react';
import { 
  Star, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  BadgePercent, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import StarRating from './StarRating';
import GuideBeacon from './GuideBeacon';

export default function DashboardTab({
  stats,
  pendingReviews = [],
  onApproveReview,
  onRejectReview,
  onNavigateToReviews,
  onNavigateToSettings,
  onNavigateToPreview,
  showGuideHints = true
}) {
  return (
    <div>
      {/* Header */}
      <div className="rf-page-header">
        <div>
          <h1 className="rf-page-title">
            <span>Reviews Overview</span>
          </h1>
          <p className="rf-page-subtitle">
            Monitor real-time customer feedback, pending submissions, and overall product satisfaction.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            type="button" 
            className="rf-btn rf-btn-secondary"
            onClick={onNavigateToSettings}
          >
            Widget Settings
          </button>
          
          <GuideBeacon text="👉 Click to moderate incoming reviews" position="bottom" show={showGuideHints}>
            <button 
              type="button" 
              className="rf-btn rf-btn-primary rf-action-highlight"
              onClick={onNavigateToReviews}
              id="rf-dash-moderate-btn"
            >
              Open Moderation Queue ({stats.pendingReviews || 0})
              <ArrowRight size={14} />
            </button>
          </GuideBeacon>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="rf-metrics-grid">
        {/* Total Reviews */}
        <div className="rf-metric-card">
          <div className="rf-metric-top">
            <span className="rf-metric-label">Total Reviews</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#f0fdf4', color: '#15803d' }}>
              <MessageCircle size={18} />
            </div>
          </div>
          <div className="rf-metric-value">{stats.totalReviews || 0}</div>
          <div className="rf-metric-footer trend-positive">
            <TrendingUp size={13} />
            <span>+{stats.reviewsThisMonth || 0} this month</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="rf-metric-card">
          <div className="rf-metric-top">
            <span className="rf-metric-label">Average Rating</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#fffbeb', color: '#b45309' }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>
          <div className="rf-metric-value">
            <span>{stats.averageRating ? stats.averageRating.toFixed(1) : '5.0'}</span>
            <StarRating rating={Math.round(stats.averageRating || 5)} size={16} />
          </div>
          <div className="rf-metric-footer">
            <span>Based on approved ratings</span>
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="rf-metric-card" style={{ borderColor: stats.pendingReviews > 0 ? '#fedcb4' : 'var(--p-border)' }}>
          <div className="rf-metric-top">
            <span className="rf-metric-label">Pending Approval</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#fff5ea', color: '#b45309' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="rf-metric-value" style={{ color: stats.pendingReviews > 0 ? '#b45309' : 'inherit' }}>
            {stats.pendingReviews || 0}
          </div>
          <div className="rf-metric-footer">
            {stats.pendingReviews > 0 ? (
              <span style={{ color: '#b45309', fontWeight: 600 }}>Action needed by merchant</span>
            ) : (
              <span style={{ color: '#15803d' }}>Queue is all caught up!</span>
            )}
          </div>
        </div>

        {/* Approved Reviews */}
        <div className="rf-metric-card">
          <div className="rf-metric-top">
            <span className="rf-metric-label">Approved & Live</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#ecfdf5', color: '#047857' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="rf-metric-value">{stats.approvedReviews || 0}</div>
          <div className="rf-metric-footer trend-positive">
            <span>Published to storefront</span>
          </div>
        </div>

        {/* Verified Buyer % */}
        <div className="rf-metric-card">
          <div className="rf-metric-top">
            <span className="rf-metric-label">Verified Buyer Rate</span>
            <div className="rf-metric-icon-wrap" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="rf-metric-value">
            {stats.verifiedPercentage || 0}%
          </div>
          <div className="rf-metric-footer">
            <span>{stats.verifiedCount || 0} confirmed buyers</span>
          </div>
        </div>
      </div>

      {/* Grid: Quick Moderation Queue & Rating Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        {/* Left Column: Quick Moderation Queue */}
        <div className="rf-card">
          <div className="rf-card-header">
            <div className="rf-card-title">
              <Clock size={16} color="#d97706" />
              <span>Pending Reviews Awaiting Approval</span>
              {pendingReviews.length > 0 && (
                <span className="rf-badge rf-badge-attention">{pendingReviews.length} new</span>
              )}
            </div>
            {pendingReviews.length > 0 && (
              <button 
                type="button" 
                className="rf-btn-plain" 
                onClick={onNavigateToReviews}
              >
                View all
              </button>
            )}
          </div>

          <div className="rf-card-body" style={{ padding: 0 }}>
            {pendingReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ marginBottom: 8 }} />
                <p style={{ fontWeight: 600, color: '#111827' }}>No reviews currently pending approval</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>
                  Any new customer submissions requiring merchant approval will show up here.
                </p>
                <button 
                  type="button" 
                  className="rf-btn rf-btn-secondary"
                  onClick={onNavigateToPreview}
                  style={{ marginTop: 16 }}
                >
                  <Sparkles size={14} />
                  Test Submitting a Review on Storefront
                </button>
              </div>
            ) : (
              <div>
                {pendingReviews.slice(0, 4).map((review, index) => (
                  <div 
                    key={review.id}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f1f2f3',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StarRating rating={review.rating} size={14} />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{review.title}</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#6d7175' }}>
                        {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.4 }}>
                      "{review.body}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <div style={{ fontSize: 12, color: '#6d7175' }}>
                        by <strong>{review.customerName}</strong> ({review.customerEmail}) on <em>{review.productTitle}</em>
                        {review.verified && (
                          <span className="rf-badge rf-badge-success" style={{ marginLeft: 6, fontSize: 10, padding: '1px 6px' }}>
                            Verified Buyer
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <GuideBeacon
                          text="👉 1-Click Approve & Publish"
                          position="left"
                          show={showGuideHints && index === 0}
                        >
                          <button
                            type="button"
                            className="rf-btn rf-btn-sm rf-btn-primary"
                            onClick={() => onApproveReview(review.id)}
                            id={`dash-approve-${review.id}`}
                          >
                            <CheckCircle2 size={13} />
                            Approve
                          </button>
                        </GuideBeacon>
                        <button
                          type="button"
                          className="rf-btn rf-btn-sm rf-btn-destructive"
                          onClick={() => onRejectReview(review.id)}
                          id={`dash-reject-${review.id}`}
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Rating Distribution */}
        <div className="rf-card">
          <div className="rf-card-header">
            <div className="rf-card-title">
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <span>Customer Satisfaction</span>
            </div>
          </div>

          <div className="rf-card-body">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                {stats.averageRating ? stats.averageRating.toFixed(1) : '5.0'}
              </div>
              <div style={{ margin: '6px 0' }}>
                <StarRating rating={Math.round(stats.averageRating || 5)} size={20} />
              </div>
              <div style={{ fontSize: 12, color: '#6d7175' }}>
                Based on {stats.approvedReviews || 0} verified customer reviews
              </div>
            </div>

            {/* Distribution bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = stats.breakdown ? (stats.breakdown[star] || 0) : 0;
                const total = stats.approvedReviews || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ width: 44, color: '#374151', fontWeight: 500 }}>{star} ★</span>
                    <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${pct}%`, 
                          height: '100%', 
                          background: '#f59e0b', 
                          borderRadius: 999,
                          transition: 'width 0.4s ease' 
                        }}
                      />
                    </div>
                    <span style={{ width: 32, textAlign: 'right', color: '#6b7280', fontVariantNumeric: 'tabular-nums' }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick banner */}
            <div style={{ 
              marginTop: 24, 
              padding: 14, 
              background: '#f0fdf4', 
              borderRadius: 8, 
              border: '1px solid #bbf7d0',
              fontSize: 12,
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <ShieldCheck size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Shopify Extension Active:</strong> Storefront widget is installed on product templates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
