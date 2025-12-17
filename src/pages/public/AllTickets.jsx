// src/pages/public/AllTickets.jsx - UPDATED WITH REACT QUERY
import {
  ArrowRight,
  Bus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  Plane,
  Search,
  Ship,
  Train,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useTickets } from "../../hooks/useTicket";

const AllTickets = () => {
  const navigate = useNavigate();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch tickets with React Query
  const { data, isLoading, error } = useTickets({
    from: searchFrom,
    to: searchTo,
    transportType: filterType,
    sortBy: sortBy,
    page: currentPage,
    limit: 9,
  });

  const tickets = data?.data || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-stone-800 mb-2">
            Failed to load tickets
          </h3>
          <p className="text-stone-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">All Tickets</h1>
          <p className="text-amber-50">Find your perfect journey</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* From Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Dhaka"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* To Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Chittagong"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Transport Type Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Transport Type
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none bg-white"
                >
                  <option value="">All Types</option>
                  <option value="Bus">Bus</option>
                  <option value="Train">Train</option>
                  <option value="Launch">Launch</option>
                  <option value="Plane">Plane</option>
                </select>
              </div>
            </div>

            {/* Sort By Price */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none bg-white"
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-600">
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-stone-800">
                  {pagination.total}
                </span>{" "}
                tickets
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-stone-600">Loading tickets...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tickets.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">
              No Tickets Found
            </h3>
            <p className="text-stone-600 mb-6">
              Try adjusting your search criteria
            </p>
          </div>
        )}

        {/* Tickets Grid */}
        {!isLoading && tickets.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200 group"
                >
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
                    <h3 className="font-bold text-lg text-stone-800 mb-3 line-clamp-2">
                      {ticket.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-stone-600">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">
                          {ticket.from} → {ticket.to}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-600">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span className="text-sm">{ticket.departureDate}</span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-600">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-sm">{ticket.departureTime}</span>
                      </div>
                    </div>

                    {ticket.perks && ticket.perks.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {ticket.perks.slice(0, 2).map((perk, idx) => (
                          <span
                            key={idx}
                            className="bg-stone-100 text-stone-700 px-2 py-1 rounded text-xs"
                          >
                            {perk}
                          </span>
                        ))}
                        {ticket.perks.length > 2 && (
                          <span className="bg-stone-200 text-stone-600 px-2 py-1 rounded text-xs">
                            +{ticket.perks.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                      <div>
                        <p className="text-2xl font-bold text-amber-600">
                          ৳{ticket.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-stone-500">
                          {ticket.ticketQuantity} seats
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/tickets/${ticket._id}`)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-amber-500 text-white"
                          : "border border-stone-300 hover:bg-stone-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={currentPage === pagination.pages}
                  className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
