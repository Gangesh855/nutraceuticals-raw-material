"use client";

import { useEffect } from "react";
import { startExperience } from "./experience";

/** Mounts the scroll scenes, particle layer and interactive widgets for the page rendered around it. */
export default function Experience() {
  useEffect(() => startExperience(), []);
  return null;
}
