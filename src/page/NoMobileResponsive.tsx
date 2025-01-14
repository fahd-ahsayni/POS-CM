import { appStore, googlePlay } from "@/assets";
import { NoPhoneIcon } from "@/assets/plumpy-icons";
import Layout from "@/components/errors/Layout";

export default function NoMobileResponsive() {
  return (
    <>
      <Layout
        icon={<NoPhoneIcon className="h-28 w-auto" />}
        title="Mobile Access Not Supported"
        description={
          <span className="w-full flex items-center justify-center">
            <span className="text-center">
              To access all features and manage your operations seamlessly,
              please download our dedicated mobile app. It's available on both
              the App Store and Google Play for the best experience on mobile
              devices.
            </span>
          </span>
        }
      >
        <div className="flex md:flex-row flex-col items-center justify-center gap-4">
          <a href="/">
            <img src={googlePlay} alt="Google Play" />
          </a>
          <a href="/">
            <img src={appStore} alt="App Store" />
          </a>
        </div>
      </Layout>
    </>
  );
}
