"use client";

import { PayoutsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchPayouts = async (token: string | null) => {
  if (!token) {
    throw new Error("No auth token available");
  }

  const response = await axios.get<PayoutsResponse>(
    `${backendUrl}/transaction/all?search=PTR&status=pending&type=debit`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("Payouts Response>>>", response.data);
  return response.data.data.transactions;
};

export const usePayouts = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // 4. Use useEffect to get the token ONLY on the client-side
  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return useQuery({
    // 5. Add token to queryKey
    queryKey: ["payouts", token],
    queryFn: () => fetchPayouts(token),
    enabled: isClient && !!token,
  });
};
