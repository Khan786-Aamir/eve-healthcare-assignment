import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCentres } from '../../services/centreService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { MapPin, Building, ChevronRight, Search } from 'lucide-react';

const Centres = () => {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const data = await getCentres();
        setCentres(data);
      } catch (error) {
        console.error("Error fetching centres", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCentres();
  }, []);

  const filteredCentres = centres.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Diagnostic Centres</h1>
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by centre name or location..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredCentres.length === 0 ? (
        <EmptyState message="No diagnostic centres found." icon={Building} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCentres.map((centre) => (
            <div key={centre._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover flex flex-col">
              <div className="h-48 bg-slate-200 w-full object-cover">
                {centre.image ? (
                  <img src={centre.image} alt={centre.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                    <Building className="w-20 h-20" />
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{centre.name}</h3>
                <div className="flex items-start text-gray-500 mb-4">
                  <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{centre.location}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {centre.availableTests?.length || 0} Tests Available
                  </span>
                  <Link 
                    to={`/centres/${centre._id}`}
                    className="flex items-center text-primary font-semibold hover:text-blue-700 transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Centres;