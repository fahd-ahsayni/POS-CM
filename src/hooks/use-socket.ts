import { useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

type EventCallback<D> = (data: D) => void;
type EventMap = Record<string, unknown>;

const useSocket = <T extends EventMap>(url: string, options?: any) => {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<Map<keyof T, EventCallback<any>>>(new Map());
  const wrappersRef = useRef<Map<keyof T, EventCallback<any>>>(new Map());

  // Socket initialization and cleanup
  useEffect(() => {
    socketRef.current = io(url, options);

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;

      // Cleanup all listeners
      wrappersRef.current.forEach((wrapper, event) => {
        socketRef.current?.off(event as string, wrapper);
      });
      wrappersRef.current.clear();
      handlersRef.current.clear();
    };
  }, [url, options]);

  // Stable event subscriber
  const on = useCallback(
    <K extends keyof T>(event: K, callback: EventCallback<T[K]>) => {
      handlersRef.current.set(event, callback);

      if (!wrappersRef.current.has(event)) {
        const wrapper = (data: T[K]) => {
          const currentHandler = handlersRef.current.get(event);
          currentHandler?.(data);
        };

        wrappersRef.current.set(event, wrapper);
        socketRef.current?.on(event as string, wrapper);
      }
    },
    []
  );

  // Stable event unsubscriber
  const off = useCallback(<K extends keyof T>(event: K) => {
    const wrapper = wrappersRef.current.get(event);
    if (wrapper) {
      socketRef.current?.off(event as string, wrapper);
      wrappersRef.current.delete(event);
      handlersRef.current.delete(event);
    }
  }, []);

  return {
    on,
    off,
    socket: socketRef.current,
    connected: socketRef.current?.connected ?? false,
  };
};

export default useSocket;
