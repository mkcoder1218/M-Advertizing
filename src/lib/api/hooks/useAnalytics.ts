import { useQuery } from '@tanstack/react-query';
import { analyticsResource } from '../resources/analytics';

export const useAnalytics = () =>
  useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsResource.overview(),
  });
