const calculateParcelCost = ({ type, weight: weightData, isSameRegion }) => {
  const weight = parseFloat(weightData) || 0;

  let breakdown = {
    type,
    baseCost: 0,
    weightCharge: 0,
    regionCharge: 0,
    total: 0,
  };

  // ===== Document =====
  if (type === "document") {
    breakdown.baseCost = isSameRegion ? 60 : 80;
  }

  // ===== Non-document =====
  if (type === "non-document") {
    breakdown.baseCost = isSameRegion ? 110 : 150;

    if (weight > 3) {
      const extraKg = weight - 3;
      breakdown.weightCharge = extraKg * 40;
    }

    if (!isSameRegion) {
      breakdown.regionCharge = 40;
    }
  }

  breakdown.total =
    breakdown.baseCost + breakdown.weightCharge + breakdown.regionCharge;

  return breakdown;
};

export default calculateParcelCost;
