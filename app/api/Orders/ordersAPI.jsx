import { fetchAuthSession } from "aws-amplify/auth";

const getOrders = async () => {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  try {
    if (!idToken) {
      throw new Error("User is not authenticated — ID token missing");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}orders`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data.orders);
    return data.orders;
  } catch (error) {
    console.log(error);
  }
};

const postOrder = async (
  cart,
  subtotal,
  deliveryFee,
  estimatedDelivery,
  total
) => {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  if (!idToken) {
    throw new Error("User is not authenticated — ID token missing");
  }

  const request = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}orders`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        cart,
        subtotal,
        deliveryFee,
        estimatedDelivery,
        total,
      }),
    }
  );
  const response = await request.json();
  return response;
};

const deleteOrder = async (order) => {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  if (!idToken) {
    throw new Error("User is not authenticated — ID token missing");
  }
  const orderStatus = await fetch(`${process.env.API_GATEWAY_URL}orders`, {
    credentials: "include",
    header: {
      Authorization: `Bearer ${idToken}`,
      "content-type": "application/json",
    },
    body: {
      order_id: order.order_id,
    },
  });

  return orderStatus;
};

export { deleteOrder, getOrders, postOrder };
