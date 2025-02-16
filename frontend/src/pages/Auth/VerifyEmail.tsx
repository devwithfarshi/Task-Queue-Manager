import AuthServices from "@/services/AuthServices";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (params.get("token")) {
      setLoading(true);
      try {
        (async () => {
          const response = await AuthServices.verifyEmail(params.get("token")!);
          if (response.success) {
            toast.success(response.message);
            navigate("/login");
          } else {
            throw new Error(response.message);
          }
        })();
      } catch (error: any) {
        console.log(`Error while verifying email: `, error);
        toast.error(
          error.response.data.message || error.message || "Verification failed."
        );
        setError(
          error.response.data.message || error.message || "Verification failed."
        );
      } finally {
        setLoading(false);
      }
    } else {
      navigate("/login");
    }
  }, [params]);

  if (loading) {
    return <div>Verifying...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
};
export default VerifyEmail;
