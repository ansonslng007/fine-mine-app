import { getMe } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { clearAuthSession } from "@/lib/auth/session";
import { getAuthToken } from "@/lib/auth/token-storage";
import { useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

void SplashScreen.preventAutoHideAsync();

/**
 * Requires auth for all routes except sign-in / sign-up.
 * Sends logged-in users away from auth screens toward main tabs.
 */
export function RootAuthRedirect() {
  const segments = useSegments();
  const router = useRouter();
  const splashHidden = useRef(false);
  const validatedToken = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      let token = await getAuthToken();
      if (token && validatedToken.current !== token) {
        try {
          await getMe();
          validatedToken.current = token;
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            await clearAuthSession();
            token = null;
            validatedToken.current = null;
          }
        }
      }
      if (cancelled) {
        return;
      }

      const top = segments[0];
      const atAuthScreen =
        top === "sign-in" || top === "sign-up";

      if (!top) {
        if (!token) {
          router.replace("/sign-in");
        }
      } else if (!token && !atAuthScreen) {
        router.replace("/sign-in");
      } else if (token && atAuthScreen) {
        router.replace("/(tabs)");
      }

      if (!splashHidden.current) {
        splashHidden.current = true;
        await SplashScreen.hideAsync();
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [segments, router]);

  return null;
}
