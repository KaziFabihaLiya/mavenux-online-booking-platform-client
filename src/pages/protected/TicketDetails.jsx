// src/pages/TicketDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTicket } from "../../hooks/useTicket";
import { useCreateBooking } from "../../hooks/useBookings";
import useAuth from "../../hooks/useAuth";
import {
  MapPin,
  Calendar,
  Clock,
  Bus,
  Train,
  Ship,
  Plane,
  Star,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ticket, isLoading } = useTicket(id);
  const createBooking = useCreateBooking();

  const [showModal, setShowModal] = useState(false);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState({});
  const [isExpired, setIsExpired] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!ticket?.departureDate || !ticket?.departureTime) return;

    const calculateTimeLeft = () => {
      const departureDateTime = new Date(
        `${ticket.departureDate} ${ticket.departureTime}`
      );
      const now = new Date();
      const diff = departureDateTime - now;

      if (diff <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [ticket]);

  const getTransportIcon = (type) => {
    const icons = {
      Bus: Bus,
      Train: Train,
      Launch: Ship,
      Plane: Plane,
    };
    const Icon = icons[type] || Bus;
    return <Icon className="w-6 h-6" />;
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (bookingQuantity > ticket.ticketQuantity) {
      toast.error("Not enough tickets available");
      return;
    }

    try {
      await createBooking.mutateAsync({
        ticketId: ticket._id,
        bookingQuantity: parseInt(bookingQuantity),
      });
      setShowModal(false);
      toast.success("Booking request sent! Check your dashboard.");
      navigate("/dashboard/user/bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Ticket Not Found
          </h2>
          <button
            onClick={() => navigate("/tickets")}
            className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Back to All Tickets
          </button>
        </div>
      </div>
    );
  }

  const isBookingDisabled = isExpired || ticket.ticketQuantity === 0;

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            <img
              src={ticket.image}
              alt={ticket.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
              {getTransportIcon(ticket.transportType)}
              {ticket.transportType}
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {ticket.title}
            </h1>

            {/* Route */}
            <div className="flex items-center gap-4 text-xl text-gray-600 mb-6">
              <span className="font-semibold">{ticket.from}</span>
              <MapPin className="w-6 h-6 text-amber-500" />
              <div className="flex-1 h-0.5 bg-gray-300" />
              <MapPin className="w-6 h-6 text-amber-500" />
              <span className="font-semibold">{ticket.to}</span>
            </div>

            {/* Countdown Timer */}
            {!isExpired ? (
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 mb-6">
                <p className="text-white text-center mb-4 text-lg font-semibold">
                  Time Until Departure
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="bg-white rounded-lg p-4 mb-2">
                        <p className="text-3xl font-bold text-amber-600">
                          {value}
                        </p>
                      </div>
                      <p className="text-white text-sm capitalize">{unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-6">
                <p className="text-red-700 text-center font-semibold">
                  ⚠️ This ticket has expired
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Departure Date</p>
                    <p className="font-semibold text-gray-800">
                      {ticket.departureDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Departure Time</p>
                    <p className="font-semibold text-gray-800">
                      {ticket.departureTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price per Ticket</p>
                  <p className="text-4xl font-bold text-amber-600">
                    ৳{ticket.price.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Available Seats</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {ticket.ticketQuantity} seats
                  </p>
                </div>
              </div>
            </div>

            {/* Perks */}
            {ticket.perks && ticket.perks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {ticket.perks.map((perk, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Star className="w-4 h-4 text-amber-600" />
                      <span className="text-gray-700">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vendor Info */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Vendor Information
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold">Name:</span> {ticket.vendorName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span>{" "}
                {ticket.vendorEmail}
              </p>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={isBookingDisabled}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-xl transition-colors"
            >
              {isExpired
                ? "Ticket Expired"
                : ticket.ticketQuantity === 0
                ? "Sold Out"
                : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Book Tickets</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  min="1"
                  max={ticket.ticketQuantity}
                  value={bookingQuantity}
                  onChange={(e) => setBookingQuantity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Max: {ticket.ticketQuantity} tickets
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-semibold">
                    ৳{ticket.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{bookingQuantity}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-amber-600">
                    ৳{(ticket.price * bookingQuantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={createBooking.isLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createBooking.isLoading ? "Processing..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
