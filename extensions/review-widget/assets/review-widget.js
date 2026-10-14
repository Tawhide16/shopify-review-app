/**
 * ReviewFlow Storefront Widget Engine
 * Handles dynamic rating calculation, async review fetching, pagination, and review submission.
 */

window.ReviewFlow = (function () {
  let currentReviews = [];
  let currentStats = { average: 5.0, total: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  let currentFilter = 'all';
  let currentSort = 'newest';

  const ratingDescriptions = {
    5: 'Excellent! Highly recommended',
    4: 'Good, very satisfied',
    3: 'Average, meets expectations',
    2: 'Below expectations',
    1: 'Poor, not satisfied'
  };

  function init() {
    setupCharCounter();
    setupStarPickerEvents();
    loadProductReviews();
  }

  function setupCharCounter() {
    const textarea = document.getElementById('reviewflow-input-body');
    const counter = document.getElementById('reviewflow-chars');
    if (textarea && counter) {
      textarea.addEventListener('input', function () {
        counter.textContent = this.value.length;
      });
    }
  }

  function setupStarPickerEvents() {
    const starPicker = document.getElementById('reviewflow-star-picker');
    const label = document.getElementById('reviewflow-star-picker-label');
    if (starPicker && label) {
      starPicker.addEventListener('change', function (e) {
        const val = e.target.value;
        if (ratingDescriptions[val]) {
          label.textContent = `${val} Stars - ${ratingDescriptions[val]}`;
          label.style.color = '#047857';
        }
      });
    }
  }

  async function loadProductReviews() {
    const container = document.getElementById('reviewflow-widget-section');
    if (!container) return;

    const productId = container.dataset.productId || 'gid://shopify/Product/1';
    const shop = container.dataset.shop || 'quick-start-store.myshopify.com';

    try {
      const response = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}&shop=${encodeURIComponent(shop)}`);
      if (!response.ok) throw new Error('Failed to load reviews');
      const data = await response.json();

      currentReviews = data.reviews || [];
      currentStats = data.stats || currentStats;

      renderBadge(currentStats);
      renderSummaryHeader(currentStats);
      renderReviewsList();
    } catch (err) {
      console.error('ReviewFlow error loading reviews:', err);
      const listEl = document.getElementById('reviewflow-reviews-list');
      if (listEl) {
        listEl.innerHTML = `
          <div class="reviewflow-empty-state">
            <p>Could not load reviews at this time. Please try refreshing.</p>
          </div>
        `;
      }
    }
  }

  function renderBadge(stats) {
    const scoreEl = document.querySelector('[data-reviewflow-score]');
    const countEl = document.querySelector('[data-reviewflow-count]');
    if (scoreEl) scoreEl.textContent = stats.total > 0 ? stats.average.toFixed(1) : '5.0';
    if (countEl) countEl.textContent = `(${stats.total} ${stats.total === 1 ? 'review' : 'reviews'})`;
  }

  function renderSummaryHeader(stats) {
    const avgScoreEl = document.querySelector('[data-reviewflow-avg]');
    const totalEl = document.querySelector('[data-reviewflow-total-reviews]');
    const histogramEl = document.getElementById('reviewflow-histogram-bars');

    if (avgScoreEl) avgScoreEl.textContent = stats.total > 0 ? stats.average.toFixed(1) : '5.0';
    if (totalEl) totalEl.textContent = `Based on ${stats.total} verified ${stats.total === 1 ? 'review' : 'reviews'}`;

    if (histogramEl) {
      let html = '';
      for (let star = 5; star >= 1; star--) {
        const count = stats.breakdown ? (stats.breakdown[star] || 0) : 0;
        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
        html += `
          <div class="reviewflow-bar-row">
            <span class="reviewflow-bar-label">${star} ★</span>
            <div class="reviewflow-bar-track">
              <div class="reviewflow-bar-fill" style="width: ${pct}%"></div>
            </div>
            <span class="reviewflow-bar-count">${count}</span>
          </div>
        `;
      }
      histogramEl.innerHTML = html;
    }
  }

  function renderReviewsList() {
    const listEl = document.getElementById('reviewflow-reviews-list');
    if (!listEl) return;

    let filtered = [...currentReviews];
    if (currentFilter !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(currentFilter, 10));
    }

    if (currentSort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (currentSort === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (currentSort === 'lowest') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (currentSort === 'helpful') {
      filtered.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="reviewflow-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom: 8px;">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12h8"></path>
          </svg>
          <p style="font-weight: 600; color: #334155; margin-bottom: 4px;">No reviews match this filter</p>
          <p style="font-size: 13px;">Be the first to share your thoughts by submitting a review!</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(review => {
      const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
      const initial = (review.customerName || 'Customer').charAt(0).toUpperCase();
      const dateFormatted = new Date(review.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      return `
        <div class="reviewflow-review-card" id="rf-review-${review.id}">
          <div class="reviewflow-card-header">
            <div class="reviewflow-author-meta">
              <div class="reviewflow-avatar">${initial}</div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="reviewflow-author-name">${escapeHtml(review.customerName)}</span>
                  ${review.verified ? `
                    <span class="reviewflow-verified-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Verified Buyer
                    </span>
                  ` : ''}
                </div>
                <div class="reviewflow-review-date">${dateFormatted}</div>
              </div>
            </div>
            <div class="reviewflow-stars" style="font-size: 18px;" title="${review.rating} out of 5 stars">
              ${stars}
            </div>
          </div>

          <h4 class="reviewflow-review-title">${escapeHtml(review.title)}</h4>
          <p class="reviewflow-review-body">${escapeHtml(review.body)}</p>

          ${review.merchantReply ? `
            <div class="reviewflow-merchant-reply">
              <div class="reviewflow-merchant-reply-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Response from Store Owner
              </div>
              <p class="reviewflow-merchant-reply-text">${escapeHtml(review.merchantReply)}</p>
            </div>
          ` : ''}

          <div class="reviewflow-card-footer">
            <button 
              type="button" 
              class="reviewflow-helpful-btn" 
              onclick="ReviewFlow.voteHelpful('${review.id}')"
              id="rf-btn-helpful-${review.id}"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Helpful (<span id="rf-helpful-count-${review.id}">${review.helpfulCount || 0}</span>)
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function onFilterChange(val) {
    currentFilter = val;
    renderReviewsList();
  }

  function onSortChange(val) {
    currentSort = val;
    renderReviewsList();
  }

  function openFormModal() {
    const modal = document.getElementById('reviewflow-modal');
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const errorEl = document.getElementById('reviewflow-form-error');
      const successEl = document.getElementById('reviewflow-form-success');
      if (errorEl) errorEl.style.display = 'none';
      if (successEl) successEl.style.display = 'none';
    }
  }

  function closeFormModal() {
    const modal = document.getElementById('reviewflow-modal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = document.getElementById('reviewflow-submit-btn');
    const errorEl = document.getElementById('reviewflow-form-error');
    const successEl = document.getElementById('reviewflow-form-success');

    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    const ratingChecked = form.querySelector('input[name="rating"]:checked');
    if (!ratingChecked) {
      errorEl.textContent = 'Please choose a star rating for this product.';
      errorEl.style.display = 'block';
      return;
    }

    const payload = {
      productId: form.productId.value,
      productTitle: form.productTitle.value,
      shop: form.shop.value,
      rating: parseInt(ratingChecked.value, 10),
      title: form.title.value.trim(),
      body: form.body.value.trim(),
      customerName: form.customerName.value.trim(),
      customerEmail: form.customerEmail.value.trim()
    };

    if (!payload.title || !payload.body || !payload.customerName || !payload.customerEmail) {
      errorEl.textContent = 'Please complete all required fields.';
      errorEl.style.display = 'block';
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Review...';

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }

      form.reset();
      const chars = document.getElementById('reviewflow-chars');
      if (chars) chars.textContent = '0';
      const label = document.getElementById('reviewflow-star-picker-label');
      if (label) {
        label.textContent = 'Select your rating';
        label.style.color = '';
      }

      successEl.innerHTML = `
        <strong>Thank you for your feedback!</strong><br/>
        ${result.message || 'Your review has been submitted and is currently pending merchant moderation.'}
      `;
      successEl.style.display = 'block';

      // Reload reviews list
      setTimeout(() => {
        loadProductReviews();
        closeFormModal();
      }, 2500);

    } catch (err) {
      errorEl.textContent = err.message || 'An error occurred while submitting. Please try again.';
      errorEl.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Review';
    }
  }

  async function voteHelpful(reviewId) {
    const btn = document.getElementById(`rf-btn-helpful-${reviewId}`);
    const countEl = document.getElementById(`rf-helpful-count-${reviewId}`);
    if (btn && btn.classList.contains('voted')) return;

    try {
      if (btn) btn.classList.add('voted');
      const res = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId })
      });
      if (res.ok) {
        const data = await res.json();
        if (countEl) countEl.textContent = data.helpfulCount;
      }
    } catch (err) {
      console.error('Error voting helpful:', err);
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    openFormModal,
    closeFormModal,
    handleFormSubmit,
    onFilterChange,
    onSortChange,
    voteHelpful,
    loadProductReviews
  };
})();
