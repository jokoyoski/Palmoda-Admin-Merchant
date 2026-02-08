"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllSubscriptions } from "./subscriptions";
import { useEffect, useState } from "react";

export const useSubscriptions = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return useQuery({
    queryKey: ["subscriptions", token],
    queryFn: () => getAllSubscriptions(token),
    staleTime: 1000 * 60 * 2,
    enabled: isClient && !!token,
  });
};
