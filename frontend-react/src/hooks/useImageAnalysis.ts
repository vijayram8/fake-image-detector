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

async function wakeUpServer(): Promise<boolean> {
  try {
    await axios.get(`${API_URL}/health`, { timeout: 30000 });
    return true;
  } catch {
    return false;
  }
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
    
    // Wake up server first
    setProgress("Connecting to server...");
    const serverAwake = await wakeUpServer();
    if (!serverAwake) {
      setProgress("Server is waking up, please wait...");
      // Retry once
      const retryAwake = await wakeUpServer();
      if (!retryAwake) {
        setError("Server is unavailable. Please try again in 1 minute.");
        setIsLoading(false);
        setProgress(undefined);
        return;
      }
    }

    setProgress("Uploading image...");
    const formData = new FormData();
    formData.append("image", file);

    try {
      setProgress("Analyzing image (30-90 seconds)...");
      const response = await axios.post<ImageAnalysisResponse>(
        `${API_URL}/analyze-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 180000, // 3 minute timeout
        }
      );
      setData(response.data);
      setProgress(undefined);
    } catch (err) {
      console.error("Analysis failed:", err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          setError("Analysis timed out. Server is slow - please try a smaller image or try again.");
        } else if (err.response) {
          setError(`Server error: ${err.response.data?.error || err.response.statusText}`);
        } else if (err.request) {
          setError("Cannot reach server. Please check your connection and try again.");
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
