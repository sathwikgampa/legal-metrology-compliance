import React, { useEffect, useState } from 'react';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getInspectionHistory } from '../services/api';

const CATEGORIES = [
  'ALL',
  'Food & Grains',
  'Snacks & Confectionery',
  'Beverages',
  'Oils & Vinegars',
  'Household Cleaners',
  'Cosmetics & Personal Care',
  'Cereals & Breakfast'
];

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All Compliance Statuses' },
  { value: 'COMPLIANT', label: '🟢 Compliant' },
  { value: 'POTENTIAL_VIOLATION', label: '🔴 Potential Violations' },
  { value: 'NEEDS_REVIEW', label: '🟡 Needs Review' }
];

export default function HistoryPage() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getInspectionHistory({
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory
      });

      // Client-side sorting
      let sorted = [...res];
      if (sortBy === 'date-desc') {
        sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      } else if (sortBy === 'date-asc') {
        sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      } else if (sortBy === 'conf-desc') {
        sorted.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
      }

      setInspections(sorted);
    } catch (err) {
      setError(err.message || 'Failed to fetch historical inspections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchTerm, selectedStatus, selectedCategory, sortBy]);

  return (
    <div className="page-container history-page">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Inspection Audit Archives & Records</h1>
          <p className="page-subtitle">
            Historical registry of packaged commodity verifications, OCR extractions, and statutory officer decisions.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="content-card filter-controls-card mb-4">
        <div className="filter-controls-grid">
          {/* Search Box */}
          <div className="filter-item filter-search">
            <label className="filter-label">Search Keyword / ID</label>
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="text-input search-input"
                placeholder="Search by ID, product, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-item">
            <label className="filter-label">Compliance Status</label>
            <select
              className="select-input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-item">
            <label className="filter-label">Commodity Category</label>
            <select
              className="select-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="filter-item">
            <label className="filter-label">Sort Records By</label>
            <select
              className="select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Audit Date (Newest First)</option>
              <option value="date-asc">Audit Date (Oldest First)</option>
              <option value="conf-desc">Confidence Score (Highest First)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || searchTerm.trim() !== '') && (
          <div className="active-filters-row">
            <span className="text-xs text-muted">Active Filters:</span>
            {selectedStatus !== 'ALL' && (
              <span className="filter-pill" onClick={() => setSelectedStatus('ALL')}>
                Status: {selectedStatus} ✕
              </span>
            )}
            {selectedCategory !== 'ALL' && (
              <span className="filter-pill" onClick={() => setSelectedCategory('ALL')}>
                Category: {selectedCategory} ✕
              </span>
            )}
            {searchTerm.trim() !== '' && (
              <span className="filter-pill" onClick={() => setSearchTerm('')}>
                Keyword: "{searchTerm}" ✕
              </span>
            )}
            <button
              className="btn btn-xs btn-outline"
              onClick={() => {
                setSelectedStatus('ALL');
                setSelectedCategory('ALL');
                setSearchTerm('');
              }}
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Table Content */}
      <div className="content-card">
        {loading ? (
          <LoadingState message="Filtering inspection records..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchHistory} />
        ) : inspections.length === 0 ? (
          <EmptyState
            title="No Matching Inspections Found"
            message="No records matched your search query or selected filter criteria."
            actionLabel="Clear Filters"
            onAction={() => {
              setSelectedStatus('ALL');
              setSelectedCategory('ALL');
              setSearchTerm('');
            }}
          />
        ) : (
          <div>
            <div className="records-count-bar">
              <span>Showing <b>{inspections.length}</b> verified packaging audit records</span>
            </div>
            <InspectionTable inspections={inspections} />
          </div>
        )}
      </div>
    </div>
  );
}
