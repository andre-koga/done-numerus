"use client";

import React, { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import { ToolNode } from "@/app/lib/types";

declare global {
  interface Window {
    MathJax: any;
  }
}

const PrimeFactorization: ToolNode = (values) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [factors, setFactors] = useState<{ [key: string]: number }>({});

  const addNewFactor = useCallback((n: string) => {
    setFactors((prevFactors) => {
      const newFactors = { ...prevFactors };
      if (newFactors[n]) newFactors[n]++;
      else newFactors[n] = 1;
      return newFactors;
    });
  }, []);

  useEffect(() => {
    const worker = new Worker("./primeFactorizationWorker.js");

    worker.onmessage = (event) => {
      if (event.data === -1) {
        setIsCalculating(false);
      } else {
        addNewFactor(event.data.toString());
      }
    };

    setFactors({});
    worker.postMessage(values[0]);
    setIsCalculating(true);

    return () => {
      worker.terminate();
    };
  }, [values, addNewFactor]);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [factors]);

  return (
    <div className="rounded-full border border-mid">
      {isCalculating && (
        <p className="my-4 text-center italic text-lighty">
          {Object.entries(factors)
            .map((factor) => factor[0] + "^" + factor[1] + "")
            .join(" * ")}
          ...
        </p>
      )}
      {!isCalculating && (
        <p>
          $$
          {Object.entries(factors)
            .map(
              (factor) =>
                factor[0] + (factor[1] > 1 ? "^{" + factor[1] + "}" : ""),
            )
            .join("\\cdot")}
          $$
        </p>
      )}
      <p className="my-4 text-center text-sm">
        {Object.entries(factors).length} distinct prime factors
      </p>
    </div>
  );
};

export default PrimeFactorization;
