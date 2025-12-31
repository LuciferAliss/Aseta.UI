import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../services/userService";

// Хук для получения списка инвентарей
export const useGetInventories = () => {
  return useQuery({
    queryKey: ["inventories"],
    queryFn: login,
  });
};

// Хук для создания нового инвентаря
export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventory,
    onSuccess: () => {
      // После успешного создания, автоматически обновляем список инвентарей
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
};
