import { SessionExpiredIcon } from "@/assets/plumpy-icons";
import Layout from "./Layout";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function SessionExpired() {
  const navigate = useNavigate();
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
          <Button onClick={() => navigate("/login")}>Continue</Button>
        </div>
      </Layout>
    </main>
  );
}
