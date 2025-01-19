import { unknownUser } from "@/assets";
import ComboboxSelect from "@/components/global/ComboboxSelect";
import { cn } from "@/lib/utils";
import { User } from "@/types/user.types";
import { Check } from "lucide-react";

const users = JSON.parse(localStorage.getItem("users") || "[]").cashiers;

export default function SelectNextCashier({
  selectedPerson,
  setSelectedPerson,
}: {
  selectedPerson: User | null;
  setSelectedPerson: (user: User | null) => void;
}) {
  return (
    <ComboboxSelect
      label="Assigned to"
      items={users ?? []}
      value={selectedPerson}
      onChange={setSelectedPerson}
      displayValue={(user: User) => user?.name}
      placeholder="Select the cashier who will take over"
      filterFunction={(query, user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      }
      renderOption={(user, _, selected) => (
        <>
          <div className="flex items-center">
            <img
              src={user.image || unknownUser}
              alt=""
              className="h-5 w-5 object-cover flex-shrink-0 rounded-full"
            />
            <span className={cn("ml-3 truncate", selected && "font-medium")}>
              {user.name}
            </span>
          </div>

          {selected && (
            <span
              className={cn(
                "absolute inset-y-0 right-0 flex items-center pr-4",
                "text-primary-red"
              )}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </>
      )}
    />
  );
}
