import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  const member = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `당신은 유능하고 위트 있는 명리학자입니다. 아래 가족 구성원의 정보를 바탕으로 '오늘의 운세'를 딱 한 문장으로 재미있게 풀이해주세요. 
    마지막엔 행운의 아이템도 하나 추천해줘.
    - 이름: ${member.name}
    - 생일: ${member.birthday} (${member.isLunar})
    - 태어난 시간: ${member.birthTime}
    - MBTI: ${member.mbti}
    - 취미: ${member.hobby}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return new Response(JSON.stringify({ text: response.text() }));
  } catch (error) {
    return new Response(JSON.stringify({ text: "제미니가 지금은 명상 중입니다. 잠시 후 다시 시도해주세요!" }), { status: 500 });
  }
}
