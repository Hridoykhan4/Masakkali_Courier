const faqData = [
  {
    id: 1,
    title: "How long does delivery usually take?",
    desc: "Inside major cities like Dhaka, delivery typically takes 24–48 hours. Nationwide deliveries usually arrive within 48–72 hours depending on the destination.",
  },
  {
    id: 2,
    title: "Do you offer Cash on Delivery (COD)?",
    desc: "Yes, we provide 100% Cash on Delivery service across Bangladesh. Collected payments are securely transferred to merchants on a regular schedule.",
  },
  {
    id: 3,
    title: "How can I track my parcel?",
    desc: "Once your parcel is booked, you will receive a tracking ID. Use this ID on our website to get real-time updates on your shipment status.",
  },
  {
    id: 4,
    title: "What items are restricted for delivery?",
    desc: "Illegal goods, fragile items without proper packaging, flammable materials, and perishable food items are not allowed for delivery.",
  },
  {
    id: 5,
    title: "What happens if a delivery fails?",
    desc: "If a delivery attempt fails, we retry based on our policy. In case of repeated failure, the parcel is returned to the sender through our return service.",
  },
  {
    id: 6,
    title: "Do you provide corporate or bulk delivery services?",
    desc: "Yes, we offer customized logistics solutions for SMEs and corporate clients, including bulk shipments, warehouse support, and dedicated account management.",
  },
];

const Faq = () => {
  return (
    <section className="mb-5 mx-4">
      <div className="flex max-w-4xl mx-auto px-4 text-center items-center gap-3 flex-col mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Frequently Asked Question (FAQ)
        </h2>
        <p className="text-base-content/70">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      {/* FAQ */}
      <div className="my-10 space-y-3">
        {faqData.map((faq) => (
          <div
            key={faq?.id}
            className="collapse collapse-arrow bg-base-100 border border-base-300"
          >
            <input
              type="radio"
              defaultChecked={faq?.id === 1}
              name="my-accordion-2"
            />
            <div className="collapse-title font-semibold">{faq?.title}</div>
            <div className="collapse-content text-sm">{faq?.desc}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
    </section>
  );
};

export default Faq;
