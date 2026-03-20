// app/api/fortune/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return new Response("API KEY MISSING", { status: 500 });

  try {
    const member = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // '-latest'를 떼고 가장 표준적인 이름을 씁니다.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `가족 구성원 정보를 바탕으로 오늘의 운세를 위트있게 한 줄로 알려줘: ${JSON.stringify(member)}`;

    const result = await model.generateContent(prompt);
    return new Response(JSON.stringify({ text: result.response.text() }));
  } catch (error: any) {
    // 만약 여기서 또 404가 뜨면 모델명을 "gemini-pro"로만 바꿔보세요.
    return new Response(JSON.stringify({ text: `연결 오류: ${error.message}` }), { status: 500 });
  }
}
