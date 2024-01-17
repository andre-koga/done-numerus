"use client";

import moment from "moment";
import ToolForm from "./ToolForm";
import { ToolFormData, ToolNode } from "@/app/lib/types";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ToolWrapper({
  title,
  info,
  updatedAt,
  formData,
  toolNode,
}: {
  title: string;
  info?: string;
  updatedAt?: string;
  formData: ToolFormData;
  toolNode: ToolNode;
}) {
  const searchParams = useSearchParams();

  const startValues = Array(formData.inputTypes.length).fill(0);

  searchParams
    .get(formData.shortName)
    ?.split(",")
    .map((text, i) => (startValues[i] = BigInt(text)));

  const [values, setValues] = useState<BigInt[]>(startValues);

  return (
    <>
      <section className="rounded bg-darky p-2 pt-1 sm:p-4 sm:pt-3">
        <div className="items-center justify-between sm:flex">
          <h2 className="text-lg uppercase">{title}</h2>
          {updatedAt && (
            <p className="hidden text-xs lowercase italic text-mid sm:mb-1 sm:block">
              updated {moment(updatedAt, "YYYYMMDD").fromNow()}
            </p>
          )}
        </div>
        <p className="text-justify text-sm italic text-lighty">{info}</p>
        <div className="mt-4">{toolNode(values)}</div>
        <ToolForm
          shortName={formData.shortName}
          inputTypes={formData.inputTypes}
          inputs={values}
          setInputs={setValues}
        />
      </section>
      <Script
        id="MathJax-script"
        async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
      />
    </>
  );
}
