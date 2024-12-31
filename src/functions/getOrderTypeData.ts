function getOrderTypeData(orderTypeId: string | null) {
  const orderTypes = JSON.parse(
    localStorage.getItem("generalData") || "[]"
  ).orderTypes;

  const orderTypeData = orderTypes.find(
    (type: any) => type._id === orderTypeId
  );
  return orderTypeData ? orderTypeData : {};
}

export default getOrderTypeData;
