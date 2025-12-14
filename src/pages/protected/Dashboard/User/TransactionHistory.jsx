import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Download,
  Search,
} from "lucide-react";
import moment from "moment";

// EXPLANATION:
// This component fetches and displays all Stripe payment transactions
// Shows: Transaction ID, Amount, Ticket Title, Payment Date
// Includes search and filter functionality
// Table format with responsive design

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Get user from AuthContext
  // const { user } = useContext(AuthContext);
  const userId = "user001"; // Replace with user.uid from Firebase

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      // FETCH FROM YOUR BACKEND API
      // const response = await fetch(`/api/transactions/user/${userId}`);
      // const data = await response.json();
      // setTransactions(data.data);

      // Mock data for demonstration
      const mockTransactions = [
        {
          _id: "txn001",
          transactionId: "txn_1234567890abcdef",
          ticketTitle: "Dhaka to Chittagong - Intercity Train",
          amount: 800,
          paymentDate: "2025-12-11T16:30:00",
          paymentMethod: "card",
          status: "completed",
        },
        {
          _id: "txn002",
          transactionId: "txn_9876543210fedcba",
          ticketTitle: "Dhaka to Chittagong - AC Bus",
          amount: 1200,
          paymentDate: "2025-12-12T10:15:00",
          paymentMethod: "card",
          status: "completed",
        },
        {
          _id: "txn003",
          transactionId: "txn_abcd1234efgh5678",
          ticketTitle: "Dhaka to Sylhet - Non-AC Bus",
          amount: 1800,
          paymentDate: "2025-12-13T14:20:00",
          paymentMethod: "card",
          status: "completed",
        },
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.ticketTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total spent
  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Transactions */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm">Total Transactions</p>
            <CreditCard className="w-8 h-8 text-blue-100" />
          </div>
          <p className="text-4xl font-bold mb-1">{transactions.length}</p>
          <p className="text-blue-100 text-xs">All time</p>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 text-sm">Total Spent</p>
            <Calendar className="w-8 h-8 text-green-100" />
          </div>
          <p className="text-4xl font-bold mb-1">
            ৳{totalSpent.toLocaleString()}
          </p>
          <p className="text-green-100 text-xs">All time</p>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-amber-100 text-sm">Success Rate</p>
            <CheckCircle className="w-8 h-8 text-amber-100" />
          </div>
          <p className="text-4xl font-bold mb-1">100%</p>
          <p className="text-amber-100 text-xs">Completed payments</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                Payment History
              </h2>
              <p className="text-stone-600">All your successful transactions</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">
              {searchTerm ? "No results found" : "No Transactions Yet"}
            </h3>
            <p className="text-stone-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Your payment history will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Ticket Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    {/* Transaction ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-stone-400" />
                        <code className="text-sm font-mono text-stone-700">
                          {transaction.transactionId}
                        </code>
                      </div>
                    </td>

                    {/* Ticket Title */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-800">
                        {transaction.ticketTitle}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-green-600">
                        ৳{transaction.amount.toLocaleString()}
                      </p>
                    </td>

                    {/* Payment Date */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-stone-600">
                        <p className="font-medium">
                          {moment(transaction.paymentDate).format(
                            "MMM DD, YYYY"
                          )}
                        </p>
                        <p className="text-xs text-stone-500">
                          {moment(transaction.paymentDate).format("hh:mm A")}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with Export Option */}
        {filteredTransactions.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-600">
                Showing {filteredTransactions.length} of {transactions.length}{" "}
                transactions
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View Cards (Alternative to table on small screens) */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="bg-white rounded-xl shadow-md p-5 border border-stone-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                <CheckCircle className="w-3 h-3" />
                Completed
              </span>
              <p className="text-xl font-bold text-green-600">
                ৳{transaction.amount.toLocaleString()}
              </p>
            </div>

            <h3 className="font-semibold text-stone-800 mb-2">
              {transaction.ticketTitle}
            </h3>

            <div className="space-y-1 text-sm text-stone-600">
              <p>
                <span className="font-medium">Transaction ID:</span>{" "}
                <code className="text-xs">{transaction.transactionId}</code>
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {moment(transaction.paymentDate).format("MMM DD, YYYY hh:mm A")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
===========================================
INTEGRATION GUIDE
===========================================

1. Import and use in DashboardLayout:
   import TransactionHistory from './TransactionHistory';
   
   case 'transactions':
     return <TransactionHistory />;

2. Fetch from your backend:
   const response = await fetch(`/api/transactions/user/${userId}`);
   const data = await response.json();
   setTransactions(data.data);

3. Backend endpoint (already created):
   GET /api/transactions/user/:userId
   Returns: Array of transaction objects

4. Export CSV functionality (optional):
   const exportCSV = () => {
     const csv = transactions.map(t => 
       `${t.transactionId},${t.ticketTitle},${t.amount},${t.paymentDate}`
     ).join('\n');
     
     const blob = new Blob([csv], { type: 'text/csv' });
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'transactions.csv';
     a.click();
   };

5. TanStack Query version (optional, explained later):
   const { data, isLoading } = useQuery({
     queryKey: ['transactions', userId],
     queryFn: () => fetch(`/api/transactions/user/${userId}`).then(r => r.json())
   });
*/
