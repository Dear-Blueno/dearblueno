import { useQuery } from "@tanstack/react-query";
import { loadAuth } from "gateways/AuthGateway";

export default function useUser() {
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery(["user"], async () => {
    const response = await loadAuth();
    if (response.success) {
      return response.payload;
    }
  });
  return { user, isLoadingUser, refetchUser };
}
