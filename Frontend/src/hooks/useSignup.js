import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";

const useSignup = () => {
    const queryClient = useQueryClient();
  const {
    mutate: signupMutation,
    isPending, 
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return {isPending,error,signupMutation}
}

export default useSignup