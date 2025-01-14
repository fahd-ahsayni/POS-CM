import Layout from "./Layout";
import { WarningIcon } from "@/assets/plumpy-icons";
import { Button } from "../ui/button";

export default function ErrorOccurred() {
  const handleTryAgain = () => {
    window.location.reload();
  };
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Layout
        icon={
          <WarningIcon className="w-32 h-32 dark:text-white text-primary-black" />
        }
        title="Error occurred"
        description={
          <>
            <span>
              You didn’t break the internet, but we can’t find what are you
              looking for.
            </span>
          </>
        }
      >
        <div>
          <Button onClick={handleTryAgain}>Try again</Button>
        </div>
      </Layout>
    </main>
  );
}
