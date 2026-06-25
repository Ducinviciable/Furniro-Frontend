import { ICustomerProfile } from "@/utils/types";
import React from "react";

interface CustomerProfileProps {
  customer: ICustomerProfile;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer }) => {
  if (!customer) return null;
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
          {initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
          <p className="text-gray-600">{customer.email}</p>
          <p className="text-gray-600">{customer.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
