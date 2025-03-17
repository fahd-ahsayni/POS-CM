import { unknownUser } from "@/assets";
import { Client } from "@/interfaces/clients";
import { Check, User } from "lucide-react"; // Import Check icon
import { useEffect, useMemo, useRef, useState } from "react";
import { TypographySmall } from "../ui/typography";
import InputComponent from "./InputComponent";

interface PhoneInputWithSuggestionsProps {
  value: string;
  onChange: (value: string | number | null) => void;
  onSelectClient: (client: Client) => void;
  onClientSelect?: () => void; // New prop for additional action after client selection
  clients: Client[];
  isFetching: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onFocus?: () => void;
  onSelect?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function PhoneInputWithSuggestions({
  value,
  onChange,
  onSelectClient,
  onClientSelect, // New prop
  clients,
  hasError = false,
  errorMessage,
  onFocus,
  onSelect,
  inputRef,
}: PhoneInputWithSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<
    string | number | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Access keyboard context to check if it's visible
  //   const { showKeyboard, openKeyboard } = useVirtualKeyboard();

  // Filter clients only when value changes or clients changes
  const filteredClients = useMemo(() => {
    if (!value) {
      return clients;
    }
    return clients.filter((client) =>
      client.phone.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, clients]);

  // Only handle outside clicks for suggestions, not keyboard
  useEffect(() => {
    if (!showSuggestions) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Don't close suggestions when clicking on inputs or keyboard
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Check if click is inside container or suggestions
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsideSuggestions = suggestionsRef.current?.contains(target);

      // Check if click is inside virtual keyboard
      const keyboardElement = document.querySelector(
        '[data-virtual-keyboard="true"]'
      );
      const isInsideKeyboard = keyboardElement?.contains(target);

      // Close suggestions if click is outside all elements
      if (!isInsideContainer && !isInsideSuggestions && !isInsideKeyboard) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [showSuggestions]);

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (onFocus) onFocus();
  };

  const handleClientSelect = (client: Client) => {
    // First set showSuggestions to false to ensure UI updates
    setShowSuggestions(false);

    // Store the selected client's ID
    setSelectedClientId(client._id);

    // Use setTimeout to ensure state update has happened before the next actions
    setTimeout(() => {
      onSelectClient(client);

      // Call onClientSelect callback if provided
      if (onClientSelect) {
        onClientSelect();
      }

      // Re-focus input after selection but don't reopen suggestions
      if (inputRef?.current && !onClientSelect) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Keep the panel in the right position when window resizes
  useEffect(() => {
    const handleResize = () => {
      // Force update of suggestion panel position
      if (suggestionsRef.current && containerRef.current && showSuggestions) {
        const rect = containerRef.current.getBoundingClientRect();
        suggestionsRef.current.style.width = `${rect.width}px`;
        suggestionsRef.current.style.top = `${
          rect.bottom + window.scrollY + 5
        }px`;
        suggestionsRef.current.style.left = `${rect.left + window.scrollX}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSuggestions]);

  // Update panel position when showSuggestions changes
  useEffect(() => {
    if (showSuggestions && suggestionsRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      suggestionsRef.current.style.width = `${rect.width}px`;
      suggestionsRef.current.style.top = `${
        rect.bottom + window.scrollY + 5
      }px`;
      suggestionsRef.current.style.left = `${rect.left + window.scrollX}px`;
    }
  }, [showSuggestions]);

  return (
    <div ref={containerRef} className="relative w-full">
      <InputComponent
        config={{
          label: "Phone Number",
          placeholder: "Enter phone number",
          type: "text",
          required: true,
          value: value,
          setValue: onChange,
          hasError: hasError,
          errorMessage: errorMessage,
          onFocus: handleInputFocus,
          onSelect: onSelect,
          ref: inputRef,
        }}
      />

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="fixed z-50 bg-white dark:bg-primary-black rounded-md shadow-xl shadow-black/30 border border-border"
          style={{
            minWidth: "320px",
            maxHeight: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="p-3 flex items-center justify-between">
            <TypographySmall className="dark:text-neutral-300 text-primary-black font-medium">
              Select existing client or type new number
            </TypographySmall>

            <TypographySmall className="dark:text-neutral-300 text-primary-black font-medium flex items-center gap-x-1">
              <User size={16} strokeWidth={2} />
              <span className="bg-primary-red h-6 w-6 rounded-full flex items-center justify-center text-white text-xs shadow-lg shadow-red-600/30">
                {filteredClients.length}
              </span>
            </TypographySmall>
          </div>

          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-primary-red scrollbar-track-transparent"
            style={{
              maxHeight: "250px",
              minHeight: "100px",
            }}
          >
            <div className="p-2">
              {filteredClients.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {filteredClients.map((client) => {
                    const isSelected =
                      selectedClientId === client._id &&
                      client._id !== undefined;
                    return (
                      <button
                        key={client._id || client.phone}
                        className={`flex justify-between items-start p-3 rounded-md 
                          ${
                            isSelected
                              ? "bg-secondary-black dark:bg-secondary-black border border-border"
                              : "hover:bg-primary-black/5 dark:hover:bg-white/5"
                          } 
                          transition-colors text-left`}
                        onClick={() => handleClientSelect(client)}
                        type="button"
                      >
                        <div className="flex space-x-3">
                          <div className="size-10 rounded-lg relative flex items-center justify-center overflow-hidden">
                            <img
                              src={unknownUser}
                              alt="User"
                              className="=absolute w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <TypographySmall className="font-medium text-sm">
                              {client.phone}
                            </TypographySmall>
                            {client.name && (
                              <TypographySmall className="text-muted-foreground">
                                {client.name}
                              </TypographySmall>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="text-primary-red">
                            <Check size={18} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <TypographySmall className="text-center text-muted-foreground p-4">
                  No matching clients found. Continue typing to add a new
                  client.
                </TypographySmall>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
