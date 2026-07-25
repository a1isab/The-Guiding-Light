"use client";

import { useEffect, useRef, useCallback } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface SiteTourProps {
  role: string[] | null;
}

const TOUR_KEY = "tour_completed";

export function SiteTour({ role }: SiteTourProps) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const getSteps = useCallback(() => {
    const primaryRole = role?.includes("admin")
      ? "admin"
      : role?.includes("teacher")
        ? "teacher"
        : "student";

    if (primaryRole === "student") {
      return [
        {
          element: undefined,
          popover: {
            title: "Welcome to The Guiding Light!",
            description: "Let us show you around.",
          },
          position: "center" as const,
        },
        {
          element: '[data-nav="featured"]',
          popover: {
            title: "Featured",
            description: "Browse verified teachers and their classes here.",
          },
          position: "bottom" as const,
        },
        {
          element: '[data-section="my-classes"]',
          popover: {
            title: "My Classes",
            description: "Join classes with your teachers.",
          },
          position: "bottom" as const,
        },
        {
          element: '[data-section="badge-grid"]',
          popover: {
            title: "Badges",
            description: "Earn badges as you complete lessons.",
          },
          position: "bottom" as const,
        },
        {
          element: '[data-section="streak"]',
          popover: {
            title: "Streak",
            description: "Keep your daily streak alive by learning every day.",
          },
          position: "bottom" as const,
        },
      ];
    }

    if (primaryRole === "teacher") {
      return [
        {
          element: undefined,
          popover: {
            title: "Teacher Dashboard",
            description: "Your teaching hub.",
          },
          position: "center" as const,
        },
        {
          element: '[data-section="classes"]',
          popover: {
            title: "Classes",
            description: "Create and manage your classes.",
          },
          position: "bottom" as const,
        },
        {
          element: '[data-action="new-class"]',
          popover: {
            title: "New Class",
            description: "Create a class and share the invite code.",
          },
          position: "bottom" as const,
        },
        {
          element: undefined,
          popover: {
            title: "Course Builder",
            description: "Build courses with sections and lessons inside each class.",
          },
          position: "center" as const,
        },
        {
          element: undefined,
          popover: {
            title: "Verification",
            description: "Get verified to reach all students on the platform.",
          },
          position: "center" as const,
        },
      ];
    }

    // admin
    return [
      {
        element: undefined,
        popover: {
          title: "Admin Overview",
          description: "Platform overview.",
        },
        position: "center" as const,
      },
      {
        element: undefined,
        popover: {
          title: "Users",
          description: "Manage user roles.",
        },
        position: "center" as const,
      },
      {
        element: undefined,
        popover: {
          title: "Verifications",
          description: "Review teacher verification applications.",
        },
        position: "center" as const,
      },
      {
        element: undefined,
        popover: {
          title: "Courses",
          description: "Manage platform courses.",
        },
        position: "center" as const,
      },
    ];
  }, [role]);

  const createDriver = useCallback(() => {
    const steps = getSteps();
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: "rgba(0, 0, 0, 0.7)",
      stagePadding: 10,
      stageRadius: 8,
      popoverClass: "night-study-popover",
      steps,
      onDestroyStarted: () => {
        driverObj.destroy();
        localStorage.setItem(TOUR_KEY, "true");
      },
    });
    return driverObj;
  }, [getSteps]);

  const startTour = useCallback(() => {
    driverRef.current?.destroy();
    const driverObj = createDriver();
    driverRef.current = driverObj;
    driverObj.drive();
  }, [createDriver]);

  // Expose startTour globally for the navbar button
  useEffect(() => {
    (window as Record<string, unknown>).__siteTourStart = startTour;
    return () => {
      delete (window as Record<string, unknown>).__siteTourStart;
    };
  }, [startTour]);

  // Auto-start tour for first-time visitors
  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (completed === "true") return;
    const timer = setTimeout(() => {
      startTour();
    }, 1000);
    return () => clearTimeout(timer);
  }, [startTour]);

  return null;
}
