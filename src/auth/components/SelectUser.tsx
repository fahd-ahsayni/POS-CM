import { logoLightMode } from "@/assets";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { RiRfidFill } from "react-icons/ri";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/store/slices/userSlice";

import SegmentedControl from "./SegmentedControl";
import SelectUserSlide from "./SelectUserSlide";
import ShineBorder from "@/components/ui/shine-border";
import { Separator } from "@/components/ui/separator";

export default function SelectUser() {
  const [activeTab, setActiveTab] = useState("cashiers");
  const dispatch = useDispatch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className="relative w-1/2 bg-gray-100 hidden flex-1 lg:flex flex-col">
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
          <div className="relative">
            <Input
              id="input-26"
              className="peer pe-9 ps-9 bg-zinc-300/10 border-zinc-300/10 text-zinc-950"
              placeholder="Search by name"
              type="search"
              onChange={handleSearch}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-zinc-950 peer-disabled:opacity-50">
              <Search size={16} strokeWidth={2} />
            </div>
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-zinc-950 outline-offset-2 transition-colors hover:text-zinc-950 focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit search"
              type="submit"
            >
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <SegmentedControl activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div>
          <SelectUserSlide userType={activeTab} />
          <Separator className="mb-2 max-w-xs mx-auto bg-zinc-100" />
          <div className="flex justify-center items-center mt-8">
            <ShineBorder
              className="flex justify-center items-center gap-4 text-white bg-zinc-900 py-2 px-8"
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
