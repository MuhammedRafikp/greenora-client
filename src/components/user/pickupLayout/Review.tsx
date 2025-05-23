import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { MapPin, Package } from 'lucide-react';
import { getDistrictAndServiceArea } from '../../../services/locationService';
import { getCategories, calculatePickupCost } from "../../../services/collectionService";
import { setStep, setCost } from '../../../redux/pickupSlice';
import { ApiResponse } from '../../../types/common';
import { IDistrict, IServiceArea } from '../../../types/location';
import { ICollection, IItem, ICategory } from '../../../types/collection';


interface IAreaNames {
  district: string;
  serviceArea: string;
}

const Review = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pickupRequest = useSelector((state: any) => state.pickup.pickupRequest);
  const pickupType = pickupRequest.type;
  const address = pickupRequest.address;
  const details: { items: IItem[], preferredDate: string, instructions: string } = pickupRequest.details;
  const districtId = pickupRequest.district;
  const serviceAreaId = pickupRequest.serviceArea;

  console.log("details", details);

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [areaNames, setAreaNames] = useState<IAreaNames>({
    district: '',
    serviceArea: ''
  });

  const [collectionData, setCollectionData] = useState<Partial<ICollection>>({
    "type": pickupType,
    "districtId": districtId,
    "serviceAreaId": serviceAreaId,
    "address": address,
    "items": details.items,
    "estimatedCost": 0,
    "preferredDate": details.preferredDate,
    "instructions": details.instructions
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res: ApiResponse<ICategory[]> = await getCategories(pickupType);
      console.log("categories :", res);
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCost = async () => {
    try {
      setIsLoading(true);
      console.log("request.items :", collectionData.items);
      const response = await calculatePickupCost(collectionData.items as IItem[]);
      console.log("pickup cost response :", response);
      if (response.success) {
        setCollectionData({ ...collectionData, estimatedCost: response.data });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to calculate pickup cost');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCost();
  }, [collectionData.items]);

  const fetchDistrictAndServiceArea = async () => {
    try {
      const res: ApiResponse<IDistrict & IServiceArea> = await getDistrictAndServiceArea(districtId, serviceAreaId);
      console.log("response :", res)
      if (res.success) {
        setAreaNames({
          district: res.data.name,
          serviceArea: res.data.name
        });
      }
    } catch (error) {
      console.error('Error fetching area names:', error);
    }
  };

  useEffect(() => {
    fetchDistrictAndServiceArea();
  }, [pickupRequest.district, pickupRequest.serviceArea]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleBack = () => {
    dispatch(setStep({ step: 3 }));
    navigate('/pickup/details');
  }

  const handleConfirm = async () => {
    dispatch(setCost({ cost: collectionData.estimatedCost as number }));
    dispatch(setStep({ step: 5 }));
    navigate('/pickup/payment', {
      state: {
        collectionData
      }
    });
  };


  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Review Your Request
        </h3>

        <div className="space-y-6">
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <MapPin className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="text-base font-medium text-gray-700">Pickup Address</p>
              <div className="mt-1 space-y-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                <p className="text-sm text-gray-800 mt-1 font-semibold">{address.name}</p>
                <p className="text-sm text-gray-600 mt-1">{address.addressLine}, {address.locality}</p>
                <p className="text-sm text-gray-600 mt-1">PIN : {address.pinCode}, Mobile : {address.mobile}</p>
                <p className="text-sm text-gray-600 mt-1">District : {areaNames.district}</p>
                <p className="text-sm text-gray-600 mt-1">Service Area : {areaNames.serviceArea}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <Package className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="text-base font-medium text-gray-700">Pickup Details</p>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-800 font-semibold capitalize">Type : {pickupType}</p>
                <p className="text-sm font-medium text-gray-600">Items :</p>
                <ul className="ml-4">
                  {details.items.map((item: any, index: number) => (
                    <li key={index} className="text-sm bg-green-100 px-3 py-1.5 rounded-lg mt-1">
                      {getCategoryName(item.categoryId)} - {item.qty} {pickupType === 'waste' ? 'bags' : 'kg'} ( ₹{item.qty * item.rate} )
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-gray-600">Preferred Date : {collectionData.preferredDate}</p>
                {collectionData.instructions && (
                  <p className="text-sm text-gray-600">
                    Instructions : {collectionData.instructions}
                  </p>
                )}
              </div>
            </div>
          </div>


          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-700">Estimated Total Cost</p>
              <p className="text-lg font-semibold text-gray-900">
                ₹{collectionData.estimatedCost}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Advance Amount</p>
              <p className="text-lg font-semibold text-green-600">
                ₹50
              </p>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-700">
                Only advance payment is required now. Final payment will be calculated based on actual weight/quantity after pickup.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-md font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className={`w-1/2 bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-md font-medium
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Make advance Payment
        </button>
      </div>
    </div>
  );
};

export default Review; 