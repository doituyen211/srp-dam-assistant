"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { captureClientError } from "@/lib/sentry";

/**
 * useProposals - Hook to fetch and manage proposals
 *
 * @param {Object} filters optional filters (status, field)
 * @returns {Object} { proposals, loading, error, refetch }
 */
export const useProposals = (filters = {}) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProposals = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const data = await api.getProposals(filters);
      setProposals(data);
      setError(null);
    } catch (err) {
      const errorMessage = "Không thể tải danh sách đề tài. Vui lòng thử lại.";
      setError(errorMessage);
      captureClientError(err, { context: "fetch_proposals_failed" });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch on mount and when filters change
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await api.getProposals(filters);
        if (!mounted) return;
        setProposals(data);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        const errorMessage =
          "Không thể tải danh sách đề tài. Vui lòng thử lại.";
        setError(errorMessage);
        captureClientError(err, { context: "fetch_proposals_failed" });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [filters]);

  /**
   * Refetch proposals
   */
  const refetch = useCallback(() => {
    fetchProposals();
  }, [fetchProposals]);

  return {
    proposals,
    loading,
    error,
    refetch,
  };
};
