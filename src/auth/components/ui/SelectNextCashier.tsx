import { unknownUser } from "@/assets";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const users = JSON.parse(localStorage.getItem("users") || "[]").cashiers;

export default function SelectNextCashier({
  selectedPerson,
  setSelectedPerson,
}: {
  selectedPerson: User | null;
  setSelectedPerson: (user: User | null) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? users
      : users.filter((user: User) => {
          return user.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      className="w-full"
      as="div"
      value={selectedPerson}
      onChange={setSelectedPerson}
    >
      <Label className="pl-2">Assigned to</Label>
      <div className="relative mt-1">
        <ComboboxInput
          className="w-full h-[38px] placeholder:text-muted-foreground/70 rounded-md focus:ring-1 focus:ring-primary-black/10 dark:focus:ring-white/10 bg-primary-black/5 dark:bg-white/5 py-1 pl-3 pr-10 shadow-sm focus:outline-none text-[.8rem]"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(user: User) => user?.name}
          placeholder="Select the cashier who will take over"
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDown
            className="h-5 w-5 text-neutral-dark-grey"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredPeople.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-2 max-h-56 min-w-64 w-full overflow-auto rounded-md dark:bg-primary-black bg-white py-1 shadow-lg dark:shadow-black/50 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredPeople.map((user: User) => (
              <ComboboxOption
                key={user._id}
                value={user}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-3 pr-9 text-sm",
                    active
                      ? "dark:bg-white/5 bg-primary-black/5 dark:text-white text-primary-black"
                      : "dark:text-white text-primary-black"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <img
                        src={user.image || unknownUser}
                        alt=""
                        className="h-5 w-5 object-cover flex-shrink-0 rounded-full"
                      />
                      <span
                        className={cn(
                          "ml-3 truncate",
                          selected && "font-medium"
                        )}
                      >
                        {user.name}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={cn(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-primary-red" : "text-primary-red"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
