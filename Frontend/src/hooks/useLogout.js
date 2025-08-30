import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import toast from "react-hot-toast";


const useLogout = () => {
    const queryClient = useQueryClient();
    const {
    mutate: logoutMutation,
    isPending, 
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Successfully Logged Out"),
      queryClient.invalidateQueries({ queryKey: ["authUser"] })},
    onError: (err)=>{
      // toast.error(err);
      console.log("Logout ka ",err);
    }
  });

  return {logoutMutation,isPending,error }
}

export default useLogout