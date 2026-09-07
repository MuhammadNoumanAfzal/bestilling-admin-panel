import Swal from "sweetalert2";
import "./paymentConfirmation.css";

export function showPaymentConfirmation({ vendor = false } = {}) {
  const today = new Date();
  const paymentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return Swal.fire({
    title: vendor ? "Confirm vendor payout" : "Confirm customer payment",
    width: 420,
    customClass: { popup: "payment-confirmation-card" },
    showCloseButton: true,
    closeButtonAriaLabel: "Close payment confirmation",
    showCancelButton: true,
    buttonsStyling: false,
    reverseButtons: true,
    focusConfirm: false,
    confirmButtonText: vendor ? "Mark as paid" : "Mark as received",
    cancelButtonText: "Cancel",
    html: `
      <p class="payment-confirmation-hint">${vendor ? "Confirm only after sending the transfer." : "Confirm only after receiving the payment."}</p>
      <div class="payment-confirmation-fields">
        <label for="confirmation-reference">Reference <span>(optional)</span></label>
        <input id="confirmation-reference" type="text" maxlength="255" placeholder="Transfer or receipt reference" autocomplete="off" />
        ${vendor ? `<label for="confirmation-date">Transfer date</label><input id="confirmation-date" type="date" value="${paymentDate}" max="${paymentDate}" required />` : ""}
      </div>
    `,
    didOpen: () => Swal.getPopup()?.querySelector("input")?.focus(),
    preConfirm: () => {
      const popup = Swal.getPopup();
      const date = popup.querySelector("#confirmation-date");
      if (date && !date.checkValidity()) {
        Swal.showValidationMessage("Choose a valid transfer date, today or earlier.");
        return false;
      }
      return {
        reference: popup.querySelector("#confirmation-reference").value.trim(),
        note: "",
        ...(vendor ? { paymentDate: date.value } : {}),
      };
    },
  });
}
