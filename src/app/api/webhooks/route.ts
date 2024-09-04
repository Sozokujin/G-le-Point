import { db } from "@/services/firebase/config";
import {
  collection,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";

// Fonction pour incrémenter superMarkers en fonction de l'UID de l'utilisateur
export const incrementSuperMarkersByUid = async (userUid: string) => {
  try {
    // Référence à la collection "users"
    const usersCollectionRef = collection(db, "users");

    // Création de la requête pour trouver l'utilisateur par "uid"
    const q = query(usersCollectionRef, where("uid", "==", userUid));

    // Exécution de la requête
    const querySnapshot = await getDocs(q);

    // Vérifie si au moins un utilisateur correspond
    if (querySnapshot.empty) {
      console.log("No user found with the provided UID:", userUid);
      return new Response("User not found", { status: 404 });
    }

    // Récupère le premier document utilisateur trouvé (en supposant qu'il n'y a qu'un utilisateur avec cet UID)
    const userDoc = querySnapshot.docs[0];

    // Référence au document de l'utilisateur
    const userRef = userDoc.ref;

    // Incrémente le champ superMarkers
    await updateDoc(userRef, {
      superMarkers: increment(1), // Incrémentation de superMarkers
    });

    console.log("superMarkers incremented for user: " + userUid);
    return new Response("SuperMarkers incremented", {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating superMarkers:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

type METADATA = {
  userId: string;
  priceId: string;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const sig = headers().get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }
  const eventType = event.type;

  if (eventType == "payment_intent.payment_failed") {
    return new Response("Paiement échoué", {
      status: 400,
    });
  }

  if (eventType === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("session l33" + session.payment_status);

    // Vérifie si le paiement est bien "paid"
    if (session.payment_status !== "paid") {
      return new Response("Paiement non effectué", {
        status: 400,
      });
    }
    const data = event.data.object;
    const metadata = data.metadata as METADATA;
    const userId = metadata.userId;
    const priceId = metadata.priceId;
    const created = data.created;
    const currency = data.currency;
    const customerDetails = data.customer_details!;
    const amount = data.amount_total;
    const transactionDetails = {
      userId,
      priceId,
      created,
      currency,
      customerDetails,
      amount,
    };
    try {
      console.log("user ID l62 WEBHOOK" + userId);
      await incrementSuperMarkersByUid(userId);
      console.log("superMarkers incremented for user: " + userId);
      return new Response("Subscription added and superMarkers incremented", {
        status: 200,
      });
    } catch (error) {
      console.log("Erreur lors de l'update Firestore: " + error);
      return new Response("Server error -> FIN DE ROUTE", {
        status: 500,
      });
    }
  } else {
    console.log("Event not handled !!!!");
    return new Response("Event not handled", {
      status: 400,
    });
  }
}
