import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Sliders, 
  BarChart3, 
  Eye, 
  Store, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function AdminLayout({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  onOpenGuide,
  guideHintsEnabled = true,
  setGuideHintsEnabled,
  children
}) {
  return (
    <div className="rf-app">
      {/* Shopify Topbar */}
      <header className="rf-topbar">
        <div className="rf-topbar-left">
          <div className="rf-logo-badge">
            <img 
              src="/logo.png" 
              alt="ReviewFlow Logo" 
              style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6, display: 'block' }} 
            />
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: '#ffffff' }}>ReviewFlow</span>
            <span style={{ 
              fontSize: '11px', 
              background: '#008060', 
              color: '#ffffff', 
              padding: '2px 7px', 
              borderRadius: '4px',
              fontWeight: 700
            }}>
              POLARIS 12
            </span>
          </div>

          <div className="rf-store-selector">
            <Store size={14} />
            <span>quick-start-store.myshopify.com</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} title="Synced"></span>
          </div>
        </div>

        <div className="rf-topbar-right">
          {/* Animated Guide Hints Toggle */}
          <button 
            type="button" 
            className="rf-topbar-btn"
            onClick={() => setGuideHintsEnabled && setGuideHintsEnabled(!guideHintsEnabled)}
            id="rf-topbar-hints-toggle"
            style={{ 
              background: guideHintsEnabled ? 'rgba(0, 128, 96, 0.45)' : 'rgba(255, 255, 255, 0.1)',
              borderColor: guideHintsEnabled ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff'
            }}
            title="Toggle animated visual guides on interactive elements"
          >
            <span className={guideHintsEnabled ? 'rf-beacon-dot' : ''} style={!guideHintsEnabled ? { width: 8, height: 8, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' } : {}} />
            <span>{guideHintsEnabled ? '✨ Guided Hints: ON' : 'Hints: OFF'}</span>
          </button>

          <button 
            type="button" 
            className="rf-topbar-btn"
            onClick={onOpenGuide}
            id="rf-topbar-guide-btn"
            style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            title="View app usage instructions"
          >
            <HelpCircle size={15} />
            <span>How to Use</span>
          </button>

          <button 
            type="button" 
            className="rf-topbar-btn primary-highlight"
            onClick={() => setActiveTab('preview')}
            id="rf-topbar-preview-btn"
          >
            <Eye size={15} />
            <span>Live Storefront Preview</span>
            <ExternalLink size={13} style={{ opacity: 0.8 }} />
          </button>
        </div>
      </header>

      {/* Polaris Tabs Navigation */}
      <nav className="rf-subnav">
        <button
          type="button"
          className={`rf-tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          id="rf-nav-dashboard"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`rf-tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
          id="rf-nav-reviews"
        >
          <MessageSquareText size={16} />
          <span>Reviews Moderation</span>
          {pendingCount > 0 && (
            <span className="rf-tab-badge" id="rf-pending-nav-badge">
              {pendingCount} Pending
            </span>
          )}
        </button>

        <button
          type="button"
          className={`rf-tab-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          id="rf-nav-settings"
        >
          <Sliders size={16} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className={`rf-tab-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          id="rf-nav-analytics"
        >
          <BarChart3 size={16} />
          <span>Analytics</span>
        </button>

        <button
          type="button"
          className={`rf-tab-item ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
          id="rf-nav-preview"
          style={{ marginLeft: 'auto', color: activeTab === 'preview' ? '#008060' : '#4f46e5' }}
        >
          <Sparkles size={16} />
          <span>Customer Storefront Sandbox</span>
        </button>
      </nav>

      {/* Main Viewport */}
      <main className="rf-main-content">
        {children}
      </main>
    </div>
  );
}
