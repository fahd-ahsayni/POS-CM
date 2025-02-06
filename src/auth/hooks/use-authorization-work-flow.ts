import { useState, useCallback } from "react";

interface UseAuthorizationWorkflowProps {
  onAuthorized?: (admin: any) => void;
  onUnauthorized?: () => void;
}

export const useAuthorizationWorkflow = ({
  onAuthorized,
  onUnauthorized,
}: UseAuthorizationWorkflowProps = {}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [admin, setAdmin] = useState<any>(null);

  const handleAuthorization = useCallback(
    (authorized: boolean, adminData: any = null) => {
      setIsAuthorized(authorized);
      if (authorized) {
        setAdmin(adminData);
        setIsDrawerOpen(false);
        setIsModalOpen(true);
        onAuthorized?.(adminData);
      } else {
        onUnauthorized?.();
      }
    },
    [onAuthorized, onUnauthorized]
  );

  const startAuthFlow = useCallback(() => {
    setIsDrawerOpen(true);
    setIsAuthorized(false);
    setAdmin(null);
  }, []);

  const resetAuthFlow = useCallback(() => {
    setIsDrawerOpen(false);
    setIsModalOpen(false);
    setIsAuthorized(false);
    setAdmin(null);
  }, []);

  return {
    isDrawerOpen,
    setIsDrawerOpen,
    isModalOpen,
    setIsModalOpen,
    isAuthorized,
    admin,
    handleAuthorization,
    startAuthFlow,
    resetAuthFlow,
  };
};
