//Table toggle (max 6)

// src/pages/protected/Dashboard/Admin/AdvertiseTickets.jsx
import { useState } from "react";
import {
  Eye,
  EyeOff,
  MapPin,
  DollarSign,
  Calendar,
  Loader2,
  AlertCircle,
  Star,
} from "lucide-react";
import { useAdminTickets, useToggleAdvertisement } from "../../../../hooks/useAdmin";
import moment from "moment";
import toast from "react-hot-toast";

export default function AdvertiseTickets() {
  const { data: tickets, isLoading } = useAdminTickets();
  const toggleAdvertisement = useToggleAdvertisement();

  // Filter only approved tickets
  const approvedTickets = tickets?.filter((t) => t.status === "approved") || [];
  const advertisedTickets = approvedTickets.filter((t) => t.isAdvertised);

  const handleToggle = async (ticketId, currentStatus) => {
    // Check if trying to advertise and already at limit
    if (!currentStatus && advertisedTickets.length >= 6) {
      toast.error("Maximum 6 tickets can be advertised at a time!");
      return;
    }

    try {
      await toggleAdvertisement.mutateAsync({
        ticketId,
        isAdvertised: !currentStatus,
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              Advertise Tickets
            </h2>
            <p className="text-stone-600">
              Select up to 6 tickets to feature on the homepage
            </p>
          </div>

          {/* Counter */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center min-w-[120px]">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-5 h-5 text-amber-600" />
              <span className="text-3xl font-bold text-amber-600">
                {advertisedTickets.length}
              </span>
              <span className="text-stone-500">/</span>
              <span className="text-2xl text-stone-600">6</span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Advertised Tickets
            </p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800 mb-1">How it works:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Toggle the switch to advertise/un-advertise a ticket</li>
            <li>• Maximum 6 tickets can be advertised at once</li>
            <li>• Advertised tickets appear in a special section on homepage</li>
            <li>• Only approved tickets can be advertised</li>
          </ul>
        </div>
      </div>

      {/* Tickets Grid */}
      {approvedTickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Star className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-600 mb-2">
            No Approved Tickets
          </h3>
          <p className="text-stone-500">
            Approved tickets will appear here for advertising
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedTickets.map((ticket) => (
            <div
              key={ticket._id}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all hover:shadow-lg ${
                ticket.isAdvertised
                  ? "border-amber-500 ring-2 ring-amber-200"
                  : "border-stone-200"
              }`}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-48 object-cover"
                />
                {ticket.isAdvertised && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    FEATURED
                  </div>
                )}
                {/* Transport Type Badge */}
                <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-stone-700">
                  {ticket.transportType}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-stone-800 mb-3 line-clamp-1">
                  {ticket.title}
                </h3>

                {/* Route */}
                <div className="flex items-center gap-2 text-sm text-stone-600 mb-3">
                  <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="truncate">
                    {ticket.from} → {ticket.to}
                  </span>
                </div>

                {/* Departure */}
                <div className="flex items-center gap-2 text-sm text-stone-600 mb-3">
                  <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    {moment(ticket.departureDate).format("MMM DD, YYYY")} at{" "}
                    {ticket.departureTime}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1 text-xl font-bold text-green-600 mb-4">
                  <DollarSign className="w-5 h-5" />
                  ৳{ticket.price}
                  <span className="text-sm text-stone-500 font-normal ml-1">
                    / seat
                  </span>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggle(ticket._id, ticket.isAdvertised)}
                  disabled={
                    toggleAdvertisement.isPending ||
                    (!ticket.isAdvertised && advertisedTickets.length >= 6)
                  }
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    ticket.isAdvertised
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  }`}
                >
                  {toggleAdvertisement.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : ticket.isAdvertised ? (
                    <>
                      <EyeOff className="w-5 h-5" />
                      Remove from Featured
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      Add to Featured
                    </>
                  )}
                </button>

                {!ticket.isAdvertised && advertisedTickets.length >= 6 && (
                  <p className="text-xs text-red-600 text-center mt-2">
                    Remove a featured ticket first
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}