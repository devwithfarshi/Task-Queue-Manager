import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { useContext } from "react";

const useAuth = () => useContext(AuthContext) as AuthContextType;

export default useAuth;
