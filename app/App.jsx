import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import AdminLayout from './components/AdminLayout';
import DashboardTab from './components/DashboardTab';
import ReviewsTab from './components/ReviewsTab';
import SettingsTab from './components/SettingsTab';
import AnalyticsTab from './components/AnalyticsTab';
import StorefrontPreview from './components/StorefrontPreview';
import OnboardingModal from './components/OnboardingModal';
import './styles/admin.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, reviews, settings, analytics, preview
  const [guideHintsEnabled, setGuideHintsEnabled] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return localStorage.getItem('reviewflow_onboarding_dismissed') !== 'true';
  });
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    averageRating: 5.0,
    verifiedCount: 0,
    verifiedPercentage: 0,
    reviewsThisMonth: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [settings, setSettings] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }
  };

  // Fetch reviews and summary stats
  const fetchReviewsAndStats = async () => {
    try {
      const res = await fetch('/api/admin/reviews?shop=quick-start-store.myshopify.com');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings?shop=quick-start-store.myshopify.com');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/settings/products?shop=quick-start-store.myshopify.com');
      if (res.ok) {
        const data = await res.json();
        if (data.products) setProducts(data.products);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchReviewsAndStats(), fetchSettings(), fetchProducts()]).finally(() => {
      setLoading(false);
    });
  }, []);

  // Moderation Actions
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      });
      if (res.ok) {
        triggerConfetti();
        showToast('Review approved and published to storefront!');
        fetchReviewsAndStats();
      }
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' })
      });
      if (res.ok) {
        showToast('Review marked as rejected.');
        fetchReviewsAndStats();
      }
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Review permanently deleted.');
        fetchReviewsAndStats();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleReply = async (id, replyText) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText })
      });
      if (res.ok) {
        showToast('Merchant response published to customer review.');
        fetchReviewsAndStats();
      }
    } catch (err) {
      console.error('Reply error:', err);
    }
  };

  const handleEdit = async (id, editData) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        showToast('Review content successfully updated.');
        fetchReviewsAndStats();
      }
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const handleToggleVerified = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/toggle-verified`, {
        method: 'PATCH'
      });
      if (res.ok) {
        showToast('Buyer verification status toggled.');
        fetchReviewsAndStats();
      }
    } catch (err) {
      console.error('Toggle verified error:', err);
    }
  };

  const handleBulkAction = async (ids, action) => {
    try {
      const res = await fetch('/api/admin/reviews/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action })
      });
      if (res.ok) {
        if (action === 'APPROVE') triggerConfetti();
        showToast(`Bulk ${action.toLowerCase()} completed for ${ids.length} reviews.`);
        fetchReviewsAndStats();
      }
    } catch (err) {
      console.error('Bulk action error:', err);
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop: 'quick-start-store.myshopify.com', ...newSettings })
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        showToast('Settings saved successfully!');
      }
    } catch (err) {
      console.error('Save settings error:', err);
    }
  };

  const pendingReviews = reviews.filter(r => r.status === 'PENDING');

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      pendingCount={pendingReviews.length}
      onOpenGuide={() => setIsOnboardingOpen(true)}
      guideHintsEnabled={guideHintsEnabled}
      setGuideHintsEnabled={setGuideHintsEnabled}
    >
      {activeTab === 'dashboard' && (
        <DashboardTab
          stats={stats}
          pendingReviews={pendingReviews}
          onApproveReview={handleApprove}
          onRejectReview={handleReject}
          onNavigateToReviews={() => setActiveTab('reviews')}
          onNavigateToSettings={() => setActiveTab('settings')}
          onNavigateToPreview={() => setActiveTab('preview')}
          showGuideHints={guideHintsEnabled}
        />
      )}

      {activeTab === 'reviews' && (
        <ReviewsTab
          reviews={reviews}
          products={products}
          stats={stats}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onReply={handleReply}
          onEdit={handleEdit}
          onToggleVerified={handleToggleVerified}
          onBulkAction={handleBulkAction}
          showGuideHints={guideHintsEnabled}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsTab
          settings={settings}
          onSaveSettings={handleSaveSettings}
          showGuideHints={guideHintsEnabled}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab
          stats={stats}
          reviews={reviews}
          products={products}
          showGuideHints={guideHintsEnabled}
        />
      )}

      {activeTab === 'preview' && (
        <StorefrontPreview
          products={products}
          settings={settings}
          onSwitchToAdmin={() => setActiveTab('reviews')}
          onReviewSubmitted={() => {
            fetchReviewsAndStats();
            showToast('Customer review submitted! View it in the Pending queue.');
          }}
          showGuideHints={guideHintsEnabled}
        />
      )}

      {/* Interactive Onboarding Instructions Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => {
          localStorage.setItem('reviewflow_onboarding_dismissed', 'true');
          showToast('Setup guide completed! Enjoy using ReviewFlow.');
        }}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="rf-toast">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}
