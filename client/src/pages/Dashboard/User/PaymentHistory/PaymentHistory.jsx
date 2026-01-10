import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import usePaymentHistory from "../../../../hooks/usePaymentHistory";

const PaymentHistory = () => {
  const {
    data: payments = [],
    isPending,
    isError,
    error,
  } = usePaymentHistory();

  console.log(payments);

  if (isPending || isError)
    return (
      <ErrorLoadingState
        error={error}
        isError={isError}
        isPending={isPending}
      ></ErrorLoadingState>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Payment History</h2>

      <div className="overflow-x-auto rounded-xl bg-base-100 shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Parcel ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Transaction</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 opacity-70">
                  No payment history found
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>

                  <td>
                    {new Date(payment.paidAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="font-mono text-xs">{payment.parcelId}</td>

                  <td className="font-semibold text-primary">
                    ৳ {payment.amount}
                  </td>

                  <td className="capitalize">
                    {payment.paymentMethod?.[0] || "card"}
                  </td>

                  <td className="font-mono text-xs ">
                    {payment.transactionId.slice(0, 8)}...
                    {payment.transactionId.slice(-4)}
                  </td>

                  <td>
                    <span className="badge badge-success badge-outline">
                      Paid
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
