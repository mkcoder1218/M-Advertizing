import { useQuery } from '@tanstack/react-query';
import { workTypesResource } from '../resources/workTypes';

export const useWorkTypes = () => {
  return useQuery({
    queryKey: ['workTypes'],
    queryFn: () => workTypesResource.list(),
  });
};
