import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/views/home/right-section/components/SelectTypeOfOrder";
import { useAddClient } from "@/components/views/home/right-section/hooks/useAddClient";
import { useNumberOfTable } from "@/components/views/home/right-section/hooks/useNumberOfTable";
import ClientForm from "@/components/views/home/right-section/layouts/ClientForm";
import CoasterCallNumberDisplay from "@/components/views/home/right-section/layouts/CoasterCallNumberDisplay";
import { TableNumberDisplay } from "@/components/views/home/right-section/layouts/TableNumberDisplay";
import { selectOrder } from "@/store/slices/order/createOrder";
import { useSelector } from "react-redux";
import { useChangeOrderType } from "./context/ChangeOrderTypeContext";

export default function DrawerChangeOrderContent() {
  const {
    showForm,
    handleBack,
    setOpen,
    selectedType,
    handleOrderTypeSelect,
    displayedTypes,
  } = useChangeOrderType();

  const order = useSelector(selectOrder);

  const {
    handleSubmit: handleClientSubmit,
    isLoading,
    formData,
    errors,
    handleInputChange,
    handlePhoneSelect,
    clients,
    isFetching,
  } = useAddClient(() => setOpen(false));

  

  const {
    tableNumber,
    tableValid,
    handleNumberClick: handleTableNumberClick,
    handleConfirm: handleTableConfirm,
    getValidationMessage,
  } = useNumberOfTable();

  switch (showForm) {
    case "client":
      return (
        <div className="flex flex-col h-full relative">
          <div className="w-full">
            <ClientForm
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handlePhoneSelect={handlePhoneSelect}
              clients={clients}
              isFetching={isFetching}
            />
          </div>
          <div className="flex gap-x-2 w-full mt-4 absolute bottom-0">
            <Button
              variant="secondary"
              className="flex-1 bg-white border border-border shadow dark:bg-white/10"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleClientSubmit}
              disabled={isLoading}
            >
              Confirm
            </Button>
          </div>
        </div>
      );

    case "table":
      return (
        <div className="flex flex-col h-full relative">
          <TableNumberDisplay
            tableNumber={tableNumber}
            tableValid={tableValid}
            getValidationMessage={getValidationMessage}
            handleNumberClick={handleTableNumberClick}
          />
          <div className="flex gap-x-2 w-full mt-4 absolute bottom-0">
            <Button
              variant="secondary"
              className="flex-1 bg-white border border-border shadow dark:bg-white/10"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleTableConfirm(tableNumber)}
              disabled={!tableNumber || tableValid !== "valid"}
            >
              Confirm
            </Button>
          </div>
        </div>
      );

    case "coaster":
      return (
        <div className="flex flex-col h-full relative">
          <CoasterCallNumberDisplay fixedLightDark={true} />
          <div className="flex gap-x-2 w-full mt-4 absolute bottom-0">
            <Button
              variant="secondary"
              className="flex-1 bg-white border border-border shadow dark:bg-white/10"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={!order.coaster_call}
            >
              Confirm
            </Button>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col gap-y-8 h-full justify-center items-center">
          {displayedTypes.map((orderType) => (
            <OrderCard
              key={orderType._id}
              orderType={orderType}
              onSelect={() => handleOrderTypeSelect(orderType)}
              isSelected={selectedType?._id === orderType._id}
              fixedLightDark={true}
            />
          ))}
        </div>
      );
  }
}
