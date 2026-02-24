import axios from "axios";

// API miễn phí provinces của Việt Nam
const PROVINCES_API = "https://provinces.open-api.vn/api";

// Cache để tránh gọi API nhiều lần
let provincesCache = null;
let districtsCache = {};
let wardsCache = {};

/**
 * Lấy danh sách tỉnh/thành phố
 */
export const getProvinces = async () => {
  if (provincesCache) {
    return provincesCache;
  }

  try {
    const response = await axios.get(`${PROVINCES_API}/p/`);
    provincesCache = response.data.sort((a, b) => a.name.localeCompare(b.name));
    return provincesCache;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

/**
 * Lấy danh sách quận/huyện theo tỉnh
 */
export const getDistricts = async (provinceCode) => {
  if (districtsCache[provinceCode]) {
    return districtsCache[provinceCode];
  }

  try {
    const response = await axios.get(
      `${PROVINCES_API}/p/${provinceCode}?depth=2`
    );
    const districts = response.data.districts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    districtsCache[provinceCode] = districts;
    return districts;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

/**
 * Lấy danh sách phường/xã theo quận/huyện
 */
export const getWards = async (districtCode) => {
  if (wardsCache[districtCode]) {
    return wardsCache[districtCode];
  }

  try {
    const response = await axios.get(
      `${PROVINCES_API}/d/${districtCode}?depth=2`
    );
    const wards = response.data.wards.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    wardsCache[districtCode] = wards;
    return wards;
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};

/**
 * Format địa chỉ đầy đủ
 */
export const formatFullAddress = (street, ward, district, province) => {
  const parts = [];
  if (street) parts.push(street);
  if (ward) parts.push(ward);
  if (district) parts.push(district);
  if (province) parts.push(province);
  return parts.join(", ");
};
