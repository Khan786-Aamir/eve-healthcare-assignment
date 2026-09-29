import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Stethoscope, Clock, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 flex flex-col items-start space-y-6">
            <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
              Advanced Healthcare Solutions
            </span>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Your Health, <br/> Our Priority
            </h1>
            <p className="text-xl text-gray-600">
              Book diagnostic tests seamlessly with EVE Healthcare. Experience fast, reliable, and secure medical bookings from the comfort of your home.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/signup" className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/30">
                Get Started
              </Link>
              <Link to="/centres" className="bg-white text-primary border border-primary/20 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all font-semibold shadow-sm">
                View Centres
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Healthcare professionals" className="rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EVE Health?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide a seamless and secure platform for all your diagnostic needs, ensuring quality service every time.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow card-hover border border-slate-100">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Fast Bookings</h3>
              <p className="text-gray-600">Book your tests in less than a minute. Save time and avoid long queues.</p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow card-hover border border-slate-100">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Verified Centres</h3>
              <p className="text-gray-600">All our diagnostic centres are verified and follow strict quality standards.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow card-hover border border-slate-100">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <HeartPulse className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Reliable Results</h3>
              <p className="text-gray-600">Get accurate results quickly. Your health data is always kept secure.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;