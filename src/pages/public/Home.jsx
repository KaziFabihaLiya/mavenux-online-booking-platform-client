//# Hero, ads/latest sections
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bus,
  Train,
  Ship,
  Plane,
  MapPin,
  Clock,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAdvertisedTickets, useLatestTickets } from "../../hooks/useTicket";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load tickets dynamically from API
  const {
    data: advertisedTickets = [],
    isLoading: advLoading,
    error: advError,
  } = useAdvertisedTickets();

  const {
    data: latestTickets = [],
    isLoading: latestLoading,
    error: latestError,
  } = useLatestTickets();

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200",
      title: "Travel Anywhere, Anytime",
      subtitle: "Book your next journey with ease",
    },
    {
      image:
        "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200",
      title: "Best Prices Guaranteed",
      subtitle: "Compare and save on every trip",
    },
    {
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200",
      title: "Secure & Trusted Platform",
      subtitle: "Your safety is our priority",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Show top-level loader when either query is loading
  const pageLoading = advLoading || latestLoading;

  useEffect(() => {
    if (advError) {
      console.error("Failed to load advertised tickets:", advError);
      toast.error("Failed to load featured tickets. Please try again later.");
    }
    if (latestError) {
      console.error("Failed to load latest tickets:", latestError);
      toast.error("Failed to load latest tickets. Please try again later.");
    }
  }, [advError, latestError]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  const getTransportIcon = (type) => {
    switch (type) {
      case "Bus":
        return <Bus className="w-5 h-5" />;
      case "Train":
        return <Train className="w-5 h-5" />;
      case "Launch":
        return <Ship className="w-5 h-5" />;
      case "Plane":
        return <Plane className="w-5 h-5" />;
      default:
        return <Bus className="w-5 h-5" />;
    }
  };

  const TicketCard = ({ ticket }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-stone-200">
      <div className="relative h-48 overflow-hidden">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          {getTransportIcon(ticket.transportType)}
          {ticket.transportType}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-stone-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {ticket.title}
        </h3>

        <div className="flex items-center gap-2 text-stone-600 mb-3">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span className="text-sm">
            {ticket.from} → {ticket.to}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3 min-h-[2.5rem]">
          {ticket.perks?.slice(0, 3).map((perk, idx) => (
            <span
              key={idx}
              className="bg-stone-100 text-stone-700 px-2 py-1 rounded text-xs"
            >
              {perk}
            </span>
          ))}
          {ticket.perks?.length > 3 && (
            <span className="bg-stone-200 text-stone-600 px-2 py-1 rounded text-xs">
              +{ticket.perks.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-200">
          <div>
            <p className="text-2xl font-bold text-amber-600">
              ৳{ticket.price.toLocaleString()}
            </p>
            <p className="text-xs text-stone-500">
              {ticket.ticketQuantity} seats left
            </p>
          </div>

          <button
            onClick={() => navigate(`/tickets/${ticket._id}`)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-1"
          >
            Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-stone-50 min-h-screen">
        {/* Hero Slider */}
        <div className="relative h-[500px] overflow-hidden">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-2xl text-stone-100">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + slides.length) % slides.length
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % slides.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? "bg-white w-8" : "bg-white/50 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Advertisement Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
              Featured Tickets
            </h2>
            <p className="text-stone-600 text-lg">
              Handpicked deals just for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisedTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        </section>

        {/* Latest Tickets Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
                Latest Tickets
              </h2>
              <p className="text-stone-600 text-lg">
                Recently added travel options
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
              Why Choose Mavenus?
            </h2>
            <p className="text-stone-600 text-lg">
              Your trusted travel companion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <Tag className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                Best Prices
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Compare prices and get the best deals on your travel
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                24/7 Support
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Our team is always here to help you with any issues
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                Wide Network
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Travel to hundreds of destinations across the country
              </p>
            </div>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Popular Routes
              </h2>
              <p className="text-amber-50 text-lg">
                Most traveled destinations
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Dhaka → Chittagong",
                "Dhaka → Sylhet",
                "Dhaka → Cox's Bazar",
                "Dhaka → Khulna",
                "Dhaka → Rajshahi",
                "Dhaka → Rangpur",
                "Dhaka → Barisal",
                "Chittagong → Cox's Bazar",
              ].map((route, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 text-center text-white font-medium cursor-pointer transition-all hover:scale-105"
                >
                  {route}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
