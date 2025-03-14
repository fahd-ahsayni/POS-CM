import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, createClient, updateClient, ClientFormData } from '@/api/services/client.service';
import { Client } from '@/interfaces/clients';
import { createToast } from '@/components/global/Toasters';
import { toast } from 'react-toastify';

// Key for clients query
export const CLIENTS_QUERY_KEY = 'clients';

export function useClientsData() {
  const queryClient = useQueryClient();

  // Fetch all clients
  const { 
    data: clients = [], 
    isLoading: isFetching,
    error 
  } = useQuery({
    queryKey: [CLIENTS_QUERY_KEY],
    queryFn: async () => {
      const response = await getClients();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create a new client
  const createClientMutation = useMutation({
    mutationFn: (data: ClientFormData) => createClient(data),
    onSuccess: (data) => {
      // Update clients cache
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
      toast.success(createToast('Client created', 'Client created successfully', 'success'));
      return data.data.client;
    },
    onError: () => {
      toast.error(createToast('Client creation failed', 'Failed to create client', 'error'));
    }
  });

  // Update an existing client
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientFormData }) => updateClient(id, data),
    onSuccess: () => {
      // Update clients cache
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
      toast.info(createToast('Client updated', 'Client information updated successfully', 'info'));
    },
    onError: () => {
      toast.error(createToast('Client update failed', 'Failed to update client', 'error'));
    }
  });

  // Find client by phone number
  const findClientByPhone = (phone: string): Client | undefined => {
    return clients?.find(client => client.phone === phone);
  };

  // Find client by id
  const findClientById = (id: string): Client | undefined => {
    return clients?.find(client => client._id === id);
  };

  return {
    clients,
    isFetching,
    error,
    createClient: createClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutateAsync,
    findClientByPhone,
    findClientById,
    isCreatingClient: createClientMutation.isPending,
    isUpdatingClient: updateClientMutation.isPending,
  };
}
