import { createClient } from "@supabase/supabase-js";
import config from "../utils/config";

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: (...args) => {
        // Set default timeout for all requests
        const controller = new AbortController();
        const { signal } = controller;

        const timeoutId = setTimeout(
          () => controller.abort(),
          config.apiTimeout
        );

        return fetch(...args, { signal }).finally(() =>
          clearTimeout(timeoutId)
        );
      },
    },
  }
);
