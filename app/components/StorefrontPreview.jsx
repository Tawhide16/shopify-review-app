import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  ThumbsUp, 
  Filter, 
  X, 
  ArrowLeft, 
  Sparkles,
  ExternalLink,
  Lock,
  ChevronDown
} from 'lucide-react';
import StarRating from './StarRating';
import GuideBeacon from './GuideBeacon';

export default function StorefrontPreview({
  products = [],
  settings = {},
  onSwitchToAdmin,
  onReviewSubmitted,
  showGuideHints = true
}) {
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 5.0, breakdown: {} });
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helpful state
  const [votedReviews, setVotedReviews] = useState({});

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products]);

  useEffect(() => {
    if (selectedProduct) {
      fetchStorefrontReviews();
    }
  }, [selectedProduct]);

  const fetchStorefrontReviews = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(selectedProduct.shopifyId)}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setStats(data.stats || { total: 0, average: 5.0, breakdown: {} });
      }
    } catch (err) {
      console.error('Error loading storefront reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteHelpful = async (reviewId) => {
    if (votedReviews[reviewId]) return;
    try {
      setVotedReviews(prev => ({ ...prev, [reviewId]: true }));
      const res = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId })
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r));
      }
    } catch (err) {
      console.error('Helpful vote error:', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formTitle.trim() || !formBody.trim() || !formName.trim() || !formEmail.trim()) {
      setFormError('Please complete all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        productId: selectedProduct.shopifyId,
        productTitle: selectedProduct.title,
        shop: 'quick-start-store.myshopify.com',
        rating: formRating,
        title: formTitle.trim(),
        body: formBody.trim(),
        customerName: formName.trim(),
        customerEmail: formEmail.trim()
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setFormSuccess(data.message);
      if (onReviewSubmitted) onReviewSubmitted();

      setTimeout(() => {
        setIsModalOpen(false);
        setFormTitle('');
        setFormBody('');
        setFormName('');
        setFormEmail('');
        setFormSuccess('');
        fetchStorefrontReviews();
      }, 2500);

    } catch (err) {
      setFormError(err.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProduct) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading product preview...</div>;
  }

  // Filter & sort reviews
  let displayedReviews = [...reviews];
  if (filterRating !== 'all') {
    displayedReviews = displayedReviews.filter(r => r.rating === parseInt(filterRating, 10));
  }
  if (sortBy === 'newest') {
    displayedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'highest') {
    displayedReviews.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'lowest') {
    displayedReviews.sort((a, b) => a.rating - b.rating);
  } else if (sortBy === 'helpful') {
    displayedReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
  }

  const starColor = settings.starColor || '#F59E0B';

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Simulation Banner */}
      <div style={{
        background: '#111827',
        color: '#ffffff',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 13
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            background: '#008060',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 11
          }}>
            STOREFRONT THEME PREVIEW
          </span>
          <span>Simulating <strong>Shopify Dawn Theme</strong> with ReviewFlow App Blocks</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#d1d5db' }}>
            <span>Preview Product:</span>
            <select
              style={{
                background: '#1f2937',
                color: '#ffffff',
                border: '1px solid #374151',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer'
              }}
              value={selectedProduct.shopifyId}
              onChange={(e) => {
                const p = products.find(prod => prod.shopifyId === e.target.value);
                if (p) setSelectedProduct(p);
              }}
              id="rf-storefront-product-picker"
            >
              {products.map(p => (
                <option key={p.shopifyId} value={p.shopifyId}>{p.title}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="rf-btn rf-btn-sm"
            onClick={onSwitchToAdmin}
            style={{ background: '#374151', color: '#ffffff', border: 'none' }}
          >
            <ArrowLeft size={13} />
            Back to Merchant Admin
          </button>
        </div>
      </div>

      {/* Mock Storefront Navigation */}
      <div style={{ borderBottom: '1px solid #e5e7eb', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
          AURORA BOUTIQUE
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#4b5563', fontWeight: 500 }}>
          <span>Shop</span>
          <span>Catalog</span>
          <span>About</span>
          <span>Journal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ShoppingBag size={20} color="#111827" />
        </div>
      </div>

      {/* Product Hero Section - Full Width Responsive */}
      <div style={{ maxWidth: 1560, margin: '36px auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'start' }}>
        {/* Product Image */}
        <div>
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.title}
            style={{
              width: '100%',
              borderRadius: 16,
              objectFit: 'cover',
              maxHeight: 480,
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
            }}
          />
        </div>

        {/* Product Details & Extension Star Rating Block */}
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            New Arrival
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#111827', margin: '8px 0 12px 0', lineHeight: 1.2 }}>
            {selectedProduct.title}
          </h1>

          {/* Theme App Extension Block: Star Rating Badge */}
          <GuideBeacon text="👉 Click to jump down to reviews" position="bottom" show={showGuideHints}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                background: '#f8fafc',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                marginBottom: 16
              }}
              onClick={() => {
                document.getElementById('storefront-reviews-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Click to jump to customer reviews"
              id="rf-storefront-star-badge"
            >
              <StarRating 
                rating={Math.round(stats.average || 5)} 
                color={starColor} 
                size={18} 
              />
              <span style={{ fontWeight: 700, fontSize: 14 }}>{stats.average ? stats.average.toFixed(1) : '5.0'}</span>
              <span style={{ color: '#64748b', fontSize: 13 }}>
                ({stats.total} {stats.total === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </GuideBeacon>

          {/* Price */}
          <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
            ${selectedProduct.price.toFixed(2)}
          </div>

          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginBottom: 24 }}>
            {selectedProduct.description}
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '14px 24px',
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              Add to Cart
            </button>
            <GuideBeacon text="👉 Click to write & test a customer review" position="top" show={showGuideHints}>
              <button
                type="button"
                style={{
                  padding: '14px 20px',
                  background: '#ffffff',
                  color: '#111827',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
                onClick={() => setIsModalOpen(true)}
                id="rf-storefront-write-review-btn"
              >
                Write a Review
              </button>
            </GuideBeacon>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, fontSize: 12, color: '#6b7280', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>✓ Fast, carbon-neutral shipping available worldwide</div>
            <div>✓ 30-day money-back satisfaction guarantee</div>
            <div>✓ Authenticated customer reviews powered by ReviewFlow</div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* Theme App Extension Block: Customer Reviews List Section */}
      {/* ========================================================== */}
      <div 
        id="storefront-reviews-section"
        style={{
          maxWidth: 1560,
          margin: '60px auto 0',
          padding: '0 40px'
        }}
      >
        <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: 40, marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
            Customer Reviews
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            Real experiences from verified purchasers of this product.
          </p>
        </div>

        {/* Summary Header Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr 200px',
          gap: 32,
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: '28px 32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: 24
        }}>
          {/* Big Score */}
          <div>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
              {stats.average ? stats.average.toFixed(1) : '5.0'}
            </div>
            <div style={{ margin: '8px 0 4px 0' }}>
              <StarRating rating={Math.round(stats.average || 5)} color={starColor} size={22} />
            </div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              Based on {stats.total} verified {stats.total === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          {/* Histogram */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = stats.breakdown ? (stats.breakdown[star] || 0) : 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ width: 44, color: '#4b5563', fontWeight: 600 }}>{star} ★</span>
                  <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: starColor, borderRadius: 999 }} />
                  </div>
                  <span style={{ width: 30, textAlign: 'right', color: '#6b7280' }}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '12px 20px',
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(17,24,39,0.12)'
              }}
              id="rf-cta-write-review-btn"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Toolbar: Filter & Sort */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          background: '#f8fafc',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4b5563' }}>
            <span>Filter:</span>
            <select
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff' }}
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              id="rf-storefront-filter-rating"
            >
              <option value="all">All Stars ({reviews.length})</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4b5563' }}>
            <span>Sort by:</span>
            <select
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="rf-storefront-sort-by"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {displayedReviews.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              border: '1px dashed #cbd5e1',
              borderRadius: 12,
              color: '#6b7280'
            }}>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: 6 }}>No approved reviews matching this selection</p>
              <p style={{ fontSize: 13 }}>Be the first customer to share your thoughts!</p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                style={{
                  marginTop: 14,
                  padding: '8px 16px',
                  background: '#111827',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Write a Review
              </button>
            </div>
          ) : (
            displayedReviews.map((rev, idx) => (
              <div
                key={rev.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                }}
                id={`storefront-rev-${rev.id}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: '#f1f5f9',
                      color: '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 14
                    }}>
                      {(rev.customerName || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                          {rev.customerName}
                        </span>
                        {rev.verified && settings.showVerifiedBuyer && (
                          <span style={{
                            background: '#ecfdf5',
                            color: '#065f46',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3
                          }}>
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <StarRating rating={rev.rating} color={starColor} size={16} />
                </div>

                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '10px 0 6px 0' }}>
                  {rev.title}
                </h4>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginBottom: 14 }}>
                  {rev.body}
                </p>

                {/* Merchant Reply */}
                {rev.merchantReply && (
                  <div style={{
                    background: '#f8fafc',
                    borderLeft: '3px solid #008060',
                    padding: '12px 16px',
                    borderRadius: '0 8px 8px 0',
                    margin: '12px 0',
                    fontSize: 13
                  }}>
                    <div style={{ fontWeight: 700, color: '#065f46', marginBottom: 2 }}>
                      Response from Store Owner
                    </div>
                    <div style={{ color: '#334155' }}>
                      {rev.merchantReply}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                  {idx === 0 ? (
                    <GuideBeacon text="👉 Click to vote review helpful" position="left" show={showGuideHints}>
                      <button
                        type="button"
                        onClick={() => handleVoteHelpful(rev.id)}
                        style={{
                          background: votedReviews[rev.id] ? '#eff6ff' : 'none',
                          color: votedReviews[rev.id] ? '#2563eb' : '#6b7280',
                          border: '1px solid #e5e7eb',
                          padding: '5px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                        id={`rf-helpful-btn-${rev.id}`}
                      >
                        <ThumbsUp size={12} />
                        Helpful ({rev.helpfulCount || 0})
                      </button>
                    </GuideBeacon>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleVoteHelpful(rev.id)}
                      style={{
                        background: votedReviews[rev.id] ? '#eff6ff' : 'none',
                        color: votedReviews[rev.id] ? '#2563eb' : '#6b7280',
                        border: '1px solid #e5e7eb',
                        padding: '5px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      id={`rf-helpful-btn-${rev.id}`}
                    >
                      <ThumbsUp size={12} />
                      Helpful ({rev.helpfulCount || 0})
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* Theme App Extension Block: Review Submission Modal */}
      {/* ========================================================== */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            maxWidth: 560,
            width: '100%',
            padding: 32,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>
                  Write a Review
                </h3>
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                  For {selectedProduct.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                aria-label="Close review modal"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                {formError}
              </div>
            )}

            {formSuccess && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '14px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                <strong>Submission Received!</strong>
                <p style={{ marginTop: 4 }}>{formSuccess}</p>
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className="rf-btn rf-btn-sm rf-btn-primary"
                    onClick={() => {
                      setIsModalOpen(false);
                      onSwitchToAdmin();
                    }}
                  >
                    Go to Merchant Moderation Queue →
                  </button>
                </div>
              </div>
            )}

            {!formSuccess && (
              <form onSubmit={handleSubmitReview}>
                {/* Rating picker */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Overall Rating <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StarRating
                      rating={formRating}
                      interactive={true}
                      size={30}
                      color={starColor}
                      onChange={(val) => setFormRating(val)}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#059669' }}>
                      {formRating} Stars
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Headline / Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Best purchase I made this year!"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    id="rf-form-input-title"
                  />
                </div>

                {/* Body */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Review Details <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    minLength={10}
                    placeholder="Tell us what you liked, how it performs, or any advice for other buyers..."
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    id="rf-form-input-body"
                  />
                  <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 3 }}>
                    {formBody.length}/2000
                  </div>
                </div>

                {/* Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                      Your Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amanda Cole"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      id="rf-form-input-name"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="amanda@example.com"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      id="rf-form-input-email"
                    />
                    <span style={{ fontSize: 11, color: '#64748b', marginTop: 3, display: 'block' }}>
                      (Try <em>marcus.v@example.com</em> to test Verified Buyer!)
                    </span>
                  </div>
                </div>

                {/* Security notice */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 6,
                  padding: '8px 12px',
                  fontSize: 12,
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 20
                }}>
                  <Lock size={13} />
                  <span>Protected by ReviewFlow Anti-Spam and automated Verified Buyer verification.</span>
                </div>

                {/* Modal actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: '10px 18px',
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '10px 22px',
                      background: '#111827',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                    id="rf-form-submit-btn"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
