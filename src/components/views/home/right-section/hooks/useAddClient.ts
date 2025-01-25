import { createClient, getClients, updateClient } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { formatAddress } from "@/lib/utils";
import { selectOrder, setClientId } from "@/store/slices/order/create-order.slice";
import { Client } from "@/types/clients.types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { z } from "zod";
import { useRightViewContext } from "../contexts/RightViewContext";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "./../constants/index";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9+\s-()]{8,}$/, "Invalid phone number format"),
  address: z.string().min(1, "Address is required"),
  email: z.string().optional(),
  ice: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export const useAddClient = (onSuccess?: () => void) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch();
  const { setViews } = useRightViewContext();

  const order = useSelector(selectOrder);
  const clientId = order.client_id;

  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    phone: "",
    address: "",
    email: "",
    ice: "",
  });
  const [errors, setErrors] = useState<Partial<ClientFormData>>({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await getClients();
        if (res.status === 200) {
          setClients(res.data);
        } else {
          toast.error(
            createToast("clients error", "Failed to fetch clients", "error")
          );
        }
      } catch (error) {
        toast.error(
          createToast("clients error", "Failed to fetch clients", "error")
        );
      } finally {
        setIsFetching(false);
      }
    };
    fetchClients();
  }, [isOpen]);

  useEffect(() => {
    if (clients.length > 0 && clientId) {
      const existingClient = clients.find((c) => c._id === clientId);
      if (existingClient) {
        setFormData({
          name: existingClient.name,
          phone: existingClient.phone,
          address: formatAddress(existingClient.address || ""),
          email: existingClient.email || "",
          ice: existingClient.ice || "",
        });
      }
    }
  }, [clients, clientId]);

  const validateForm = (): boolean => {
    try {
      clientSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        );
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange =
    (field: keyof ClientFormData) => (value: string | number | null) => {
      setFormData((prev) => ({ ...prev, [field]: value?.toString() || "" }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handlePhoneSelect = (selectedClient: Client | null) => {
    if (selectedClient) {
      setFormData({
        name: selectedClient.name,
        phone: selectedClient.phone,
        address: formatAddress(selectedClient.address || ""),
        email: selectedClient.email || "",
        ice: selectedClient.ice || "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    handleBack();
    setFormData({
      name: "",
      phone: "",
      address: "",
      email: "",
      ice: "",
    });
    setErrors({});
  };

  const handleBack = () => {
    setViews(TYPE_OF_ORDER_VIEW);
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!validateForm()) {
      toast.warning(
        createToast(
          "Fields required",
          "Please fill in all required fields",
          "warning"
        )
      );
      return false;
    }

    setIsLoading(true);
    try {
      const existingClient = clients.find((c) => c.phone === formData.phone);

      if (existingClient) {
        const isDataChanged =
          existingClient.name !== formData.name ||
          formatAddress(existingClient.address || "") !==
            formatAddress(formData.address || "") ||
          existingClient.email !== formData.email ||
          existingClient.ice !== formData.ice;

        if (isDataChanged) {
          await updateClient(existingClient._id, formData);
          const res = await getClients();
          if (res.status === 200) {
            setClients(res.data);
          }
        }

        dispatch(setClientId(existingClient._id));
        setViews(ORDER_SUMMARY_VIEW);

        // Show toast after state updates
        if (isDataChanged) {
          toast.info(
            createToast(
              "Client updated",
              "Client information updated successfully",
              "info"
            )
          );
        } else {
          toast.success(
            createToast(
              "Client selected",
              "Client selected successfully",
              "success"
            )
          );
        }
      } else {
        const response = await createClient(formData);
        if (response.status === 200) {
          setClients(response.data);
        }

        dispatch(setClientId(response.data.data.client._id));
        setViews(ORDER_SUMMARY_VIEW);

        // Show toast after state updates
        toast.success(
          createToast(
            "Client created",
            "Client created successfully",
            "success"
          )
        );
      }

      onSuccess?.();
      return true;
    } catch (error) {
      toast.error(
        createToast(
          "Client processing failed",
          "Failed to process client",
          "error"
        )
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clients,
    isOpen,
    setIsOpen,
    isLoading,
    isFetching,
    formData,
    setFormData,
    errors,
    handleInputChange,
    handlePhoneSelect,
    handleSubmit,
    handleClose,
  };
};
