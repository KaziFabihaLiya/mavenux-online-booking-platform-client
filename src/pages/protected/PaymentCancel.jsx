import { XCircle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-orange-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-red-400 rounded-full blur-xl opacity-30 mx-auto" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 mb-8">
            Your payment was not completed. No charges were made to your
            account.
          </p>

          {/* Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">What happened?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You cancelled the payment process</li>
              <li>• The payment window was closed</li>
              <li>• Your booking is still pending</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/user/bookings")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to My Bookings
            </button>

            <button
              onClick={() => navigate("/tickets")}
              className="w-full border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 py-3 rounded-xl font-semibold transition-all"
            >
              Browse More Tickets
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your booking?
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="text-orange-600 hover:text-orange-700 font-semibold underline"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
