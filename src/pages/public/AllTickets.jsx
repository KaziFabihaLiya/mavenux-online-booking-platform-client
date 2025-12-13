//Grid, search/filter/sort/pagination

import React, { useState } from 'react';

const AllTickets = () => {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Mock data - Replace with API call
  const allTickets = [
    {
      _id: "1",
      title: "Dhaka to Chittagong - AC Bus",
      from: "Dhaka",
      to: "Chittagong",
      transportType: "Bus",
      price: 1200,
      ticketQuantity: 40,
      departureDate: "2025-12-20",
      departureTime: "22:00",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500",
      perks: ["AC", "WiFi", "Water Bottle", "Charging Port"],
    },
    {
      _id: "2",
      title: "Dhaka to Cox's Bazar - Sleeper Coach",
      from: "Dhaka",
      to: "Cox's Bazar",
      transportType: "Bus",
      price: 1800,
      ticketQuantity: 32,
      departureDate: "2025-12-22",
      departureTime: "23:30",
      image:
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500",
      perks: ["AC", "Sleeper", "Blanket", "Pillow", "Snacks"],
    },
    {
      _id: "3",
      title: "Dhaka to Sylhet - Non-AC Bus",
      from: "Dhaka",
      to: "Sylhet",
      transportType: "Bus",
      price: 600,
      ticketQuantity: 50,
      departureDate: "2025-12-18",
      departureTime: "08:00",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500",
      perks: ["Comfortable Seat", "Water Bottle"],
    },
    {
      _id: "4",
      title: "Dhaka to Chittagong - Intercity Train",
      from: "Dhaka",
      to: "Chittagong",
      transportType: "Train",
      price: 800,
      ticketQuantity: 120,
      departureDate: "2025-12-19",
      departureTime: "07:00",
      image:
        "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500",
      perks: ["AC Chair", "Reserved Seat", "Food Court"],
    },
    {
      _id: "5",
      title: "Dhaka to Rajshahi - Express Train",
      from: "Dhaka",
      to: "Rajshahi",
      transportType: "Train",
      price: 650,
      ticketQuantity: 100,
      departureDate: "2025-12-21",
      departureTime: "15:30",
      image:
        "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500",
      perks: ["AC Cabin", "Breakfast", "WiFi"],
    },
    {
      _id: "6",
      title: "Dhaka to Barisal - Luxury Launch",
      from: "Dhaka",
      to: "Barisal",
      transportType: "Launch",
      price: 1500,
      ticketQuantity: 80,
      departureDate: "2025-12-23",
      departureTime: "20:00",
      image:
        "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=500",
      perks: ["AC Cabin", "TV", "Dinner", "Breakfast"],
    },
    {
      _id: "7",
      title: "Dhaka to Dubai - Economy Class",
      from: "Dhaka",
      to: "Dubai",
      transportType: "Plane",
      price: 35000,
      ticketQuantity: 180,
      departureDate: "2025-12-25",
      departureTime: "03:00",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500",
      perks: ["In-flight Meal", "Entertainment", "Baggage 20kg"],
    },
    {
      _id: "8",
      title: "Dhaka to Singapore - Business Class",
      from: "Dhaka",
      to: "Singapore",
      transportType: "Plane",
      price: 85000,
      ticketQuantity: 50,
      departureDate: "2025-12-26",
      departureTime: "01:30",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500",
      perks: ["Lounge Access", "Premium Meal", "Extra Baggage", "WiFi"],
    },
    {
      _id: "9",
      title: "Dhaka to Khulna - AC Bus",
      from: "Dhaka",
      to: "Khulna",
      transportType: "Bus",
      price: 900,
      ticketQuantity: 45,
      departureDate: "2025-12-24",
      departureTime: "21:00",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500",
      perks: ["AC", "WiFi", "USB Charging"],
    },
    {
      _id: "10",
      title: "Dhaka to Rangpur - Train",
      from: "Dhaka",
      to: "Rangpur",
      transportType: "Train",
      price: 750,
      ticketQuantity: 110,
      departureDate: "2025-12-20",
      departureTime: "09:00",
      image:
        "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500",
      perks: ["AC Seat", "Meal", "Reserved"],
    },
  ];

  // Filter and sort logic
  let filteredTickets = allTickets.filter((ticket) => {
    const matchesFrom =
      !searchFrom ||
      ticket.from.toLowerCase().includes(searchFrom.toLowerCase());
    const matchesTo =
      !searchTo || ticket.to.toLowerCase().includes(searchTo.toLowerCase());
    const matchesType = !filterType || ticket.transportType === filterType;
    return matchesFrom && matchesTo && matchesType;
  });

  // Sort tickets
  if (sortBy === "price-asc") {
    filteredTickets.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredTickets.sort((a, b) => b.price - a.price);
  }

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(
    startIdx,
    startIdx + itemsPerPage
  );

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
              <label className="block text-sm font-medium text-stone-700 mb-2">From</label>
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
              <label className="block text-sm font-medium text-stone-700 mb-2">To</label>
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
              <label className="block text-sm font-medium text-stone-700 mb-2">Transport Type</label>
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
              <label className="block text-sm font-medium text-stone-700 mb-2">Sort By</label>
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
                onClick={() => setCurrentPage(1)}
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
            Showing <span className="font-semibold text-stone-800">{filteredTickets.length}</span> tickets
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedTickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200 group">
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
                    <span className="text-sm font-medium">{ticket.from} → {ticket.to}</span>
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

                <div className="flex flex-wrap gap-1 mb-4">
                  {ticket.perks?.slice(0, 2).map((perk, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 px-2 py-1 rounded text-xs">
                      {perk}
                    </span>
                  ))}
                  {ticket.perks?.length > 2 && (
                    <span className="bg-stone-200 text-stone-600 px-2 py-1 rounded text-xs">
                      +{ticket.perks.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <div>
                    <p className="text-2xl font-bold text-amber-600">
                      ৳{ticket.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-stone-500">{ticket.ticketQuantity} seats</p>
                  </div>
                  
                  <button
                    onClick={() => alert(`View details: ${ticket._id}`)}
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
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-amber-500 text-white'
                    : 'border border-stone-300 hover:bg-stone-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;