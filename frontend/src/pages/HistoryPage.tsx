import React, { useEffect, useState } from 'react';
import InspectionTable from '@/components/InspectionTable';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { getInspectionHistory } from '@/services/api';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlurText } from '@/components/react-bits/BlurText';
import { Search, Filter, X, RotateCcw, History, FileSpreadsheet } from 'lucide-react';

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
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('date-desc');

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
        sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else if (sortBy === 'date-asc') {
        sorted.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      } else if (sortBy === 'conf-desc') {
        sorted.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
      }

      setInspections(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch historical inspections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchTerm, selectedStatus, selectedCategory, sortBy]);

  const hasActiveFilters = selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || searchTerm.trim() !== '';

  const handleResetFilters = () => {
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            <BlurText text="Inspection Audit Archives & Records" delay={30} />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Historical registry of packaged commodity verifications, OCR extractions, and statutory officer decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-8 px-3 text-xs gap-1.5 font-mono">
            <History className="h-3.5 w-3.5 text-primary" />
            {inspections.length} Records
          </Badge>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Search Box */}
            <div className="space-y-1.5">
              <Label htmlFor="searchKeyword" className="text-xs font-semibold">
                Search Keyword / ID
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchKeyword"
                  type="text"
                  placeholder="ID, product, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="statusFilter" className="text-xs font-semibold">
                Compliance Status
              </Label>
              <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val)}>
                <SelectTrigger id="statusFilter" className="h-9 text-xs">
                  <SelectValue placeholder="All Compliance Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((f) => (
                    <SelectItem key={f.value} value={f.value} className="text-xs">
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="categoryFilter" className="text-xs font-semibold">
                Commodity Category
              </Label>
              <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)}>
                <SelectTrigger id="categoryFilter" className="h-9 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat === 'ALL' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Control */}
            <div className="space-y-1.5">
              <Label htmlFor="sortRecords" className="text-xs font-semibold">
                Sort Records By
              </Label>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger id="sortRecords" className="h-9 text-xs">
                  <SelectValue placeholder="Sort records" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc" className="text-xs">Audit Date (Newest First)</SelectItem>
                  <SelectItem value="date-asc" className="text-xs">Audit Date (Oldest First)</SelectItem>
                  <SelectItem value="conf-desc" className="text-xs">Confidence Score (Highest First)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs">
              <span className="text-muted-foreground text-[11px] font-medium">Active Filters:</span>

              {selectedStatus !== 'ALL' && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80 text-[11px] font-normal"
                  onClick={() => setSelectedStatus('ALL')}
                >
                  Status: {selectedStatus}
                  <X className="h-3 w-3" />
                </Badge>
              )}

              {selectedCategory !== 'ALL' && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80 text-[11px] font-normal"
                  onClick={() => setSelectedCategory('ALL')}
                >
                  Category: {selectedCategory}
                  <X className="h-3 w-3" />
                </Badge>
              )}

              {searchTerm.trim() !== '' && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80 text-[11px] font-normal"
                  onClick={() => setSearchTerm('')}
                >
                  Keyword: "{searchTerm}"
                  <X className="h-3 w-3" />
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                onClick={handleResetFilters}
              >
                <RotateCcw className="h-3 w-3" />
                Reset All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Table Content */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8">
              <LoadingState message="Filtering inspection records..." />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorState message={error} onRetry={fetchHistory} />
            </div>
          ) : inspections.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No Matching Inspections Found"
                message="No records matched your search query or selected filter criteria."
                actionLabel="Clear Filters"
                onAction={handleResetFilters}
              />
            </div>
          ) : (
            <div>
              <div className="px-5 py-3 border-b border-border/40 text-xs text-muted-foreground flex items-center justify-between">
                <span>
                  Showing <b className="text-foreground">{inspections.length}</b> verified packaging audit records
                </span>
              </div>
              <InspectionTable inspections={inspections} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
