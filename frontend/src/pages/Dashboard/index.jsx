import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getBookings } from '../../services/bookingService';
import { CalendarCheck, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
        
        let pending = 0, confirmed = 0, cancelled = 0;
        data.forEach(b => {
          if (b.status === 'pending') pending++;
          else if (b.status === 'confirmed') confirmed++;
          else if (b.status === 'cancelled') cancelled++;
        });
        
        setStats({ total: data.length, pending, confirmed, cancelled });
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name} 👋</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your appointments today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/centres" className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center gap-2">
            <Search className="w-5 h-5" /> Book New Test
          </Link>
          <Link to="/bookings" className="bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" /> My Bookings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 card-hover">
          <div className="bg-blue-100 p-4 rounded-xl">
            <CalendarCheck className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 card-hover">
          <div className="bg-yellow-100 p-4 rounded-xl">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 card-hover">
          <div className="bg-green-100 p-4 rounded-xl">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Confirmed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.confirmed}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 card-hover">
          <div className="bg-red-100 p-4 rounded-xl">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Cancelled</p>
            <p className="text-3xl font-bold text-gray-900">{stats.cancelled}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          <Link to="/bookings" className="text-primary text-sm font-medium hover:underline">View all</Link>
        </div>
        
        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You have no recent bookings.</p>
            <Link to="/centres" className="text-primary font-medium mt-2 inline-block hover:underline">Book a test now</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.test?.name || 'Test Name'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{booking.centre?.name || 'Centre Name'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(booking.appointmentDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{booking.appointmentTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;