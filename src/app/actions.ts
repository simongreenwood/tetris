"use server";
import { PrismaClient } from "@/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
const prisma = new PrismaClient().$extends(withAccelerate());

export async function handleGameOver(score: number, name: string) {
  console.log(name, "scored", score);
  await prisma.score.create({
    data: {
      name: name || "Anonymous",
      score: score,
    },
  });
}

export async function getTopScores(limit: number) {
  const scores = await prisma.score.findMany({
    orderBy: {
      score: "desc",
    },
    take: limit,
  });
  return scores;
}
