/**
 * Định dạng tiền tệ Việt Nam (VNĐ).
 * @param {number} value - Số tiền
 * @returns {string} Ví dụ: "1.234.567 ₫"
 */
export function formatVND(value) {
  if (value == null || value === '' || isNaN(Number(value))) return '0 ₫';
  const num = Number(value);
  return `${num.toLocaleString('vi-VN')} ₫`;
}

/**
 * Định dạng giá trị giảm giá (phần trăm hoặc số tiền) cho khuyến mãi.
 * @param {{ discountType: string, discountValue: number }} promotion
 * @returns {string} Ví dụ: "10%" hoặc "50.000 ₫"
 */
export function formatDiscount(promotion) {
  if (!promotion) return '';
  const value = Number(promotion.discountValue);
  if (promotion.discountType === 'PERCENTAGE') {
    return `${value.toLocaleString('vi-VN')}%`;
  }
  return formatVND(value);
}
