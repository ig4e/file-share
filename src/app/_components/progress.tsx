"use client";
import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

function Progress() {
  return (
    <ProgressBar
      height="4px"
      color="#e11d48"
      options={{ showSpinner: true }}
      shallowRouting
    />
  );
}

export default Progress;
