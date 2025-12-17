// src/pages/public/NotFound.jsx
import { useNavigate } from "react-router";
import { Home, ArrowLeft, Search, Ticket } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated 404 */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Large 404 Text */}
            <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 leading-none select-none">
              404
            </h1>

            {/* Floating Ticket Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
              <div className="bg-white rounded-xl shadow-2xl p-6 border-4 border-amber-500">
                <Ticket className="w-16 h-16 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-stone-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-stone-600 mb-2">
              The page you're looking for seems to have taken a different route.
            </p>
            <p className="text-stone-500">
              Don't worry, we'll help you get back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-semibold transition-all hover:shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>

            <button
              onClick={() => navigate("/tickets")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all hover:shadow-md"
            >
              <Search className="w-5 h-5" />
              Browse Tickets
            </button>
          </div>

          {/* Popular Routes */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 text-center">
              Popular Routes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/tickets")}
                className="text-left px-4 py-3 bg-stone-50 hover:bg-amber-50 rounded-lg border border-stone-200 hover:border-amber-300 transition-all group"
              >
                <p className="font-semibold text-stone-800 group-hover:text-amber-600 transition-colors">
                  Dhaka → Chittagong
                </p>
                <p className="text-sm text-stone-500">Popular destination</p>
              </button>

              <button
                onClick={() => navigate("/tickets")}
                className="text-left px-4 py-3 bg-stone-50 hover:bg-amber-50 rounded-lg border border-stone-200 hover:border-amber-300 transition-all group"
              >
                <p className="font-semibold text-stone-800 group-hover:text-amber-600 transition-colors">
                  Dhaka → Cox's Bazar
                </p>
                <p className="text-sm text-stone-500">Beach paradise</p>
              </button>

              <button
                onClick={() => navigate("/tickets")}
                className="text-left px-4 py-3 bg-stone-50 hover:bg-amber-50 rounded-lg border border-stone-200 hover:border-amber-300 transition-all group"
              >
                <p className="font-semibold text-stone-800 group-hover:text-amber-600 transition-colors">
                  Dhaka → Sylhet
                </p>
                <p className="text-sm text-stone-500">Hill station</p>
              </button>

              <button
                onClick={() => navigate("/tickets")}
                className="text-left px-4 py-3 bg-stone-50 hover:bg-amber-50 rounded-lg border border-stone-200 hover:border-amber-300 transition-all group"
              >
                <p className="font-semibold text-stone-800 group-hover:text-amber-600 transition-colors">
                  Dhaka → Barisal
                </p>
                <p className="text-sm text-stone-500">River route</p>
              </button>
            </div>
          </div>
        </div>

        {/* Fun Message */}
        <p className="text-center text-stone-500 mt-8 text-sm">
          Lost? Think of it as an adventure! 🗺️✨
        </p>
      </div>
    </div>
  );
}
