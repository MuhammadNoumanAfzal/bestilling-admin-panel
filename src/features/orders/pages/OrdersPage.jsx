import PlaceholderPage from "../../shared/components/PlaceholderPage.jsx";

export default function OrdersPage() {
  return (
    <PlaceholderPage
      bullets={[
        "Open orders and priority issues can sit here later.",
        "Status filters can be added without changing the shell.",
        "The page is already wired into the admin router.",
      ]}
      description="This section is reserved for operational order management, issue handling, and queue monitoring."
      title="Order management"
    />
  );
}
