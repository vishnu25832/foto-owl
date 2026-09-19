import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchImages } from '../api/picsumApi';
import { PicsumImage } from '../types/image';

const PAGE_LIMIT = 20;

export const useGallery = () => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestInProgress = useRef(false);

  const loadPage = useCallback(
    async (pageNumber: number, replace = false) => {
      if (requestInProgress.current) {
        return;
      }

      requestInProgress.current = true;
      setError(null);

      try {
        const newImages = await fetchImages(
          pageNumber,
          PAGE_LIMIT,
        );

        setImages((currentImages) =>
          replace
            ? newImages
            : [...currentImages, ...newImages],
        );

        setPage(pageNumber);
      } catch {
        setError('Unable to load images. Please try again.');
      } finally {
        requestInProgress.current = false;
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const loadInitialImages = useCallback(async () => {
    setLoading(true);
    await loadPage(1, true);
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (
      loading ||
      loadingMore ||
      refreshing ||
      requestInProgress.current
    ) {
      return;
    }

    setLoadingMore(true);

    await loadPage(page + 1);
  }, [
    loading,
    loadingMore,
    refreshing,
    page,
    loadPage,
  ]);

  const refresh = useCallback(async () => {
    if (
      refreshing ||
      requestInProgress.current
    ) {
      return;
    }

    setRefreshing(true);

    await loadPage(1, true);
  }, [refreshing, loadPage]);

  const retry = useCallback(async () => {
    setLoading(true);
    await loadPage(1, true);
  }, [loadPage]);

  useEffect(() => {
    loadInitialImages();
  }, [loadInitialImages]);

  return {
    images,
    loading,
    loadingMore,
    refreshing,
    error,
    loadMore,
    refresh,
    retry,
  };
};