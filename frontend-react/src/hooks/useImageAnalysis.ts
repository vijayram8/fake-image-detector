import { useCallback, useState } from "react";
import axios from "axios";
import type { ImageAnalysisResponse } from "../types/analysis";

interface UseImageAnalysis {
  analyze: (file: File) => Promise<void>;
  data?: ImageAnalysisResponse;
  isLoading: boolean;
  error?: string;
}

export function useImageAnalysis(): UseImageAnalysis {
  const [data, setData] = useState<ImageAnalysisResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const analyze = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(undefined);
    setData(undefined);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post<ImageAnalysisResponse>(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/analyze-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setData(response.data);
    } catch (err) {
      console.error("Analysis failed:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.data?.error || err.response.statusText}`);
        } else if (err.request) {
          setError("Cannot reach server. Is the backend running on port 5000?");
        } else {
          setError(`Request error: ${err.message}`);
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to analyze image");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyze, data, isLoading, error };
}
