export const getAllVariants = (): any[] => {
  const generalData = localStorage.getItem("generalData");
  if (!generalData) {
    return [];
  }

  const parsedData = JSON.parse(generalData);
  const categories = parsedData?.categories || [];

  const getVariants = (cats: any[]): any[] => {
    if (!Array.isArray(cats)) {
      return [];
    }

    let variants: any[] = [];

    cats.forEach((category) => {
      // Get variants from current category's products
      if (category?.products?.length) {
        category.products.forEach((product: any) => {
          if (product?.variants?.length) {
            variants = [...variants, ...product.variants];
          }
        });
      }

      // Get variants from child categories
      if (category?.children?.length) {
        variants = [...variants, ...getVariants(category.children)];
      }
    });

    return variants;
  };

  return getVariants(categories);
};
