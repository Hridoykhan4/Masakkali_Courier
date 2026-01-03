// Backend version
const calculateParcelCost = ({ type, weight: weightData, isSameRegion }) => {
  const weight = Number(weightData) || 0;

  const breakdown = {
    type,
    baseCost: 0,
    weightCharge: 0,
    regionCharge: 0,
    total: 0,
  };

  // ===== Document =====
  if (type === "document") {
    breakdown.baseCost = 60;
    if (!isSameRegion) breakdown.regionCharge = 20;
  }

  // ===== Non-document =====
  if (type === "non-document") {
    breakdown.baseCost = 110;

    if (weight > 3) {
      breakdown.weightCharge = (weight - 3) * 40;
    }

    if (!isSameRegion) {
      breakdown.regionCharge = 40;
    }
  }

  breakdown.total =
    breakdown.baseCost + breakdown.weightCharge + breakdown.regionCharge;

  return breakdown;
};

module.exports = calculateParcelCost;
