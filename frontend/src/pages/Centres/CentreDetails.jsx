import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCentreById } from '../../services/centreService';
import Loader from '../../components/Loader';
import { MapPin, Phone, Building, Stethoscope, ArrowLeft } from 'lucide-react';

const CentreDetails = () => {
  const { id } = useParams();
  const [centre, setCentre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCentre = async () => {
      try {
        const data = await getCentreById(id);
        setCentre(data);
      } catch (error) {
        console.error("Error fetching centre details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCentre();
  }, [id]);

  if (loading) return <Loader />;
  if (!centre) return <div className="text-center py-20 text-gray-500">Centre not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/centres" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Centres
      </Link>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        <div className="h-64 sm:h-80 w-full bg-slate-200 relative">
           {centre.image ? (
            <img src={centre.image} alt={centre.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
              <Building className="w-24 h-24" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{centre.name}</h1>
            <div className="flex items-center text-gray-200 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{centre.location}</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About this centre</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{centre.description || 'Professional diagnostic centre providing high-quality medical testing and imaging services with state-of-the-art equipment.'}</p>
          
          <div className="flex gap-6">
            {centre.contact && (
              <div className="flex items-center text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                <Phone className="w-5 h-5 mr-2 text-primary" /> {centre.contact}
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-slate-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Stethoscope className="w-6 h-6 mr-3 text-primary" /> Available Tests
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centre.availableTests?.length > 0 ? (
              centre.availableTests.map((test) => (
                <div key={test._id || test} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{test.name || 'Test Name'}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{test.description || 'Comprehensive medical testing.'}</p>
                    <div className="text-2xl font-extrabold text-primary mb-6">₹{test.price || '0'}</div>
                  </div>
                  <Link
                    to={`/book/${test._id || test}/${centre._id}`}
                    className="w-full block text-center bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    Book Test
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No tests available at this centre currently.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentreDetails;