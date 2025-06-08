"use client";

import {
  EventTypeMap,
  RealtimeConnection,
  RealtimeRequest,
} from "@/utils/realtime-client";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface RealtimeContextType {
  realtimeClient: RealtimeConnection;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

// Provider component
interface RealtimeProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  token?: string;
}

export const realtimeClient = new RealtimeConnection(
  process.env.NEXT_PUBLIC_WS_URL as string,
);

export const RealtimeProvider: FC<RealtimeProviderProps> = ({
  token,
  children,
}) => {
  useEffect(() => {
    realtimeClient.connect();
    realtimeClient.sendMessage({ t: "AUTH", token: token || "no_auth" });
    return () => realtimeClient.disconnect();
  }, [token]);

  const value = useMemo(
    () => ({
      realtimeClient: realtimeClient,
    }),
    [],
  );

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export function useRealtimeClient() {
  return useRealtimeContext().realtimeClient;
}

// Base hook to access the context
export const useRealtimeContext = () => {
  const context = useContext(RealtimeContext);

  if (!context) {
    throw new Error(
      "useRealtimeContext must be used within a RealtimeProvider",
    );
  }

  return context;
};

// Hook to send messages
export const useSendRealtimeMessage = () => {
  const { realtimeClient } = useRealtimeContext();

  return useCallback(
    (message: RealtimeRequest) => {
      realtimeClient.sendMessage(message);
    },
    [realtimeClient],
  );
};

export function useRealtimeEvent<K extends keyof EventTypeMap>(
  eventName: K,
  callback: (event: EventTypeMap[K]) => void,
  filter?: (d: EventTypeMap[K]) => boolean,
) {
  const { realtimeClient } = useRealtimeContext();
  const wrapperCb = useCallback(
    (event: EventTypeMap[K]) => {
      if (filter && filter(event)) {
        callback(event);
        return;
      }
      callback(event);
    },
    [callback, filter],
  );

  useEffect(() => {
    realtimeClient.on(eventName, wrapperCb);

    return () => {
      realtimeClient.off(eventName, wrapperCb);
    };
  }, [realtimeClient, eventName, wrapperCb]);
}

// Hook to get latest data from a specific event
export function useRealtimeData<K extends keyof EventTypeMap>(
  eventName: K,
  filter?: (d: EventTypeMap[K]) => boolean,
) {
  const [data, setData] = useState<EventTypeMap[K] | null>(null);
  useRealtimeEvent(eventName, setData, filter);
  return data;
}
