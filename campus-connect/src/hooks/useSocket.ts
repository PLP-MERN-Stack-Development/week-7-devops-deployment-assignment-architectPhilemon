import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { supabase } from '../lib/supabase';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        socketRef.current = io('http://localhost:3001', {
          auth: {
            token: session.access_token
          }
        });

        socketRef.current.on('connect', () => {
          console.log('Connected to server');
        });

        socketRef.current.on('disconnect', () => {
          console.log('Disconnected from server');
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('Connection error:', error);
        });
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};