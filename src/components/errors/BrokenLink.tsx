import { BrokenLinkIcon } from "@/assets/plumpy-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Layout from "./Layout";

export default function BrokenLink() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // If we have a previous history state, go back
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // If no history, go to home page
      navigate("/", { replace: true });
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Layout
        icon={
          <BrokenLinkIcon className="w-32 h-32 dark:text-white text-primary-black" />
        }
        title="Page not found"
        description={
          <>
            <span>
              The page you were looking for seems to have gone missing.
            </span>
          </>
        }
      >
        <div>
          <Button onClick={handleGoBack}>Go back</Button>
        </div>
      </Layout>
    </main>
  );
}
