import { SessionExpiredIcon } from "@/assets/plumpy-icons";
import Layout from "./Layout";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { logoutService } from "@/api/services";

export default function SessionExpired() {
  const navigate = useNavigate();
  const handleContinue = async () => {
    await logoutService();
    navigate("/login");
  };
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Layout
        icon={
          <SessionExpiredIcon className="w-32 h-32 dark:text-white text-primary-black" />
        }
        title="Session expired"
        description={
          <>
            <span>Your current session has been expired.</span>
            <span>Please click on the button below to login again.</span>
          </>
        }
      >
        <div>
          <Button onClick={handleContinue}>Continue</Button>
        </div>
      </Layout>
    </main>
  );
}
