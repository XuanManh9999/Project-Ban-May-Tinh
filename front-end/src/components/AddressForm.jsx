import React, { useState, useEffect } from 'react';
import { getProvinces, getDistricts, getWards, formatFullAddress } from '../services/vietnamProvinces';
import { FaMapMarkerAlt } from 'react-icons/fa';

const AddressForm = ({ value, onChange, error }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });

  const [addressData, setAddressData] = useState({
    province: value?.province || '',
    provinceCode: value?.provinceCode || '',
    district: value?.district || '',
    districtCode: value?.districtCode || '',
    ward: value?.ward || '',
    wardCode: value?.wardCode || '',
    street: value?.street || '',
  });

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (addressData.provinceCode) {
      loadDistricts(addressData.provinceCode);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [addressData.provinceCode]);

  // Load wards when district changes
  useEffect(() => {
    if (addressData.districtCode) {
      loadWards(addressData.districtCode);
    } else {
      setWards([]);
    }
  }, [addressData.districtCode]);

  // Notify parent when address changes
  useEffect(() => {
    const fullAddress = formatFullAddress(
      addressData.street,
      addressData.ward,
      addressData.district,
      addressData.province
    );
    onChange({
      ...addressData,
      fullAddress,
    });
  }, [addressData]);

  const loadProvinces = async () => {
    try {
      setLoading(prev => ({ ...prev, provinces: true }));
      const data = await getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Error loading provinces:', error);
    } finally {
      setLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const loadDistricts = async (provinceCode) => {
    try {
      setLoading(prev => ({ ...prev, districts: true }));
      const data = await getDistricts(provinceCode);
      setDistricts(data);
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const loadWards = async (districtCode) => {
    try {
      setLoading(prev => ({ ...prev, wards: true }));
      const data = await getWards(districtCode);
      setWards(data);
    } catch (error) {
      console.error('Error loading wards:', error);
    } finally {
      setLoading(prev => ({ ...prev, wards: false }));
    }
  };

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const province = provinces.find(p => p.code.toString() === code);
    setAddressData({
      ...addressData,
      province: province ? province.name : '',
      provinceCode: code,
      district: '',
      districtCode: '',
      ward: '',
      wardCode: '',
    });
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const district = districts.find(d => d.code.toString() === code);
    setAddressData({
      ...addressData,
      district: district ? district.name : '',
      districtCode: code,
      ward: '',
      wardCode: '',
    });
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    const ward = wards.find(w => w.code.toString() === code);
    setAddressData({
      ...addressData,
      ward: ward ? ward.name : '',
      wardCode: code,
    });
  };

  const handleStreetChange = (e) => {
    setAddressData({
      ...addressData,
      street: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <FaMapMarkerAlt className="text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-800">Địa chỉ giao hàng</h3>
      </div>

      {/* Street/Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Số nhà, tên đường <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={addressData.street}
          onChange={handleStreetChange}
          placeholder="Ví dụ: 123 Lê Lợi"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
      </div>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỉnh/Thành phố <span className="text-red-500">*</span>
        </label>
        <select
          value={addressData.provinceCode}
          onChange={handleProvinceChange}
          disabled={loading.provinces}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
          required
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quận/Huyện <span className="text-red-500">*</span>
        </label>
        <select
          value={addressData.districtCode}
          onChange={handleDistrictChange}
          disabled={!addressData.provinceCode || loading.districts}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
          required
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ward */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phường/Xã <span className="text-red-500">*</span>
        </label>
        <select
          value={addressData.wardCode}
          onChange={handleWardChange}
          disabled={!addressData.districtCode || loading.wards}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
          required
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preview full address */}
      {addressData.province && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Địa chỉ đầy đủ:</p>
          <p className="text-sm font-medium text-gray-800">
            {formatFullAddress(
              addressData.street,
              addressData.ward,
              addressData.district,
              addressData.province
            )}
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default AddressForm;

