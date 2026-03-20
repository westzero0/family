import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ text: "API 키가 설정되지 않았습니다." }), { status: 500 });
  }

  try {
    const member = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 모델 이름을 'gemini-1.5-flash-latest'로 변경해봅니다.
    // 만약 그래도 안 된다면 'gemini-1.5-pro' 또는 'gemini-pro'로 시도해보세요.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `당신은 위트 있는 명리학자입니다. 아래 정보로 오늘의 운세를 한 문장으로 풀이하고 행운의 아이템을 추천해주세요.
      이름: ${member.name}, 생일: ${member.birthday} (${member.isLunar}), 시간: ${member.birthTime}, MBTI: ${member.mbti}, 취미: ${member.hobby}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }));
  } catch (error: any) {
    console.error("제미니 에러 상세:", error.message);
    // 에러 메시지에 모델 이름 관련 내용이 있으면 사용자에게 알림
    return new Response(JSON.stringify({ 
      text: `모델 연결 오류가 발생했습니다. (사유: ${error.message}). API 키가 'Google AI Studio'용인지 확인해주세요.` 
    }), { status: 500 });
  }
}
