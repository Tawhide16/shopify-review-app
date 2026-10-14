import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Check, 
  ThumbsUp, 
  Send, 
  X, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import StarRating from './StarRating';
import GuideBeacon from './GuideBeacon';

export default function ReviewsTab({
  reviews = [],
  products = [],
  stats = {},
  onApprove,
  onReject,
  onDelete,
  onReply,
  onEdit,
  onToggleVerified,
  onBulkAction,
  showGuideHints = true
}) {
  // Filters & State
  const [activeSubTab, setActiveSubTab] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 5, 10, 25, 50

  // Modal states
  const [replyModalReview, setReplyModalReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editModalReview, setEditModalReview] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', body: '', rating: 5, customerName: '' });

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (activeSubTab !== 'ALL' && r.status !== activeSubTab) return false;
      if (selectedRating !== 'all' && r.rating !== parseInt(selectedRating, 10)) return false;
      if (selectedProduct !== 'all' && r.productId !== selectedProduct) return false;
      if (onlyVerified && !r.verified) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (r.customerName || '').toLowerCase().includes(q);
        const matchEmail = (r.customerEmail || '').toLowerCase().includes(q);
        const matchTitle = (r.title || '').toLowerCase().includes(q);
        const matchBody = (r.body || '').toLowerCase().includes(q);
        const matchProd = (r.productTitle || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchTitle && !matchBody && !matchProd) return false;
      }
      return true;
    });
  }, [reviews, activeSubTab, selectedRating, selectedProduct, onlyVerified, searchQuery]);

  // Paginated reviews
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeSubTab, selectedRating, selectedProduct, onlyVerified, searchQuery, pageSize]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedReviews.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setActiveSubTab('ALL');
    setSearchQuery('');
    setSelectedRating('all');
    setSelectedProduct('all');
    setOnlyVerified(false);
    setSelectedIds([]);
  };

  const openReplyModal = (review) => {
    setReplyModalReview(review);
    setReplyText(review.merchantReply || '');
  };

  const handleSaveReply = () => {
    if (replyModalReview) {
      onReply(replyModalReview.id, replyText);
      setReplyModalReview(null);
    }
  };

  const openEditModal = (review) => {
    setEditModalReview(review);
    setEditFormData({
      title: review.title,
      body: review.body,
      rating: review.rating,
      customerName: review.customerName
    });
  };

  const handleSaveEdit = () => {
    if (editModalReview) {
      onEdit(editModalReview.id, editFormData);
      setEditModalReview(null);
    }
  };

  // Direct CSV Export
  const handleExportCSV = () => {
    if (filteredReviews.length === 0) {
      alert('No reviews match your current filters to export.');
      return;
    }
    const headers = ['ID', 'Product Title', 'Rating', 'Review Title', 'Review Body', 'Customer Name', 'Customer Email', 'Status', 'Verified', 'Created At'];
    const rows = filteredReviews.map(r => [
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
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `reviews_moderation_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFiltered = activeSubTab !== 'ALL' || selectedRating !== 'all' || selectedProduct !== 'all' || onlyVerified || searchQuery.trim() !== '';

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="rf-page-header">
        <div>
          <h1 className="rf-page-title">
            <span>Reviews Moderation</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#6d7175', background: '#f1f2f3', padding: '3px 10px', borderRadius: 999 }}>
              {reviews.length} total in store
            </span>
          </h1>
          <p className="rf-page-subtitle">
            Moderate incoming customer ratings, reply to buyers, and curate published reviews on your store.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {isFiltered && (
            <button 
              type="button" 
              className="rf-btn rf-btn-secondary"
              onClick={handleClearFilters}
              style={{ color: '#d82c0d' }}
            >
              <RotateCcw size={14} />
              Reset Filters
            </button>
          )}
          <GuideBeacon text="👉 Click to export reviews as CSV" position="bottom" show={showGuideHints}>
            <button 
              type="button" 
              className="rf-btn rf-btn-secondary"
              onClick={handleExportCSV}
              id="rf-reviews-export-csv"
              title="Download matching reviews as CSV"
            >
              <Download size={14} />
              Export CSV ({filteredReviews.length})
            </button>
          </GuideBeacon>
        </div>
      </div>

      {/* Sub-tabs: ALL, PENDING, APPROVED, REJECTED */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className={`rf-btn ${activeSubTab === 'ALL' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
          onClick={() => { setActiveSubTab('ALL'); setSelectedIds([]); }}
          id="rf-subtab-all"
        >
          All Reviews ({reviews.length})
        </button>

        <GuideBeacon text="👉 Click to see pending reviews awaiting approval" position="bottom" show={showGuideHints && reviews.some(r => r.status === 'PENDING')}>
          <button
            type="button"
            className={`rf-btn ${activeSubTab === 'PENDING' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
            onClick={() => { setActiveSubTab('PENDING'); setSelectedIds([]); }}
            id="rf-subtab-pending"
            style={{ position: 'relative' }}
          >
            Pending Review
            <span className="rf-badge rf-badge-attention" style={{ marginLeft: 6, padding: '1px 7px', fontSize: 11 }}>
              {reviews.filter(r => r.status === 'PENDING').length}
            </span>
          </button>
        </GuideBeacon>

        <button
          type="button"
          className={`rf-btn ${activeSubTab === 'APPROVED' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
          onClick={() => { setActiveSubTab('APPROVED'); setSelectedIds([]); }}
          id="rf-subtab-approved"
        >
          Approved & Published ({reviews.filter(r => r.status === 'APPROVED').length})
        </button>

        <button
          type="button"
          className={`rf-btn ${activeSubTab === 'REJECTED' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
          onClick={() => { setActiveSubTab('REJECTED'); setSelectedIds([]); }}
          id="rf-subtab-rejected"
        >
          Rejected ({reviews.filter(r => r.status === 'REJECTED').length})
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            background: onlyVerified ? '#ecfdf5' : '#ffffff',
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid',
            borderColor: onlyVerified ? '#a7f3d0' : '#e1e3e5',
            color: onlyVerified ? '#065f46' : '#374151'
          }}>
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              id="rf-filter-verified-checkbox"
            />
            <ShieldCheck size={14} />
            Verified Buyers Only
          </label>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="rf-toolbar" style={{ width: '100%' }}>
        <div className="rf-toolbar-left" style={{ flex: 1, display: 'flex', gap: 12 }}>
          {/* Search box */}
          <div className="rf-search-box" style={{ flex: 1, minWidth: 260 }}>
            <Search size={15} />
            <input
              type="text"
              placeholder="Search by customer name, email, review title, body..."
              className="rf-search-input"
              style={{ width: '100%' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="rf-filter-search"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Rating filter */}
          <select 
            className="rf-select"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            id="rf-filter-rating"
            style={{ minWidth: 140 }}
          >
            <option value="all">★ All Star Ratings</option>
            <option value="5">★ 5 Stars only</option>
            <option value="4">★ 4 Stars only</option>
            <option value="3">★ 3 Stars only</option>
            <option value="2">★ 2 Stars only</option>
            <option value="1">★ 1 Star only</option>
          </select>

          {/* Product filter */}
          <select 
            className="rf-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            id="rf-filter-product"
            style={{ minWidth: 180 }}
          >
            <option value="all">📦 All Catalog Products</option>
            {products.map(p => (
              <option key={p.shopifyId} value={p.shopifyId}>{p.title}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#6d7175' }}>
            Showing <strong>{filteredReviews.length}</strong> matching reviews
          </span>
        </div>
      </div>

      {/* Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="rf-batch-bar" style={{ width: '100%' }}>
          <div className="rf-batch-left">
            <span>✓ {selectedIds.length} {selectedIds.length === 1 ? 'review' : 'reviews'} selected for bulk action</span>
          </div>
          <div className="rf-batch-actions">
            <button 
              type="button" 
              className="rf-btn rf-btn-sm rf-btn-primary"
              onClick={() => { onBulkAction(selectedIds, 'APPROVE'); setSelectedIds([]); }}
              id="rf-bulk-approve"
            >
              <CheckCircle size={14} />
              Bulk Approve & Publish
            </button>
            <button 
              type="button" 
              className="rf-btn rf-btn-sm rf-btn-secondary"
              onClick={() => { onBulkAction(selectedIds, 'REJECT'); setSelectedIds([]); }}
              id="rf-bulk-reject"
            >
              <XCircle size={14} />
              Bulk Reject
            </button>
            <button 
              type="button" 
              className="rf-btn rf-btn-sm rf-btn-destructive"
              onClick={() => {
                if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} reviews?`)) {
                  onBulkAction(selectedIds, 'DELETE');
                  setSelectedIds([]);
                }
              }}
              id="rf-bulk-delete"
            >
              <Trash2 size={14} />
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Full-Width Reviews Table Container */}
      <div className="rf-card" style={{ width: '100%', overflowX: 'auto' }}>
        {filteredReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px', color: '#6b7280' }}>
            <Filter size={40} color="#9ca3af" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 6 }}>No reviews match your criteria</h3>
            <p style={{ fontSize: 13, marginBottom: 16 }}>Try resetting search keywords or status filters.</p>
            {isFiltered && (
              <button 
                type="button" 
                className="rf-btn rf-btn-secondary"
                onClick={handleClearFilters}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <table className="rf-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: 44, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedReviews.length}
                    onChange={handleSelectAll}
                    aria-label="Select all on this page"
                  />
                </th>
                <th style={{ width: 140 }}>Status</th>
                <th style={{ width: 220 }}>Reviewer</th>
                <th>Review Details</th>
                <th style={{ width: 220 }}>Catalog Product</th>
                <th style={{ width: 220, textAlign: 'right' }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.map((review, index) => {
                const isSelected = selectedIds.includes(review.id);
                return (
                  <tr key={review.id} style={{ background: isSelected ? '#f0fdf4' : 'inherit', transition: 'background 0.15s ease' }}>
                    {/* Checkbox */}
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(review.id)}
                        aria-label={`Select review by ${review.customerName}`}
                      />
                    </td>

                    {/* Status with Quick Toggle */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                        {review.status === 'PENDING' && (
                          <span className="rf-badge rf-badge-attention">
                            ⏳ Pending
                          </span>
                        )}
                        {review.status === 'APPROVED' && (
                          <span className="rf-badge rf-badge-success">
                            ✓ Approved
                          </span>
                        )}
                        {review.status === 'REJECTED' && (
                          <span className="rf-badge rf-badge-critical">
                            ✕ Rejected
                          </span>
                        )}

                        <div style={{ display: 'flex', gap: 4, marginTop: 2, alignItems: 'center' }}>
                          {review.status !== 'APPROVED' && (
                            <GuideBeacon text="👉 Instant Approve" position="right" show={showGuideHints && index === 0}>
                              <button
                                type="button"
                                onClick={() => onApprove(review.id)}
                                style={{
                                  fontSize: 11,
                                  padding: '2px 6px',
                                  background: '#e4f8f0',
                                  color: '#108043',
                                  border: '1px solid #bbf3d6',
                                  borderRadius: 4,
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                                title="1-click approve"
                              >
                                Approve
                              </button>
                            </GuideBeacon>
                          )}
                          {review.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => onReject(review.id)}
                              style={{
                                fontSize: 11,
                                padding: '2px 6px',
                                background: '#ffebee',
                                color: '#bf0711',
                                border: '1px solid #ffccd0',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontWeight: 600
                              }}
                              title="1-click reject"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: '#f1f2f3',
                          color: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                          flexShrink: 0
                        }}>
                          {(review.customerName || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{review.customerName}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>{review.customerEmail}</div>
                          <div style={{ marginTop: 4 }}>
                            <button
                              type="button"
                              onClick={() => onToggleVerified(review.id)}
                              style={{
                                background: review.verified ? '#ecfdf5' : '#f3f4f6',
                                color: review.verified ? '#065f46' : '#6b7280',
                                border: '1px solid',
                                borderColor: review.verified ? '#a7f3d0' : '#e5e7eb',
                                padding: '2px 8px',
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Click to toggle verified buyer status"
                            >
                              <ShieldCheck size={12} />
                              {review.verified ? 'Verified Buyer' : 'Unverified'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Review Details */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <StarRating rating={review.rating} size={14} />
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                          {review.title}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5, marginBottom: 6 }}>
                        {review.body}
                      </div>

                      {/* Store Owner Reply Display */}
                      {review.merchantReply && (
                        <div style={{
                          marginTop: 8,
                          padding: '8px 12px',
                          background: '#f8fafc',
                          borderLeft: '3px solid #008060',
                          borderRadius: '0 6px 6px 0',
                          fontSize: 12,
                          color: '#334155'
                        }}>
                          <strong style={{ color: '#008060' }}>Store Reply:</strong> {review.merchantReply}
                        </div>
                      )}

                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, display: 'flex', gap: 14, alignItems: 'center' }}>
                        <span>Submitted {new Date(review.createdAt).toLocaleDateString()}</span>
                        {review.helpfulCount > 0 && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <ThumbsUp size={11} /> {review.helpfulCount} helpful votes
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Product */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', marginBottom: 2 }}>
                        {review.productTitle}
                      </div>
                      <div style={{ fontSize: 11, color: '#6d7175' }}>
                        Shopify ID: {review.productId.replace('gid://shopify/Product/', '#')}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <GuideBeacon
                          text="👉 Click to reply to customer"
                          position="left"
                          show={showGuideHints && index === 0}
                        >
                          <button
                            type="button"
                            className="rf-btn rf-btn-sm rf-btn-secondary"
                            onClick={() => openReplyModal(review)}
                            title="Reply as Store Owner"
                            id={`rf-reply-btn-${review.id}`}
                          >
                            <MessageSquare size={13} />
                            {review.merchantReply ? 'Edit Reply' : 'Reply'}
                          </button>
                        </GuideBeacon>

                        <button
                          type="button"
                          className="rf-btn rf-btn-sm rf-btn-secondary"
                          onClick={() => openEditModal(review)}
                          title="Edit Review Content"
                          id={`rf-edit-btn-${review.id}`}
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          type="button"
                          className="rf-btn rf-btn-sm rf-btn-secondary"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to permanently delete this review?')) {
                              onDelete(review.id);
                            }
                          }}
                          title="Delete Review"
                          style={{ color: '#d82c0d' }}
                          id={`rf-delete-btn-${review.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination Footer */}
        {filteredReviews.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            borderTop: '1px solid var(--p-border-subdued)',
            background: 'var(--p-surface-secondary)',
            fontSize: 13,
            color: '#6d7175'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>
                Showing <strong>{Math.min(filteredReviews.length, (currentPage - 1) * pageSize + 1)}</strong> - <strong>{Math.min(filteredReviews.length, currentPage * pageSize)}</strong> of <strong>{filteredReviews.length}</strong> reviews
              </span>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>Per page:</span>
                <select
                  className="rf-select"
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                  style={{ padding: '4px 8px', fontSize: 12 }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                className="rf-btn rf-btn-sm rf-btn-secondary"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{ opacity: currentPage <= 1 ? 0.5 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span style={{ fontWeight: 600, color: '#111827' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="rf-btn rf-btn-sm rf-btn-secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{ opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalReview && (
        <div className="rf-modal-overlay">
          <div className="rf-modal-box">
            <div className="rf-modal-header">
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Reply as Store Owner</h3>
              <button 
                type="button" 
                onClick={() => setReplyModalReview(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6d7175' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="rf-modal-body">
              <div style={{ marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 13 }}>
                <strong>Customer:</strong> {replyModalReview.customerName}<br />
                <strong>Review:</strong> "{replyModalReview.title}" - {replyModalReview.body}
              </div>

              <div className="rf-form-field">
                <label className="rf-label">Public Merchant Response</label>
                <textarea
                  className="rf-textarea"
                  rows="4"
                  placeholder="Thank you for your feedback! We are thrilled that you loved..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  id="rf-reply-textarea"
                />
                <span style={{ fontSize: 11, color: '#6d7175', marginTop: 4, display: 'block' }}>
                  This response will be visible to all customers underneath this review on your storefront.
                </span>
              </div>
            </div>
            <div className="rf-modal-footer">
              <button 
                type="button" 
                className="rf-btn rf-btn-secondary" 
                onClick={() => setReplyModalReview(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="rf-btn rf-btn-primary" 
                onClick={handleSaveReply}
                id="rf-reply-save-btn"
              >
                <Send size={14} />
                Publish Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editModalReview && (
        <div className="rf-modal-overlay">
          <div className="rf-modal-box">
            <div className="rf-modal-header">
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Edit Review</h3>
              <button 
                type="button" 
                onClick={() => setEditModalReview(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6d7175' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="rf-modal-body">
              <div className="rf-form-field">
                <label className="rf-label">Star Rating</label>
                <StarRating 
                  rating={editFormData.rating} 
                  interactive={true} 
                  size={24}
                  onChange={(r) => setEditFormData({ ...editFormData, rating: r })} 
                />
              </div>

              <div className="rf-form-field">
                <label className="rf-label">Customer Name</label>
                <input
                  type="text"
                  className="rf-input"
                  value={editFormData.customerName}
                  onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
                />
              </div>

              <div className="rf-form-field">
                <label className="rf-label">Review Title</label>
                <input
                  type="text"
                  className="rf-input"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                />
              </div>

              <div className="rf-form-field">
                <label className="rf-label">Review Details</label>
                <textarea
                  className="rf-textarea"
                  rows="4"
                  value={editFormData.body}
                  onChange={(e) => setEditFormData({ ...editFormData, body: e.target.value })}
                />
              </div>
            </div>
            <div className="rf-modal-footer">
              <button 
                type="button" 
                className="rf-btn rf-btn-secondary" 
                onClick={() => setEditModalReview(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="rf-btn rf-btn-primary" 
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
