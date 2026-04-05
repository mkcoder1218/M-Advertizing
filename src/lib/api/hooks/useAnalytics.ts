import { useQuery } from '@tanstack/react-query';
import { analyticsResource } from '../resources/analytics';

export const useAnalytics = () =>
  useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsResource.overview(),
  });

export const useRoleAnalytics = () =>
  useQuery({
    queryKey: ['analytics-role'],
    queryFn: () => analyticsResource.role(),
  });
