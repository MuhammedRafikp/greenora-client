import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAddresses, getDistricts, getServiceAreas, checkPinCode, addAddress, deleteAddress, updateAddress } from '../../../services/userService';
import { toast } from 'react-hot-toast';
import { validateAddressForm, validatePinCodeInput, IAddressFormErrors, validateMobileInput } from '../../../utils/validations';
import { MapPin, Pencil, Trash2, LocateFixed } from "lucide-react"
import axios from 'axios';
import Modal from '../../common/Modal';
import { useDispatch } from 'react-redux';
import { setStep, setAddress } from '../../../redux/pickupSlice';
interface IDistrict {
  _id: string;
  name: string;
}

interface IServiceArea {
  _id: string;
  name: string;
}

interface IAddresses {
  _id: string;
  name: string;
  mobile: string;
  district: string;
  serviceArea: string;
  pinCode: string;
  locality: string;
  addressLine: string;
}

interface IAddressFormData {
  name: string;
  mobile: string;
  districtId: string;
  serviceAreaId: string;
  addressLine: string;
  pinCode: string;
  locality: string;
}

const AddressSelection = () => {
  // const { requestId } = useParams();
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [serviceAreas, setServiceAreas] = useState<IServiceArea[]>([]);
  const [addresses, setAddresses] = useState<IAddresses[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState ('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddressFormData>({
    name: '',
    mobile: '',
    districtId: '',
    serviceAreaId: '',
    addressLine: '',
    pinCode: '',
    locality: ''
  });
  const [errors, setErrors] = useState<IAddressFormErrors>({
    name: '',
    mobile: '',
    districtId: '',
    serviceAreaId: '',
    pinCode: '',
    locality: '',
    addressLine: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<IAddresses | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const serviceAreas = [
  //   { id: 1, name: 'Area 1' },
  //   { id: 2, name: 'Area 2' },
  //   { id: 3, name: 'Area 3' },
  //   { id: 4, name: 'Area 4' },
  // ];

  // const existingAddresses = [
  //   { id: 1, address: "123 Main St, Apt 4B, New York, NY 10001" },
  //   { id: 2, address: "456 Park Ave, Suite 201, New York, NY 10002" },
  // ];

  // fetch addresses
  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await getAddresses();
      console.log("response :", response);
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  // fetch districts
  const fetchDistricts = async () => {
    setIsLoading(true);
    try {
      const response = await getDistricts();
      console.log("response :", response);
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  // fetch service areas
  const fetchServiceAreas = async (districtId: string) => {
    setIsLoading(true);
    try {
      const response = await getServiceAreas(districtId);
      console.log("response :", response);
      if (response.success) {
        setServiceAreas(response.data);
      }
    } catch (error) {
      console.error('Error fetching service areas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle address select
  const handleAddressSelect = (address: IAddresses) => {
    setSelectedAddress(address._id);
    dispatch(setAddress({ address }));
    console.log("selectedAddress :", selectedAddress);
  };

  // handle district change
  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setNewAddress({
      ...newAddress,
      districtId,
      serviceAreaId: '',
    });
    setErrors({ ...errors, districtId: '' });

    if (districtId) {
      fetchServiceAreas(districtId);
    } else {
      setServiceAreas([]); 
    }
  };

  // handle service area change
  const handleServiceAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceAreaId = e.target.value;
    setNewAddress({
      ...newAddress,
      serviceAreaId,
    });
    setErrors({ ...errors, serviceAreaId: '' });
  };

  // handle pin code change
  const handlePinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pinCode = e.target.value;
    if (validatePinCodeInput(pinCode)) {
      setNewAddress({ ...newAddress, pinCode });
      setErrors({ ...errors, pinCode: '' });
    } else {
      setErrors({ ...errors, pinCode: 'Pin code must be 6 digits' });
    }
  };

  // handle mobile change
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mobile = e.target.value;
    if (validateMobileInput(mobile)) {
      setNewAddress({ ...newAddress, mobile });
      setErrors({ ...errors, mobile: '' });
    } else {
      setErrors({ ...errors, mobile: 'Mobile number must be 10 digits' });
    }
  };

  // handle new address submit
  const handleNewAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateAddressForm(newAddress);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // check pin code availability
    try {
      const pinCodeResponse = await checkPinCode(newAddress.serviceAreaId, newAddress.pinCode);
      console.log("pinCodeResponse :", pinCodeResponse);
      if (!pinCodeResponse.success) {
        setErrors({ ...errors, pinCode: "Service is not available in this area." });
        return;
      }

      // add new address
      setIsLoading(true);
      const response = await addAddress(newAddress);
      console.log("response :", response);
      if (response.success) {
        fetchAddresses();
        setShowNewAddress(false);
        toast.success('Address added');

        setNewAddress({
          name: '',
          mobile: '',
          districtId: '',
          serviceAreaId: '',
          addressLine: '',
          pinCode: '',
          locality: ''
        });
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  // handle edit address
  const handleEditAddress = (e: React.MouseEvent, address: IAddresses) => {
    e.stopPropagation();
    setAddressToEdit(address);
    console.log("addressToEdit :", addressToEdit);
    setNewAddress({
      name: address.name,
      mobile: address.mobile,
      districtId: address.district,
      serviceAreaId: address.serviceArea,
      addressLine: address.addressLine,
      pinCode: address.pinCode,
      locality: address.locality
    });
    setShowEditModal(true);
  };

  const handleDeleteAddress = (e: React.MouseEvent, addressId: string) => {
    e.stopPropagation();
    setAddressToDelete(addressId);
    console.log("addressToDelete :", addressToDelete);
    setShowDeleteModal(true);
  };

  // handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteAddress(addressToDelete);
      if (response.success) {
        toast.success('Address deleted');
        fetchAddresses();
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  // handle get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(
            `https://api.locationiq.com/v1/reverse`, {
            params: {
              key: 'pk.99d62c10fe5ff3c54c5d6e83671878ec',
              lat: latitude,
              lon: longitude,
              format: 'json',
              'accept-language': 'en'
            }
          });
          console.log("response :", response);
          if (response.data) {
            const { address } = response.data;
            setNewAddress(prev => ({
              ...prev,
              pinCode: address.postcode || '',
              locality: address.village || '',
            }));
            setShowNewAddress(true);
          }
        } catch (error) {
          console.error('Error fetching location details:', error);
          toast.error('Failed to get location details');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Please allow location access');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('An unknown error occurred');
        }
      }
    );
  };

  // handle confirm edit
  const handleConfirmEdit = async () => {
    const { isValid, errors: validationErrors } = validateAddressForm(newAddress);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const pinCodeResponse = await checkPinCode(newAddress.serviceAreaId, newAddress.pinCode);
      if (!pinCodeResponse.success) {
        setErrors({ ...errors, pinCode: "Service is not available in this area." });
        return;
      }

      setIsLoading(true);
      const response = await updateAddress(addressToEdit?._id as string, newAddress);
      console.log("response :", response);
      if (response.success) {
        fetchAddresses();
        setShowEditModal(false);
        toast.success('Address updated successfully');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    dispatch(setStep({ step: 3 }));
    navigate('/pickup/details');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select Pickup Address
        </h3>

        <div className="space-y-4">
          {addresses.length > 0 ? addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => !isLoading && handleAddressSelect(addr)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddress === addr._id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-200"
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-normal text-gray-800">{addr.name}</p>
                    <p className="text-sm text-gray-600">
                      {addr.addressLine}, {addr.locality}, {addr.district}
                    </p>
                    <p className="text-sm text-gray-600">
                      PIN: {addr.pinCode}, Mobile: {addr.mobile}
                    </p>
                    <p className="text-sm text-gray-600">Service Area: {addr.serviceArea}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <button
                    onClick={(e) => handleEditAddress(e, addr)}
                    className="p-1 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit address"
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteAddress(e, addr._id)}
                    className="p-1 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          )) : <div className="text-center text-gray-500">No Saved Addresses.</div>}

          <div className="mt-6">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="text-green-600 text-sm font-medium hover:text-green-700"
              >
                + Add New Address
              </button>
            </div>

            {showNewAddress && (
              <div className="flex justify-end mt-2 ">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-blue-600 text-sm font-medium bg-blue-100 p-2 rounded-lg hover:text-blue-700"
                >
                  <LocateFixed className="h-4 w-4" />
                  Use my current location
                </button>
              </div>
            )}

            {showNewAddress && (
              <form onSubmit={handleNewAddressSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newAddress.name}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, name: e.target.value });
                        setErrors({ ...errors, name: '' });
                      }}
                      className={`w-full p-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                      placeholder="Enter name"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={newAddress.mobile}
                      onChange={handleMobileChange}
                      className={`w-full p-2.5 border ${errors.mobile ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                      placeholder="Enter 10-digit mobile number"

                    />
                    {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <select
                      value={newAddress.districtId}
                      onChange={handleDistrictChange}
                      className={`w-full p-2.5 border ${errors.districtId ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}

                    >
                      <option value="" className='text-gray-400' disabled selected>--Select a district--</option>
                      {districts.map((district) => (
                        <option key={district._id} value={district._id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {errors.districtId && <p className="mt-1 text-xs text-red-500">{errors.districtId}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Service Area
                    </label>
                    <select
                      value={newAddress.serviceAreaId}
                      onChange={handleServiceAreaChange}
                      className={`w-full p-2.5 border ${errors.serviceAreaId ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                      disabled={!newAddress.districtId}
                    >
                      <option value="" className='text-gray-400' disabled selected>--Select a service area--</option>
                      {serviceAreas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    {errors.serviceAreaId && <p className="mt-1 text-xs text-red-500">{errors.serviceAreaId}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      value={newAddress.pinCode}
                      onChange={handlePinCodeChange}
                      className={`w-full p-2.5 border ${errors.pinCode ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                      placeholder="Enter pin code"
                    />
                    {errors.pinCode && <p className="mt-1 text-xs text-red-500">{errors.pinCode}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Locality
                    </label>
                    <input
                      type="text"
                      value={newAddress.locality}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, locality: e.target.value });
                        setErrors({ ...errors, locality: '' });
                      }}
                      className={`w-full p-2.5 border ${errors.locality ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                      placeholder="Enter locality"
                    />
                    {errors.locality && <p className="mt-1 text-xs text-red-500">{errors.locality}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Address Line
                  </label>
                  <input
                    type="text"
                    value={newAddress.addressLine}
                    onChange={(e) => {
                      setNewAddress({ ...newAddress, addressLine: e.target.value });
                      setErrors({ ...errors, addressLine: '' });
                    }}
                    className={`w-full p-2.5 border ${errors.addressLine ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                    placeholder="Enter complete address"
                  />
                  {errors.addressLine && <p className="mt-1 text-xs text-red-500">{errors.addressLine}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-sm font-medium
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Save Address
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            dispatch(setStep({ step: 1 }));
            navigate('/pickup')
          }}
          className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => handleContinue()}
          disabled={!selectedAddress || isLoading}
          className={`w-1/2 bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-sm font-medium
            ${(!selectedAddress || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Continue
        </button>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setErrors({
            name: '',
            mobile: '',
            districtId: '',
            serviceAreaId: '',
            pinCode: '',
            locality: '',
            addressLine: ''
          });
        }}
        title="Edit Address"
        description="Update your address details below"
        confirmLabel="Save Changes"
        onConfirm={handleConfirmEdit}
        confirmButtonClass="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
      >
        <form className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newAddress.name}
                onChange={(e) => {
                  setNewAddress({ ...newAddress, name: e.target.value });
                  setErrors({ ...errors, name: '' });
                }}
                className={`w-full p-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                placeholder="Enter name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={newAddress.mobile}
                onChange={handleMobileChange}
                className={`w-full p-2.5 border ${errors.mobile ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                placeholder="Enter 10-digit mobile number"

              />
              {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                District
              </label>
              <select
                value={newAddress.districtId}
                onChange={handleDistrictChange}
                className={`w-full p-2.5 border ${errors.districtId ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}

              >
                <option value="" className='text-gray-400' disabled selected>--Select a district--</option>
                {districts.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>
              {errors.districtId && <p className="mt-1 text-xs text-red-500">{errors.districtId}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Service Area
              </label>
              <select
                value={newAddress.serviceAreaId}
                onChange={handleServiceAreaChange}
                className={`w-full p-2.5 border ${errors.serviceAreaId ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                disabled={!newAddress.districtId}
              >
                <option value="" className='text-gray-400' disabled selected>--Select a service area--</option>
                {serviceAreas.map((area) => (
                  <option key={area._id} value={area._id}>
                    {area.name}
                  </option>
                ))}
              </select>
              {errors.serviceAreaId && <p className="mt-1 text-xs text-red-500">{errors.serviceAreaId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Pin Code
              </label>
              <input
                type="text"
                value={newAddress.pinCode}
                onChange={handlePinCodeChange}
                className={`w-full p-2.5 border ${errors.pinCode ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                placeholder="Enter pin code"
              />
              {errors.pinCode && <p className="mt-1 text-xs text-red-500">{errors.pinCode}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Locality
              </label>
              <input
                type="text"
                value={newAddress.locality}
                onChange={(e) => {
                  setNewAddress({ ...newAddress, locality: e.target.value });
                  setErrors({ ...errors, locality: '' });
                }}
                className={`w-full p-2.5 border ${errors.locality ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                placeholder="Enter locality"
              />
              {errors.locality && <p className="mt-1 text-xs text-red-500">{errors.locality}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Address Line
            </label>
            <input
              type="text"
              value={newAddress.addressLine}
              onChange={(e) => {
                setNewAddress({ ...newAddress, addressLine: e.target.value });
                setErrors({ ...errors, addressLine: '' });
              }}
              className={`w-full p-2.5 border ${errors.addressLine ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
              placeholder="Enter complete address"
            />
            {errors.addressLine && <p className="mt-1 text-xs text-red-500">{errors.addressLine}</p>}
          </div>
        </form>

      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        confirmButtonClass="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default AddressSelection;