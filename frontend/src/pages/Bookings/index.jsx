import React, { useEffect, useState } from 'react';
import { getBookings, cancelBooking } from '../../services/bookingService';
import { processPayment } from '../../services/paymentService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';
import { CalendarCheck, MapPin, Clock, CreditCard, X, Loader2 } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    setProcessingId(id);
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to cancel booking.");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePay = async (id, amount) => {
    setProcessingId(id);
    try {
      await processPayment({ bookingId: id, amount });
      toast.success("Payment successful!");
      fetchBookings();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <EmptyState message="You haven't made any bookings yet." icon={CalendarCheck} />
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row card-hover">
              <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{booking.test?.name || 'Test Name'}</h3>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{booking.centre?.name || 'Centre Name'} - <span className="text-sm">{booking.centre?.location}</span></span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarCheck className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{new Date(booking.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{booking.appointmentTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:w-1/3 bg-slate-50 flex flex-col justify-center items-center text-center">
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-primary mb-6">₹{booking.amount}</p>
                
                <div className="w-full space-y-3">
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handlePay(booking._id, booking.amount)}
                      disabled={processingId === booking._id}
                      className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm disabled:opacity-70"
                    >
                      {processingId === booking._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-4 h-4 mr-2" /> Pay Now</>}
                    </button>
                  )}
                  
                  {booking.status !== 'cancelled' && (
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      disabled={processingId === booking._id}
                      className="w-full flex items-center justify-center bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-medium shadow-sm disabled:opacity-70"
                    >
                      {processingId === booking._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><X className="w-4 h-4 mr-2" /> Cancel Booking</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;