import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  Palette, 
  ShieldCheck, 
  Layout, 
  Mail, 
  Check, 
  Sparkles,
  Eye
} from 'lucide-react';
import StarRating from './StarRating';
import GuideBeacon from './GuideBeacon';

const COLOR_PRESETS = [
  { name: 'Warm Amber', color: '#F59E0B' },
  { name: 'Classic Gold', color: '#EAB308' },
  { name: 'Emerald Forest', color: '#10B981' },
  { name: 'Sapphire Modern', color: '#3B82F6' },
  { name: 'Rose Quartz', color: '#F43F5E' },
  { name: 'Onyx Black', color: '#111827' }
];

export default function SettingsTab({
  settings = {},
  onSaveSettings,
  showGuideHints = true
}) {
  const [formData, setFormData] = useState({
    enableReviews: settings.enableReviews ?? true,
    requireApproval: settings.requireApproval ?? true,
    autoApproveMinStars: settings.autoApproveMinStars ?? 5,
    showVerifiedBuyer: settings.showVerifiedBuyer ?? true,
    showReviewImages: settings.showReviewImages ?? true,
    allowCustomerName: settings.allowCustomerName ?? true,
    allowCustomerEmail: settings.allowCustomerEmail ?? true,
    starColor: settings.starColor || '#F59E0B',
    starSize: settings.starSize || 'medium',
    reviewLayout: settings.reviewLayout || 'list',
    reviewsPerPage: settings.reviewsPerPage || 5,
    notifyOnNewReview: settings.notifyOnNewReview ?? true,
    merchantEmail: settings.merchantEmail || 'merchant@quick-start-store.myshopify.com'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getStarSizePx = () => {
    if (formData.starSize === 'small') return 16;
    if (formData.starSize === 'large') return 24;
    return 20;
  };

  return (
    <div>
      {/* Header */}
      <div className="rf-page-header">
        <div>
          <h1 className="rf-page-title">
            <span>Widget & Moderation Settings</span>
          </h1>
          <p className="rf-page-subtitle">
            Configure how reviews appear on your Shopify storefront and customize moderation rules.
          </p>
        </div>

        <GuideBeacon text="👉 Click to save your widget settings" position="bottom" show={showGuideHints}>
          <button 
            type="button" 
            className="rf-btn rf-btn-primary"
            onClick={handleSubmit}
            id="rf-settings-save-btn"
          >
            {savedSuccess ? (
              <>
                <Check size={16} />
                Saved Settings!
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </GuideBeacon>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form Controls */}
        <form onSubmit={handleSubmit}>
          {/* Card 1: Moderation Policies */}
          <div className="rf-card">
            <div className="rf-card-header">
              <div className="rf-card-title">
                <ShieldCheck size={16} color="#008060" />
                <span>Review Moderation Rules</span>
              </div>
            </div>
            <div className="rf-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.enableReviews}
                    onChange={(e) => setFormData({ ...formData, enableReviews: e.target.checked })}
                    style={{ marginTop: 3 }}
                    id="setting-enableReviews"
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Enable Reviews on Storefront</div>
                    <div style={{ fontSize: 12, color: '#6d7175' }}>
                      When turned off, review widgets will be hidden from customer view.
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.requireApproval}
                    onChange={(e) => setFormData({ ...formData, requireApproval: e.target.checked })}
                    style={{ marginTop: 3 }}
                    id="setting-requireApproval"
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Require Merchant Approval (Spam Protection)</div>
                    <div style={{ fontSize: 12, color: '#6d7175' }}>
                      New reviews enter the PENDING state and only appear after you approve them.
                    </div>
                  </div>
                </label>

                {formData.requireApproval && (
                  <div style={{ marginLeft: 26, paddingLeft: 12, borderLeft: '2px solid #e5e7eb' }}>
                    <label className="rf-label">Auto-Approve High Ratings</label>
                    <select
                      className="rf-select"
                      value={formData.autoApproveMinStars}
                      onChange={(e) => setFormData({ ...formData, autoApproveMinStars: parseInt(e.target.value, 10) })}
                      id="setting-autoApproveMinStars"
                    >
                      <option value="5">Auto-approve only 5-star reviews</option>
                      <option value="4">Auto-approve 4-star and 5-star reviews</option>
                      <option value="99">Never auto-approve (manually moderate all)</option>
                    </select>
                    <span style={{ fontSize: 11, color: '#6d7175', display: 'block', marginTop: 4 }}>
                      Verified reviews with this rating or higher skip the pending queue.
                    </span>
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.showVerifiedBuyer}
                    onChange={(e) => setFormData({ ...formData, showVerifiedBuyer: e.target.checked })}
                    style={{ marginTop: 3 }}
                    id="setting-showVerifiedBuyer"
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Show "Verified Buyer" Badge</div>
                    <div style={{ fontSize: 12, color: '#6d7175' }}>
                      Display a badge when customer email matches Shopify order records.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Appearance & Styling */}
          <div className="rf-card">
            <div className="rf-card-header">
              <div className="rf-card-title">
                <Palette size={16} color="#4f46e5" />
                <span>Storefront Widget Appearance</span>
              </div>
            </div>
            <div className="rf-card-body">
              {/* Star Color */}
              <div className="rf-form-field">
                <label className="rf-label">Star Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                  {COLOR_PRESETS.map(preset => (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => setFormData({ ...formData, starColor: preset.color })}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: preset.color,
                        border: formData.starColor === preset.color ? '2px solid #000' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                      title={preset.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.starColor}
                    onChange={(e) => setFormData({ ...formData, starColor: e.target.value })}
                    style={{ width: 34, height: 32, padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
                  />
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#4b5563' }}>
                    {formData.starColor.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Star Size */}
              <div className="rf-form-field">
                <label className="rf-label">Star Size</label>
                <select
                  className="rf-select"
                  value={formData.starSize}
                  onChange={(e) => setFormData({ ...formData, starSize: e.target.value })}
                  id="setting-starSize"
                >
                  <option value="small">Small (16px)</option>
                  <option value="medium">Medium (20px)</option>
                  <option value="large">Large (24px)</option>
                </select>
              </div>

              {/* Review Layout */}
              <div className="rf-form-field">
                <label className="rf-label">Review List Layout</label>
                <select
                  className="rf-select"
                  value={formData.reviewLayout}
                  onChange={(e) => setFormData({ ...formData, reviewLayout: e.target.value })}
                  id="setting-reviewLayout"
                >
                  <option value="list">Single Column Feed (Recommended)</option>
                  <option value="grid">Two Column Cards Grid</option>
                  <option value="compact">Compact Minimalist</option>
                </select>
              </div>

              {/* Reviews Per Page */}
              <div className="rf-form-field">
                <label className="rf-label">Reviews Displayed Per Page</label>
                <select
                  className="rf-select"
                  value={formData.reviewsPerPage}
                  onChange={(e) => setFormData({ ...formData, reviewsPerPage: parseInt(e.target.value, 10) })}
                  id="setting-reviewsPerPage"
                >
                  <option value="3">3 reviews</option>
                  <option value="5">5 reviews</option>
                  <option value="10">10 reviews</option>
                  <option value="20">20 reviews</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Notifications */}
          <div className="rf-card">
            <div className="rf-card-header">
              <div className="rf-card-title">
                <Mail size={16} color="#b45309" />
                <span>Email Notifications</span>
              </div>
            </div>
            <div className="rf-card-body">
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 14 }}>
                <input
                  type="checkbox"
                  checked={formData.notifyOnNewReview}
                  onChange={(e) => setFormData({ ...formData, notifyOnNewReview: e.target.checked })}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Email me when a new review is submitted</div>
                  <div style={{ fontSize: 12, color: '#6d7175' }}>
                    Receive an immediate email alert with a direct link to approve or reject.
                  </div>
                </div>
              </label>

              {formData.notifyOnNewReview && (
                <div className="rf-form-field">
                  <label className="rf-label">Notification Email Address</label>
                  <input
                    type="email"
                    className="rf-input"
                    value={formData.merchantEmail}
                    onChange={(e) => setFormData({ ...formData, merchantEmail: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Live Storefront Preview Panel */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div className="rf-card" style={{ border: '2px solid #008060', overflow: 'hidden' }}>
            <div className="rf-card-header" style={{ background: '#f0fdf4' }}>
              <div className="rf-card-title" style={{ color: '#065f46' }}>
                <Eye size={16} />
                <span>Live Widget Preview</span>
              </div>
              <span className="rf-badge rf-badge-success">Real-time styling</span>
            </div>

            <div className="rf-card-body" style={{ background: '#ffffff', padding: 20 }}>
              <div style={{ fontSize: 12, color: '#6d7175', marginBottom: 12 }}>
                This is how the rating badge and customer reviews will render on your theme product page:
              </div>

              {/* Mock Product Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                marginBottom: 16
              }}>
                <StarRating 
                  rating={5} 
                  color={formData.starColor} 
                  size={getStarSizePx()} 
                />
                <span style={{ fontWeight: 700, fontSize: 14 }}>4.9</span>
                <span style={{ color: '#6b7280', fontSize: 12 }}>(128 reviews)</span>
              </div>

              {/* Mock Review Card */}
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                background: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>Marcus Vance</span>
                      {formData.showVerifiedBuyer && (
                        <span style={{
                          background: '#ecfdf5',
                          color: '#065f46',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 999
                        }}>
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>Verified Purchase • 2 days ago</span>
                  </div>
                  <StarRating 
                    rating={5} 
                    color={formData.starColor} 
                    size={getStarSizePx() - 2} 
                  />
                </div>

                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 4 }}>
                  Wrist pain completely gone in 3 days!
                </div>
                <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.4 }}>
                  As a software engineer typing 10 hours a day, my wrist was constantly aching. This product changed everything...
                </div>

                <div style={{
                  marginTop: 10,
                  padding: '8px 10px',
                  background: '#f8fafc',
                  borderLeft: '3px solid #008060',
                  borderRadius: '0 6px 6px 0',
                  fontSize: 12,
                  color: '#334155'
                }}>
                  <strong>Store Owner:</strong> Thank you Marcus! So glad it helped your wrist wellness.
                </div>
              </div>

              <div style={{ marginTop: 14, textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>
                  Layout format: <strong>{formData.reviewLayout.toUpperCase()}</strong> • Page limit: <strong>{formData.reviewsPerPage}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
