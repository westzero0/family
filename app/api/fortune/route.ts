import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  const member = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `당신은 실력 있는 명리학자입니다. 다음 정보를 바탕으로 오늘의 운세를 분석해주세요.
- 이름: ${member.name}
- 생년월일: ${member.birthday} (${member.isLunar})
- 태어난 시각: ${member.birthTime}
- MBTI: ${member.mbti}

위 정보가 ${member.isLunar}임을 반드시 반영하여 사주 원국을 분석하고, 오늘 하루의 흐름을 위트 있게 한 문장으로 알려주세요.`;

  const result = await model.generateContent(prompt);
  return new Response(JSON.stringify({ text: result.response.text() }));
}
