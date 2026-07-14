import { useMemo } from "react";
import { useParams } from "react-router-dom";

// Detail Section Components
import CustomerDetailHeader from "../components/details/CustomerDetailHeader.jsx";
import CustomerProfileInfoCard from "../components/details/CustomerProfileInfoCard.jsx";
import CustomerOrderHistoryCard from "../components/details/CustomerOrderHistoryCard.jsx";
import CustomerReviewsCard from "../components/details/CustomerReviewsCard.jsx";
import CustomerSupportInteractionsCard from "../components/details/CustomerSupportInteractionsCard.jsx";
import CustomerDangerZoneCard from "../components/details/CustomerDangerZoneCard.jsx";

// Data Source
import { customerRows } from "../data/customersData.js";

// Mock customer details details
const mockOrders = [
  {
    id: "#12549",
    vendor: "Sushico Gourmet",
    eventType: "Board Meeting",
    guests: 45,
    dateTime: "20 April 2026 12:30 PM",
    amount: "NOK 450.00",
    amountValue: 450.00,
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "Sushico Gourmet",
    eventType: "Corporate Lunch",
    guests: 48,
    dateTime: "20 April 2026 12:30 PM",
    amount: "NOK 1,200.00",
    amountValue: 1200.00,
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "FreshBites Catering",
    eventType: "Board Meeting",
    guests: 20,
    dateTime: "20 April 2026 12:30 PM",
    amount: "NOK 890.00",
    amountValue: 890.00,
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "Sushico Gourmet",
    eventType: "Corporate Lunch",
    guests: 50,
    dateTime: "20 April 2026 12:30 PM",
    amount: "NOK 1,200.00",
    amountValue: 1200.00,
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "FreshBites Catering",
    eventType: "Board Meeting",
    guests: 30,
    dateTime: "20 April 2026 12:30 PM",
    amount: "NOK 890.00",
    amountValue: 890.00,
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "Sushico Gourmet",
    eventType: "Corporate Lunch",
    guests: 10,
    dateTime: "20 April 2026 12:30 PM",
    amount: "NOK 1,200.00",
    amountValue: 1200.00,
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "FreshBites Catering",
    eventType: "Family Dinner",
    guests: 15,
    dateTime: "20 April 2026 12:30 PM",
    amount: "NOK 890.00",
    amountValue: 890.00,
    status: "Delivered",
  },
  {
    id: "#12549",
    vendor: "Sushico Gourmet",
    eventType: "Corporate Lunch",
    guests: 10,
    dateTime: "20 April 2026 12:30 PM",
    amount: "NOK 1,200.00",
    amountValue: 1200.00,
    status: "Canceled",
  },
];

const mockReviews = [
  {
    id: 1,
    name: "Alexander Wright",
    rating: 5,
    orderRef: "#ORD-8829",
    content: "Always on time and the presentation is impeccable. Our clients were very impressed with the gluten-free options!",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    rating: 2,
    orderRef: "#ORD-8712",
    content: "Food was cold when it arrived. The delivery driver seemed lost.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 3,
    name: "Marcus Thorne",
    rating: 4,
    orderRef: "#ORD-8655",
    content: "Excellent service. The sushi was extremely fresh and well-prepared. Will order again.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
];

const mockTickets = [
  {
    id: "#TKT-1022",
    subject: "Account Login Issues",
    status: "Resolved",
    createdDate: "Today, 09:12 AM",
  },
  {
    id: "#TKT-0812",
    subject: "Incomplete delivery - missing drinks",
    status: "Resolved",
    createdDate: "Today, 09:12 AM",
  },
  {
    id: "#TKT-0955",
    subject: "Invoice Discrepancy ORD-9921",
    status: "Open",
    createdDate: "Sep 05, 2024",
  },
];

export default function CustomerDetailPage() {
  const { customerId } = useParams();

  const customer = useMemo(() => {
    return (
      customerRows.find(
        (c) => c.id.replace("#", "") === customerId || c.id === customerId
      ) || customerRows[0]
    );
  }, [customerId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Detail Header Info */}
      <CustomerDetailHeader customer={customer} />

      {/* 2. Profile Details Card */}
      <CustomerProfileInfoCard customer={customer} />

      {/* 3. Order History with metrics and table lists */}
      <CustomerOrderHistoryCard ordersData={mockOrders} />

      {/* 4. Customer Reviews Section */}
      <CustomerReviewsCard reviewsData={mockReviews} />

      {/* 5. Support interactions */}
      <CustomerSupportInteractionsCard ticketsData={mockTickets} />

      {/* 6. Admin actions Danger Zone */}
      <CustomerDangerZoneCard customerName={customer.name} />
    </div>
  );
}
