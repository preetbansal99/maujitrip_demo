import LegalPage from "@/components/LegalPage";

export default function UserAgreementPage() {
  return (
    <LegalPage
      title="User Agreement"
      intro="Understand how your payments and data are protected on MaujiTrip.com."
    >
      <p>
        All payments on MaujiTrip.com are secure. Our website uses{" "}
        <strong>128-bit Secure Socket Layer (SSL) encryption</strong> provided by Network
        Solution. Visa and Mastercard payments are processed through an online payment gateway
        system.
      </p>
      <p>
        You need not worry about your card information — your bank will authorize the card
        transaction directly without any information passing through us.
      </p>
      <p>We do not capture any credit or debit card data on our site.</p>
      <p>
        The client is taken to the acquiring bank&apos;s payment gateway for completion of
        every transaction. Credit and debit card information is not stored in any retrieval or
        storage system of MaujiTrip.com.
      </p>
      <p>
        The merchant shall not be liable for any failure by the customer or third party making
        payment of fees to properly protect data from being seen on their screen by other
        persons, or otherwise obtained by such persons, during the online payment process.
        This also applies to any omission to provide accurate information in the course of
        the online payment process.
      </p>
      <p>
        MaujiTrip.com is committed to protecting your financial data. Our payment
        infrastructure ensures your transactions are safe, encrypted, and never stored on our
        servers.
      </p>
    </LegalPage>
  );
}
