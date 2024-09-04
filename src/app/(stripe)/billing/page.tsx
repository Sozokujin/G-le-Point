"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SessionData = {
  amount_total: number;
  currency: string;
  payment_status: string;
  line_items: {
    description: string;
    price: {
      unit_amount: number;
    };
    quantity: number;
  }[];
};

const Billing = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionData = async (sessionId: string) => {
    try {
      const response = await fetch(
        `/api/get-session-details?session_id=${sessionId}`
      );
      const data = await response.json();
      setSessionData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching session data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId);
    }
  }, [sessionId]);

  if (loading) {
    return <p>Chargement des détails du paiement...</p>;
  }

  if (!sessionData) {
    return <p>Impossible de récupérer les détails du paiement.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Merci pour votre achat !</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Détails de votre commande :
        </h2>
        {sessionData.line_items.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="text-lg font-medium">{item.description}</p>
            <p>Quantité : {item.quantity}</p>
            <p>
              Prix unitaire : {(item.price.unit_amount / 100).toFixed(2)}{" "}
              {sessionData.currency.toUpperCase()}
            </p>
          </div>
        ))}

        <div className="mt-6">
          <p className="text-lg font-bold">
            Total payé : {(sessionData.amount_total / 100).toFixed(2)}{" "}
            {sessionData.currency.toUpperCase()}
          </p>
          <p>
            Statut du paiement :{" "}
            {sessionData.payment_status === "paid" ? "Réussi" : "Échoué"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-lg font-medium">
          Nous vous remercions pour votre achat. Si vous avez des questions,
          nhésitez pas à nous contacter.
        </p>
      </div>
    </div>
  );
};

export default Billing;
