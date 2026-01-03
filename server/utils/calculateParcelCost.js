const calculateParcelCost = ({ type, weight, isSameRegion }) => {
  let totalCost = 0;
  if (type === "document") {
    totalCost = isSameRegion ? 60 : 80;
  } else {
    if (weight <= 3) {
      totalCost = isSameRegion ? 110 : 150;
    } else {
      const extraKg = weight - 3;
      const extraCost = extraKg * 40;
      totalCost = isSameRegion ? extraCost + 110 : 150 + extraCost + 40;
    }
  }

  return totalCost;
};

module.exports = calculateParcelCost;
