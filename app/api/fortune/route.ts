import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  // 1. API 키 확인
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("에러: GEMINI_API_KEY가 설정되지 않았습니다.");
    return new Response(JSON.stringify({ text: "API 키 설정이 누락되었습니다." }), { status: 500 });
  }

  try {
    const member = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. 모델 설정 (버전 호환성을 위해 모델명 확인)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `당신은 위트 있는 명리학자입니다. 아래 정보로 오늘의 운세를 한 문장으로 풀이하고 행운의 아이템을 추천해주세요.
      이름: ${member.name}, 생일: ${member.birthday} (${member.isLunar}), 시간: ${member.birthTime}, MBTI: ${member.mbti}, 취미: ${member.hobby}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }));
  } catch (error: any) {
    // 3. 에러 내용을 로그에 상세히 출력
    console.error("제미니 API 호출 중 상세 에러:", error.message);
    return new Response(JSON.stringify({ text: `제미니가 대답을 거부했습니다: ${error.message}` }), { status: 500 });
  }
}
