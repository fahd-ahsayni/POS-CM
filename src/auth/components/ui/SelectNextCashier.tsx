import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Button, Input, Label } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { unknownUser } from "@/assets";
import { User } from "@/types";
import { ChevronDown } from "lucide-react";

const users = JSON.parse(localStorage.getItem("users") || "[]").cashiers;

export default function SelectNextCashier() {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<User | null>(users[0]);

  const filteredPeople =
    query === ""
      ? users
      : users.filter((user: User) => {
          return user.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      className="w-[350px]"
      as="div"
      value={selectedPerson}
      onChange={setSelectedPerson}
    >
      <Label className="block pl-2 text-xs leading-3 font-medium tex-primary-black dark:text-white pb-0.5">
        Assigned to
      </Label>
      <div className="relative mt-1">
        <ComboboxInput
          className="w-full h-[38px] rounded-md focus:border focus:border-primary-black/5 dark:focus:border-white/5 bg-primary-black/5 dark:bg-white/5 py-1 pl-3 pr-10 shadow-sm focus:outline-none sm:text-xs"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(user: User) => user?.name}
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
