let customerDisplayWindow: Window | null = null;

export const openCustomerDisplay = () => {
  // Close existing window if open
  if (customerDisplayWindow && !customerDisplayWindow.closed) {
    customerDisplayWindow.close();
  }

  // Open new window
  customerDisplayWindow = window.open(
    "/customer-display",
    "CustomerDisplay",
    "width=800,height=600"
  );
};

export const updateCustomerDisplay = (products: any[]) => {
  if (customerDisplayWindow && !customerDisplayWindow.closed) {
    customerDisplayWindow.postMessage(
      {
        type: "UPDATE_PRODUCTS",
        products,
      },
      "*"
    );
  }
};

export const isCustomerDisplayOpen = () => {
  return customerDisplayWindow && !customerDisplayWindow.closed;
};
