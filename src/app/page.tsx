"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { APP_NAME, Tool } from "@/constants";
import { fetchInstalledTools } from "@/features/tools/services/toolServices";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
      try {
        const data = await fetchInstalledTools();
        setTools(data);
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  return (
    <div className="bg-gray-50">
      <Header heading={APP_NAME} />
      <section className="min-h-screen bg-gray-50 pt-16 text-black px-4">
        <section className="flex flex-col pb-10">
          <div className="max-w-screen md:h-[40vh] h-[30vh] flex flex-col items-center justify-center shadow-md my-6 rounded">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
              Welcome to ToolNest
            </h1>
            <p className="text-lg text-center text-gray-600 mb-10 max-w-xl">
              Your centralized hub for powerful productivity tools. Select a tool to get started.
            </p>
          </div>
          <h2 className="my-5 mx-2 font-bold text-xl">Tools</h2>
          {loading ? (
            <p className="text-gray-500">Loading tools...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {tools.map((tool, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                      {tool.title[0]}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold">{tool.title}</h3>
                  </div>
                  {/* Description label */}
                  <p className="text-sm text-gray-500">Features</p>

                  {/* Features List */}
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {tool.description?.map((desc: string, i: number) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>

                  {/* Optional dropdown button */}
                  <div className="mt-auto flex justify-end">
                    <Link href={`verify-otp?next=${tool.base_route}`}>
                      <button className="text-sm text-purple-600 flex items-center hover:underline mt-2 cursor-pointer">
                        Explore <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <footer className="w-full py-2 bg-gray-50 text-black shadow border-t flex items-center py-10 px-5 justify-center">
          <h1 className="tittle font-bold text-md w-full">ToolNest - Created by <span className="text-purple-600">Jatin Vishwakarma</span></h1>
        </footer>
      </section>
    </div>
  );
}
