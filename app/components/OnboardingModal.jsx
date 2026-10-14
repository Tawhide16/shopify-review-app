import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Sliders, 
  MessageSquareText, 
  Eye, 
  X,
  Store
} from 'lucide-react';

const STEPS = [
  {
    title: "Welcome to ReviewFlow!",
    subtitle: "Your complete Shopify Product Reviews & Customer Trust solution.",
    badge: "Welcome Tour",
    icon: Sparkles,
    content: (
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <img 
          src="/logo.png" 
          alt="ReviewFlow" 
          style={{ width: 68, height: 68, margin: '0 auto 16px', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0, 128, 96, 0.2))' }} 
        />
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
          Boost Conversions with Authentic Customer Reviews
        </h3>
        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>
          ReviewFlow gives you everything you need to collect ratings, protect your store with intelligent anti-spam, award Verified Buyer badges, and showcase genuine social proof on your product pages.
        </p>
      </div>
    )
  },
  {
    title: "1. Storefront Widgets & Customer Submissions",
    subtitle: "Built with Shopify Theme App Extension technology.",
    badge: "Step 1 of 4",
    icon: Eye,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            Product Star Rating Badge
          </div>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
            Displays average star scores directly near your product price and title. Clicking smoothly jumps customers to customer reviews.
          </p>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Store size={16} color="#008060" />
            Review List & Submission Modal
          </div>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
            Customers can rate from 1 to 5 stars, write headlines and detailed feedback. The form validates email syntax and protects against spam bots.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "2. Intelligent Moderation & Merchant Replies",
    subtitle: "Full control over what gets published to your store.",
    badge: "Step 2 of 4",
    icon: MessageSquareText,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#92400e', marginBottom: 4 }}>
            ⏳ Pending Moderation Queue
          </div>
          <p style={{ fontSize: 13, color: '#78350f', margin: 0, lineHeight: 1.5 }}>
            Customer submissions start in the <strong>PENDING</strong> status. You can approve or reject reviews directly with 1 click from your overview dashboard.
          </p>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#166534', marginBottom: 4 }}>
            💬 Public Merchant Responses
          </div>
          <p style={{ fontSize: 13, color: '#14532d', margin: 0, lineHeight: 1.5 }}>
            Reply directly to positive reviews or customer concerns. Your official store owner response will display with a branded badge right beneath the review.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "3. Verified Buyers & Anti-Spam Security",
    subtitle: "Automated verification backed by Shopify order data.",
    badge: "Step 3 of 4",
    icon: ShieldCheck,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#065f46', marginBottom: 4 }}>
            ✓ Automated Verified Buyer Badge
          </div>
          <p style={{ fontSize: 13, color: '#064e3b', margin: 0, lineHeight: 1.5 }}>
            When a reviewer's email matches an existing store order for that product, ReviewFlow automatically marks the review with the green <strong>Verified Buyer</strong> badge.
          </p>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 4 }}>
            🛡️ 5-Layer Security Engine
          </div>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
            Includes profanity filtering, duplicate submission prevention, disposable email blockers (10minutemail, etc.), and IP rate limiting.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "4. Customize & Test in Real-Time",
    subtitle: "Tailor the widget to match your store branding.",
    badge: "Step 4 of 4",
    icon: Sliders,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#166534', marginBottom: 4 }}>
            🎨 Settings & Live Widget Preview
          </div>
          <p style={{ fontSize: 13, color: '#14532d', margin: 0, lineHeight: 1.5 }}>
            Pick your star color (Warm Amber, Classic Gold, Emerald, Sapphire, Rose Quartz), adjust star size, layout styles (Single Feed, Grid, Compact), and auto-approval thresholds.
          </p>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e40af', marginBottom: 4 }}>
            🧪 Interactive Storefront Sandbox
          </div>
          <p style={{ fontSize: 13, color: '#1e3a8a', margin: 0, lineHeight: 1.5 }}>
            Use the <strong>"Customer Storefront Sandbox"</strong> tab anytime to experience the customer review flow, test submissions, and watch them publish live!
          </p>
        </div>
      </div>
    )
  }
];

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const stepData = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (onComplete) onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    if (onComplete) onComplete();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        maxWidth: 580,
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        animation: 'rfSlideUp 0.25s ease'
      }}>
        {/* Header Bar with Skip Button */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f2f3',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: '#008060',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.02em'
            }}>
              {stepData.badge}
            </span>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              Quick Start Guide
            </span>
          </div>

          {/* Skeep / Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            id="rf-onboarding-skip-btn"
            style={{
              background: 'none',
              border: '1px solid #cbd5e1',
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.15s ease'
            }}
            title="Skip onboarding instructions"
          >
            <span>Skip Guide</span>
            <X size={13} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px 32px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
            {stepData.title}
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
            {stepData.subtitle}
          </p>

          <div style={{ minHeight: 180 }}>
            {stepData.content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{
          padding: '16px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #f1f2f3',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Step indicator dots */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                style={{
                  width: idx === currentStep ? 22 : 8,
                  height: 8,
                  borderRadius: 999,
                  background: idx === currentStep ? '#008060' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {currentStep > 0 && (
              <button
                type="button"
                className="rf-btn rf-btn-secondary"
                onClick={handlePrev}
                id="rf-onboarding-prev-btn"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}

            <button
              type="button"
              className="rf-btn rf-btn-primary"
              onClick={handleNext}
              id="rf-onboarding-next-btn"
            >
              <span>{isLastStep ? "Let's Get Started!" : "Next Step"}</span>
              {isLastStep ? <CheckCircle2 size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
