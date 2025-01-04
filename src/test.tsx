import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SwitchDemo() {
  return (
    <div
      className="inline-flex items-center gap-2"
      style={
        {
          "--primary": "238.7 83.5% 66.7%",
          "--ring": "238.7 83.5% 66.7%",
        } as React.CSSProperties
      }
    >
      <Switch id="switch-03" defaultChecked />
    </div>
  );
}
