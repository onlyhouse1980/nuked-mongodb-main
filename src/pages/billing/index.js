import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Droplets, TrendingUp, Calendar } from 'lucide-react';

// Fetch customer data by last name
const fetchCustomerData = async (lastName) => {
  const response = await fetch('/api/spreadsheet/fetch');
  if (!response.ok) {
    throw new Error('Failed to fetch customer data');
  }
  const allData = await response.json();
  
  // Find the customer by last_name
  const customerRecord = allData.find(
    record => record.last_name && record.last_name.toLowerCase() === lastName.toLowerCase()
  );
  
  if (!customerRecord) {
    throw new Error(`No customer found with last name: ${lastName}`);
  }
  
  return customerRecord;
};

const calculateBill = (currentReading, previousReading) => {
  const usage = currentReading - previousReading;
  
  if (usage <= 6000) {
    return 0;
  }
  
  const overageGallons = usage - 6000;
  return overageGallons * 0.00025; // 0.025 cents = $0.00025
};

const parseDate = (fieldName) => {
  // Extract: jun01_25 -> month: "jun", day: "01", year: "25"
  const month = fieldName.substring(0, 3);
  const day = fieldName.substring(3, 5);
  const year = fieldName.substring(6, 8);
  
  const monthMap = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };
  
  const fullYear = `20${year}`;
  const monthNum = monthMap[month.toLowerCase()];
  
  return { 
    month, 
    day, 
    year: fullYear,
    display: `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${fullYear}`,
    sortDate: new Date(`${fullYear}-${monthNum}-${day}`)
  };
};

export default function BillingDashboard() {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastName, setLastName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');

  const loadData = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomerData(name);
      
      // Filter to only last 2 years of data
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      
      const filteredData = { 
        last_name: data.last_name,
        meter_serialNum: data.meter_serialNum 
      };
      
      Object.keys(data).forEach(key => {
        if (key !== 'last_name' && key !== 'meter_serialNum') {
          const dateInfo = parseDate(key);
          if (dateInfo.sortDate >= twoYearsAgo) {
            filteredData[key] = data[key];
          }
        }
      });
      
      setCustomerData(filteredData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (lastName.trim()) {
      setSearchLastName(lastName);
      loadData(lastName.trim());
    }
  };

  if (loading && searchLastName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading billing information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Billing Lookup</h1>
          <form onSubmit={handleSearch}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              View Billing
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Extract readings from customer data (exclude last_name and meter_serialNum)
  const readings = [];
  Object.keys(customerData).forEach(key => {
    if (key !== 'last_name' && key !== 'meter_serialNum') {
      const dateInfo = parseDate(key);
      readings.push({
        field: key,
        date: dateInfo.display,
        reading: customerData[key],
        sortDate: dateInfo.sortDate
      });
    }
  });

  // Sort by date
  readings.sort((a, b) => a.sortDate - b.sortDate);

  // Calculate all billing metrics from the readings
  const billingPeriods = [];
  let totalBilled = 0;
  
  for (let i = 1; i < readings.length; i++) {
    const usage = readings[i].reading - readings[i - 1].reading;
    const amount = calculateBill(readings[i].reading, readings[i - 1].reading);
    totalBilled += amount;
    
    billingPeriods.push({
      period: `${readings[i - 1].date} - ${readings[i].date}`,
      previousReading: readings[i - 1].reading,
      currentReading: readings[i].reading,
      usage,
      amount,
      reading: readings[i].reading
    });
  }

  const latestBill = billingPeriods.length > 0 ? billingPeriods[billingPeriods.length - 1] : null;
  const totalUsage = readings.length > 1 ? readings[readings.length - 1].reading - readings[0].reading : 0;
  const averageUsagePerPeriod = billingPeriods.length > 0 
    ? totalUsage / billingPeriods.length 
    : 0;

  // Chart data
 const chartData = billingPeriods.map(period => ({
  date: period.period.split(' - ')[1], // use the END of the billing period
  usage: period.usage
}));


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Customer Billing Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Account: {customerData.last_name}
            </p>
            <p className="text-sm text-gray-500">
              Meter: {customerData.meter_serialNum}
            </p>
          </div>
          <button
            onClick={() => {
              setCustomerData(null);
              setLastName('');
              setSearchLastName('');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            New Search
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Latest Bill</p>
                <p className="text-3xl font-bold text-gray-800">
                  ${latestBill ? latestBill.amount.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Latest Usage</p>
                <p className="text-3xl font-bold text-gray-800">
                  {latestBill ? latestBill.usage.toLocaleString() : '0'}
                </p>
                <p className="text-xs text-gray-500">gallons</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Droplets className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Usage - last 2 years</p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalUsage.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">gallons</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Billed</p>
                <p className="text-3xl font-bold text-gray-800">
                  ${totalBilled.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">all periods</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        

        {/* Billing Details Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Billing History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous Reading
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Reading
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage (Gallons)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingPeriods
  .slice()       // make a shallow copy to avoid mutating original
  .reverse()     // reverse the copy
  .map((period, idx) => (
    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {period.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {period.previousReading.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {period.currentReading.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {period.usage.toLocaleString()}
                      {period.usage > 6000 && (
                        <span className="ml-2 text-xs text-orange-600 font-medium">
                          ({(period.usage - 6000).toLocaleString()} over limit)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${period.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Meter Reading History
          </h2>
         <ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line 
      type="monotone" 
      dataKey="usage" 
      stroke="#3b82f6" 
      strokeWidth={2}
      dot={{ fill: '#3b82f6', r: 5 }}
    />
  </LineChart>
</ResponsiveContainer>

        </div>

        {/* Pricing Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Pricing:</strong> First 6,000 gallons per billing period are included. 
            Usage over 6,000 gallons is billed at $0.025 per gallon (0.025¢/gal).
          </p>
        </div>
      </div>
    </div>
  );
}