import SelectUser from "./components/SelectUser";
import Passcode from "./components/Passcode";

export default function LogInPage() {
  
  return (
    <>
      <div className="flex min-h-screen overflow-hidden" dir="ltr">
        <SelectUser />
        <Passcode />
      </div>
    </>
  );
}
