import { logoLightMode } from "@/assets";
import { RiRfidFill } from "react-icons/ri";
import { useState } from "react";
import SegmentedControl from "./SegmentedControl";
import SelectUserSlide from "./SelectUserSlide";
import ShineBorder from "@/components/ui/shine-border";

export default function SelectUser() {
  const [activeTab, setActiveTab] = useState("cashiers");

  return (
    <div className="relative w-1/2 bg-secondary-white hidden flex-1 lg:flex flex-col">
      <div className="relative z-10 flex h-16 flex-shrink-0">
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <img src={logoLightMode} alt="logo" className="w-24 h-auto" />
        </div>
      </div>
      <div className="sm:px-6 px-4">
        <div className="mt-6">
          <h2 className="tracking-tight scroll-m-20 text-3xl font-semibold text-zinc-950">
            Authenticate your access
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Choose your account or scan your RFID to authenticate.
          </p>
        </div>
        <div className="mt-10 flex justify-between items-center">
          {/* <SelectUserCombobox /> */}

          <SegmentedControl activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="mt-20">
          <SelectUserSlide userType={activeTab} />
          <div className="flex justify-center items-center mt-6">
            <ShineBorder
              className="flex justify-center items-center gap-4 py-3 px-8"
              color="#fff"
              borderWidth={2}
            >
              <RiRfidFill size={20} className="text-white" />
              Scan your badge
            </ShineBorder>
          </div>
        </div>
      </div>
    </div>
  );
}
