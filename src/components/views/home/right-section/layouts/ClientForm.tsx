import PhoneInputWithSuggestions from "@/components/global/PhoneInputWithSuggestions";
import InputComponent from "@/components/global/InputComponent";
import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";
import { Client, ClientFormData } from "@/interfaces/clients";
import { loadingColors } from "@/preferences";
import { useRef, useState, useCallback, useEffect } from "react";
import { BeatLoader } from "react-spinners";

interface ClientFormProps {
  formData: ClientFormData;
  errors: Partial<ClientFormData>;
  handleInputChange: (
    field: keyof ClientFormData
  ) => (value: string | number | null) => void;
  handlePhoneSelect: (selectedClient: Client | null) => void;
  clients: Client[];
  isFetching: boolean;
  isSubmitting?: boolean;
}

export default function ClientForm({
  formData,
  errors,
  handleInputChange,
  handlePhoneSelect,
  clients,
  isFetching,
  isSubmitting = false,
}: ClientFormProps) {
  const [activeInput, setActiveInput] = useState<keyof ClientFormData | null>(
    null
  );
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  // Define refs for inputs
  const inputRefs = {
    phone: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    ice: useRef<HTMLInputElement>(null),
  };

  // Get the global virtual keyboard functions
  const { openKeyboard, showKeyboard } = useVirtualKeyboard();

  // Track if we need to reopen keyboard after selections or actions
  const [shouldReopenKeyboard, setShouldReopenKeyboard] = useState(false);
  
  // Track last active input to restore focus
  const [lastActiveInput, setLastActiveInput] = useState<keyof ClientFormData | null>(null);

  // Track if we're currently handling a focus event
  const isHandlingFocus = useRef(false);

  // Helper function to update input value and cursor position
  const updateInputValue = useCallback((
    field: keyof ClientFormData,
    newValue: string,
    newPosition: number
  ) => {
    handleInputChange(field)(newValue);
    setCursorPosition(newPosition);
    const inputRefCurrent = inputRefs[field]?.current;
    if (inputRefCurrent) {
      setTimeout(() => {
        inputRefCurrent.setSelectionRange(newPosition, newPosition);
        inputRefCurrent.focus();
      }, 0);
    }
  }, [handleInputChange, inputRefs]);

  // Handle key presses from virtual keyboard
  const handleKeyPress = useCallback((key: string, cursorAdjustment: number) => {
    if (activeInput === null) return;

    const currentValue = formData[activeInput] || "";
    let newValue = currentValue;
    let newPosition = cursorPosition;

    switch (key) {
      case "Backspace":
        if (cursorPosition > 0) {
          newValue =
            currentValue.slice(0, cursorPosition - 1) +
            currentValue.slice(cursorPosition);
          newPosition = cursorPosition - 1;
        }
        break;
      case "ArrowLeft":
        newPosition = Math.max(0, cursorPosition - 1);
        break;
      case "ArrowRight":
        newPosition = Math.min(currentValue.length, cursorPosition + 1);
        break;

      case "Delete":
        newValue = "";
        newPosition = 0;
        break;

      default:
        newValue =
          currentValue.slice(0, cursorPosition) +
          key +
          currentValue.slice(cursorPosition);
        newPosition = cursorPosition + cursorAdjustment;
        break;
    }

    updateInputValue(activeInput, newValue, newPosition);
  }, [activeInput, cursorPosition, formData, updateInputValue]);

  // Handle input focus
  const handleInputFocus = useCallback((inputType: keyof ClientFormData) => {
    isHandlingFocus.current = true;
    setActiveInput(inputType);
    setLastActiveInput(inputType);
    
    openKeyboard(inputType, handleKeyPress);
    
    const inputRef = inputRefs[inputType]?.current;
    if (inputRef) {
      setCursorPosition(inputRef.selectionStart || 0);
    }
    
    setTimeout(() => {
      isHandlingFocus.current = false;
    }, 100);
  }, [openKeyboard, handleKeyPress, inputRefs]);

  // Handle keyboard reopening when needed
  useEffect(() => {
    if (shouldReopenKeyboard && lastActiveInput && !showKeyboard) {
      const timer = setTimeout(() => {
        const inputRef = inputRefs[lastActiveInput]?.current;
        if (inputRef) {
          inputRef.focus();
          openKeyboard(lastActiveInput, handleKeyPress);
        }
        setShouldReopenKeyboard(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [shouldReopenKeyboard, lastActiveInput, showKeyboard, openKeyboard, handleKeyPress, inputRefs]);

  // Maintain keyboard visibility when selecting a phone
  const handlePhoneSelection = useCallback((client: Client | null) => {
    isHandlingFocus.current = true;
    handlePhoneSelect(client);
    
    // Don't automatically focus on phone input since we'll
    // either focus on name (for existing client) or stay on phone (for new)
    setTimeout(() => {
      isHandlingFocus.current = false;
    }, 10);
  }, [handlePhoneSelect]);

  // Handle focus on name input after selecting a client
  const focusNameInput = useCallback(() => {
    setTimeout(() => {
      if (inputRefs.name.current) {
        inputRefs.name.current.focus();
        handleInputFocus("name");
      }
    }, 100);
  }, [inputRefs.name, handleInputFocus]);

  // Track cursor position on input selection
  const handleSelect = useCallback((_field: keyof ClientFormData) => (e: React.SyntheticEvent<HTMLInputElement>) => {
    const selectionStart = (e.target as HTMLInputElement).selectionStart || 0;
    setCursorPosition(selectionStart);
  }, []);

  // Handle loading state
  if (isFetching || isSubmitting) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader color={loadingColors.primary} size={10} />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Phone Number Input with Suggestions */}
      <PhoneInputWithSuggestions
        value={formData.phone}
        onChange={handleInputChange("phone")}
        onSelectClient={handlePhoneSelection}
        onClientSelect={focusNameInput} // New prop to focus name input after client selection
        clients={clients}
        isFetching={isFetching}
        hasError={!!errors.phone}
        errorMessage={errors.phone}
        onFocus={() => handleInputFocus("phone")}
        onSelect={handleSelect("phone")}
        inputRef={inputRefs.phone}
      />

      {/* Full Name Input */}
      <InputComponent
        config={{
          label: "Full Name / Organization Name",
          placeholder: "Enter your full name or organization name",
          type: "text",
          required: true,
          value: formData.name,
          setValue: handleInputChange("name"),
          errorMessage: errors.name,
          hasError: !!errors.name,
          onFocus: () => handleInputFocus("name"),
          onSelect: handleSelect("name"),
          ref: inputRefs.name,
        }}
      />

      {/* Address Input */}
      <InputComponent
        config={{
          label: "Address",
          placeholder: "e.g. 123 Main street, Apartment, City",
          type: "text",
          required: true,
          value: formData.address || "",
          setValue: handleInputChange("address"),
          errorMessage: errors.address,
          hasError: !!errors.address,
          onFocus: () => handleInputFocus("address"),
          onSelect: handleSelect("address"),
        }}
      />

      {/* Email Input */}
      <InputComponent
        config={{
          label: "Email",
          placeholder: "e.g. example@gmail.com",
          type: "email",
          required: false,
          value: formData.email || "",
          setValue: handleInputChange("email"),
          errorMessage: errors.email,
          hasError: !!errors.email,
          optionalText: "Optional",
          onFocus: () => handleInputFocus("email"),
          onSelect: handleSelect("email"),
        }}
      />

      {/* Company Identification Number (ICE) Input */}
      <InputComponent
        config={{
          label: "Company Identification Number",
          placeholder: "Enter 14-digit company ICE",
          type: "text",
          required: false,
          value: formData.ice || "",
          setValue: handleInputChange("ice"),
          errorMessage: errors.ice,
          hasError: !!errors.ice,
          optionalText: "Optional",
          helperText: "Required for businesses. Skip for individual clients.",
          onFocus: () => handleInputFocus("ice"),
          onSelect: handleSelect("ice"),
        }}
      />
    </div>
  );
}
