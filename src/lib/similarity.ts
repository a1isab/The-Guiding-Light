import { createServiceClient } from "./supabase";

interface SimilarLesson {
  id: string;
  lesson_id: string;
  lesson_title: string;
  similarity: number;
}

export async function findSimilarLessons(
  embedding: number[],
  threshold?: number
): Promise<SimilarLesson[]> {
  const supabase = createServiceClient();
  const similarityThreshold = threshold ?? parseFloat(process.env.SIMILARITY_THRESHOLD ?? "0.78");

  const { data, error } = await supabase.rpc("find_similar_lessons", {
    query_embedding: embedding,
    similarity_threshold: similarityThreshold,
  });

  if (error) {
    console.error("Similarity search error:", error);
    return [];
  }

  return (data as SimilarLesson[]) ?? [];
}
