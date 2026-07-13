import PlaceholderPage from "../../shared/components/PlaceholderPage.jsx";

export default function PayoutsPage() {
  return (
    <PlaceholderPage
      bullets={[
        "Settlement batches can be reviewed here later.",
        "Hold states, pending releases, and audit notes belong in this route.",
        "The local admin shell already handles the route switch.",
      ]}
      description="Monitor releases, approvals, and payment batches for vendors."
      title="Payout center"
    />
  );
}
