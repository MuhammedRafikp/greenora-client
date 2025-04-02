import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';

interface ReviewItem {
  categoryId: string;
  name: string;
  rate: number;
  qty: number;
}

interface ReviewData {
  items: ReviewItem[];
  proofs: File[];
  notes: string;
}

interface CollectionAddress {
  name: string;
  mobile: string;
  pinCode: string;
  locality: string;
  addressLine: string;
}

interface CollectionDetails {
  _id: string;
  collectionId: string;
  type: 'waste' | 'scrap';
  status: string;
  preferredDate: string;
  preferredTime: string;
  address: CollectionAddress;
}

const Review: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from location state or session storage
  const getStateData = () => {
    if (location.state) {
      // If we have location state, save it to session storage for back navigation
      const { formData, collection } = location.state as { 
        formData: ReviewData, 
        collection: CollectionDetails 
      };

      console.log("formData", formData);
      console.log("collection", collection);
      
      // Store in session storage (stringify objects including File objects)
      sessionStorage.setItem('reviewFormData', JSON.stringify(formData));
      sessionStorage.setItem('reviewCollection', JSON.stringify(collection));
      
      // Store proof URLs separately
      if (formData.proofs && formData.proofs.length > 0) {
        const proofUrls = formData.proofs.map(file => URL.createObjectURL(file));
        sessionStorage.setItem('reviewProofUrls', JSON.stringify(proofUrls));
      }
      
      return { formData, collection };
    } else {
      // Try to get from session storage
      const storedFormData = sessionStorage.getItem('reviewFormData');
      const storedCollection = sessionStorage.getItem('reviewCollection');
      const storedProofUrls = sessionStorage.getItem('reviewProofUrls');
      
      if (!storedFormData || !storedCollection) {
        navigate('/collector/tasks');
        return null;
      }
      
      // Parse the stored data
      const formData = JSON.parse(storedFormData) as ReviewData;
      const collection = JSON.parse(storedCollection) as CollectionDetails;
      
      // Handle proof URLs (we can't restore actual File objects)
      if (storedProofUrls) {
        const proofUrls = JSON.parse(storedProofUrls) as string[];
        // Create dummy File objects with the URLs for display purposes
        formData.proofs = proofUrls.map((url, index) => {
          // This is a workaround - we're creating a dummy File object
          // that has enough properties to display in the UI
          return {
            name: `Proof ${index + 1}`,
            type: 'image/jpeg',
            url: url
          } as any;
        });
      }
      
      return { formData, collection };
    }
  };
  
  const stateData = getStateData();
  
  // If no data and redirect happened, return null
  if (!stateData) return null;
  
  const { formData, collection } = stateData;

  // Calculate total amount
  const totalAmount = formData.items.reduce((total, item) => {
    return total + (item.rate * item.qty);
  }, 0);

  const handleSubmit = async () => {
    try {
      // Navigate to the payment page with the state data
      navigate('/collector/receive-payment', { 
        state: { 
          formData,
          collection 
        } 
      });
    } catch (error) {
      toast.error('Failed to proceed to payment');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (formData && formData.items) {
      console.log("Review items:", formData.items);
      formData.items.forEach((item, index) => {
        console.log(`Item ${index}:`, item);
        console.log(`  categoryId: ${item.categoryId}`);
      });
    }
  }, [formData]);

  return (
    <div className="bg-gray-50 flex-1 overflow-x-hidden overflow-y-auto p-6">
      <div className=" mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          {/* <div className="bg-green-900 p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Review Collection Details</h1>
            <p className="text-green-100 mt-1">Please review all details before final submission</p>
          </div> */}

          <div className="p-4 sm:p-6 space-y-6">
            {/* Collection Info */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Collection Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Collection ID</p>
                  <p className="font-medium">{collection.collectionId.toLocaleUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{collection.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Date</p>
                  <p className="font-medium">{formatDate(collection.preferredDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Time</p>
                  <p className="font-medium">{collection.preferredTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{collection.status}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Collection Address</h2>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="font-medium">{collection.address.name}</p>
                <p className="text-gray-700">{collection.address.mobile}</p>
                <p className="text-gray-700">{collection.address.addressLine}</p>
                <p className="text-gray-700">{collection.address.locality}, {collection.address.pinCode}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Collection Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.qty}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{item.rate.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">₹{(item.qty * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-green-50">
                      <td colSpan={3} className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">Total Amount:</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-900">₹{totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Proofs */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Collection Proofs</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {formData.proofs.map((proof, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={(proof as any).url || URL.createObjectURL(proof)} 
                      alt={`Proof ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate rounded-b-lg">
                      {proof.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {formData.notes && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Additional Notes</h2>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">{formData.notes}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end items-center pt-4 space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Back to Edit
              </button>
              {collection.type === 'waste' ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded-lg transition-colors"
                >
                  Receive Payment
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded-lg transition-colors"
                >
                  Pay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
