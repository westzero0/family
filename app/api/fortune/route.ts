import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  const member = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `너는 유머러스한 명리학자야. 다음 정보를 바탕으로 오늘(2026년 3월 20일)의 운세를 한 줄로 써줘.
    이름: ${member.name}, MBTI: ${member.mbti}, 취미: ${member.hobby}, 생일: ${member.birthday}
    가족 간의 유대감을 높이는 말투로, 행운의 아이템도 하나 추천해줘.`;

  const result = await model.generateContent(prompt);
  return new Response(JSON.stringify({ text: result.response.text() }));
}
