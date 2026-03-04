import { useCallback, useState } from "react";
import axios from "axios";
import type { ImageAnalysisResponse } from "../types/analysis";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

interface UseImageAnalysis {
  analyze: (file: File) => Promise<void>;
  data?: ImageAnalysisResponse;
  isLoading: boolean;
  error?: string;
  progress?: string;
}

export function useImageAnalysis(): UseImageAnalysis {
  const [data, setData] = useState<ImageAnalysisResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState<string>();

  const analyze = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(undefined);
    setData(undefined);
    setProgress("Uploading image...");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setProgress("Analyzing with CLIP model (this may take 15-30 seconds)...");
      const response = await axios.post<ImageAnalysisResponse>(
        `${API_URL}/analyze-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 300000, // 5 minute timeout for desktop
        }
      );
      setData(response.data);
      setProgress(undefined);
    } catch (err) {
      console.error("Analysis failed:", err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          setError("Analysis timed out. The server may be starting up - please try again.");
        } else if (err.response) {
          setError(`Server error: ${err.response.data?.error || err.response.statusText}`);
        } else if (err.request) {
          setError("Cannot reach server. Please ensure the backend is running.");
        } else {
          setError(`Request error: ${err.message}`);
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to analyze image");
      }
      setProgress(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyze, data, isLoading, error, progress };
}
