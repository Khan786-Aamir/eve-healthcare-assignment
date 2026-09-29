import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCentreById } from '../../services/centreService';
import { createBooking } from '../../services/bookingService';
import { processPayment } from '../../services/paymentService';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, CreditCard, Loader2 } from 'lucide-react';

const BookingForm = () => {
  const { testId, centreId } = useParams();
  const navigate = useNavigate();
  
  const [centre, setCentre] = useState(null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '10:00 AM'
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centreData = await getCentreById(centreId);
        setCentre(centreData);
        // Find the specific test
        const testData = centreData.availableTests?.find(t => (t._id || t) === testId);
        setTest(testData);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [centreId, testId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appointmentDate) {
      toast.error('Please select an appointment date');
      return;
    }
    
    setSubmitting(true);
    try {
      const bookingData = {
        centreId,
        testId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        amount: test?.price || 0
      };
      
      const newBooking = await createBooking(bookingData);
      toast.success('Booking created successfully! Redirecting to payment...');
      
      // Simulate payment delay
      setPaymentProcessing(true);
      
      try {
        await processPayment({ bookingId: newBooking._id, amount: newBooking.amount });
        toast.success('Payment successful!');
        navigate('/bookings');
      } catch (paymentErr) {
        toast.error('Payment failed. You can pay later from your bookings.');
        navigate('/bookings');
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!centre || !test) return <div className="text-center py-20">Data not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-primary p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Complete Your Booking</h1>
          <p className="opacity-90 mt-1">Review details and confirm appointment</p>
        </div>
        
        <div className="p-8">
          <div className="bg-blue-50/50 p-6 rounded-2xl mb-8 border border-blue-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-blue-200 pb-2">Booking Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Test</p>
                  <p className="font-semibold text-gray-900">{test.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium">Amount</p>
                  <p className="text-xl font-bold text-primary">₹{test.price}</p>
                </div>
              </div>
              <div className="flex items-start mt-4 pt-4 border-t border-blue-100">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="font-semibold text-gray-900">{centre.name}</p>
                  <p className="text-sm text-gray-500">{centre.location}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-primary" /> Appointment Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-primary" /> Preferred Time
                </label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting || paymentProcessing}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {paymentProcessing ? (
                  <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing Payment...</>
                ) : submitting ? (
                  <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Confirming...</>
                ) : (
                  <><CreditCard className="w-5 h-5 mr-2" /> Confirm & Pay ₹{test.price}</>
                )}
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">By proceeding, you agree to our terms and conditions. Secure payment processing.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;