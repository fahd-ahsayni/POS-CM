import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import { Fragment, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SelectUserCombobox() {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  // Access users and searchQuery from the Redux store
  const users = useSelector((state: RootState) => state.users.users);
  const searchQuery = useSelector(
    (state: RootState) => state.users.searchQuery
  );

  // Filter users based on search query
  const filteredUserGroups = Object.entries(users).map(
    ([userType, userList]) => ({
      userType,
      userList: userList.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })
  );

  return (
    <div className="space-y-2 w-[200px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm border-none text-zinc-900 bg-gray-200 hover:bg-gray-200 px-3 font-normal"
          >
            {value ? (
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-lg leading-none">
                  <img
                    src={
                      filteredUserGroups
                        .map((group) =>
                          group.userList.find((user) => user.name === value)
                        )
                        .filter(Boolean)[0]?.imageUrl
                    }
                    className="h-6 w-6 rounded-full object-cover"
                  />
                </span>
                <span className="truncate">{value}</span>
              </span>
            ) : (
              <span>Select user</span>
            )}
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              {filteredUserGroups.map((group) => (
                <Fragment key={group.userType}>
                  <CommandGroup heading={group.userType}>
                    {group.userList.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.name}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          setOpen(false);
                        }}
                      >
                        <img
                          src={user.imageUrl}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        {user.name}
                        {value === user.name && (
                          <Check
                            size={16}
                            strokeWidth={2}
                            className="ml-auto"
                          />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Fragment>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
