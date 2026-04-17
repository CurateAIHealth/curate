import React from "react";

interface NotInterestedProps {
  data?: Array<any>;
}

const NotIntrestedTable: React.FC<NotInterestedProps> = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-sm rounded-xl border">
      <table className="min-w-full text-sm text-left">
        
        <thead className="bg-teal-800 text-white uppercase text-xs">
          <tr>
            <th className="px-4 py-3">S No</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Client Name</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Information</th>
            <th className="px-4 py-3 ">Type</th>
          </tr>
        </thead>

       
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={item._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                <td className="px-4 py-3 text-gray-700">{item.LeadDate}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {item.ClientName}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {item.ContactNumber}
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                  {item.Information||"No Information Noted"}
                </td>
                <td className="px-4 py-3 text-red-500 font-medium">
                  {item.Type}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center py-6 text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NotIntrestedTable;