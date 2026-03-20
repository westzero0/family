'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Calendar as CalendarIcon, Sparkles, Loader2 } from 'lucide-react';

export default function FamilyApp() {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState(false); // 운세 모달
  const [currentFortune, setCurrentFortune] = useState(""); // 운세 내용
  const [loadingFortune, setLoadingFortune] = useState(false); // 로딩 상태

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_URL}?t=${Date.now()}`);
    const data = await res.json();
    setMembers(data.members || []);
  };

  useEffect(() => { fetchData(); }, []);

  // --- 운세 가져오기 함수 ---
  const getFortune = async (member: any) => {
    setLoadingFortune(true);
    setIsFortuneModalOpen(true);
    setCurrentFortune("명리학자 제미니가 별자리를 읽는 중입니다...");

    try {
      const res = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      const data = await res.json();
      setCurrentFortune(data.text);
    } catch (e) {
      setCurrentFortune("운세를 읽어오지 못했습니다. API 키 설정을 확인해주세요.");
    } finally {
      setLoadingFortune(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20 p-4">
      <h2 className="font-bold text-xl mb-4">가족 명단</h2>
      <div className="space-y-4">
        {members.map((m: any, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{m.name}</p>
              <p className="text-xs text-gray-400">{m.birthday} ({m.isLunar})</p>
            </div>
            
            {/* --- 수정된 버튼: onClick 추가 --- */}
            <button 
              onClick={() => getFortune(m)}
              className="bg-purple-100 text-purple-600 p-3 rounded-2xl active:scale-90 transition-transform"
            >
              <Sparkles size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* --- 운세 결과 팝업 --- */}
      {isFortuneModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-6">
          <div className="bg-white w-full rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsFortuneModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400"
            ><X /></button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                {loadingFortune ? <Loader2 className="animate-spin text-purple-600" size={32} /> : <Sparkles className="text-purple-600" size={32} />}
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">오늘의 운세</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {currentFortune}
              </p>
              {!loadingFortune && (
                <button 
                  onClick={() => setIsFortuneModalOpen(false)}
                  className="mt-8 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold"
                >확인</button>
              )}
            </div>
          </div>
        </div>
      )}

      
  // 입력 폼 상태 (양/음력 추가)
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    isLunar: '양력', // 기본값 양력
    birthTime: '12:00',
    mbti: '',
    hobby: ''
  });
  
const fetchData = async () => {
  try {
    // 캐시 때문에 옛날 데이터를 가져올 수 있으니 시간값을 살짝 붙여줍니다.
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_URL}?t=${Date.now()}`);
    const data = await res.json();
    console.log("불러온 데이터:", data); // 브라우저 F12 콘솔에서 확인용
    setMembers(data.members || []);
  } catch (e) {
    console.error("데이터 로드 실패", e);
  }
};

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("등록 시도 데이터:", formData);
    setIsSubmitting(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GAS_URL!, {
        method: 'POST',
        mode: 'no-cors', // 구글 스크립트 특성상 no-cors가 안정적일 수 있음
        body: JSON.stringify({ type: 'member', data: formData }),
      });

      alert(`${formData.name}님 등록 완료! (데이터 전송됨)`);
      setIsModalOpen(false);
      setFormData({ name: '', birthday: '', isLunar: '양력', birthTime: '12:00', mbti: '', hobby: '' });
      fetchData(); 
    } catch (error) {
      console.error("전송 에러:", error);
      alert("전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20 font-sans text-gray-900">
      {/* 탭 네비게이션 */}
      <nav className="flex bg-white border-b sticky top-0 z-10">
        <button onClick={() => setView('profile')} className={`flex-1 p-4 flex justify-center ${view === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}><Users /></button>
        <button onClick={() => setView('calendar')} className={`flex-1 p-4 flex justify-center ${view === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}><CalendarIcon /></button>
      </nav>

      <main className="p-4">
        {view === 'profile' && (
          <div className="space-y-4">
            <h2 className="font-bold text-xl ml-1">가족 프로필</h2>
            {members.map((m: any, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{m.name}</h3>
                    <p className="text-xs text-gray-400">{m.mbti || 'MBTI 미등록'}</p>
                  </div>
                  <button className="bg-purple-50 text-purple-600 p-2 rounded-xl"><Sparkles size={18}/></button>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  🎂 {m.birthday} <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded ml-1">{m.isLunar}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 등록 버튼 */}
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl active:scale-95 transition-transform"><Plus size={28} /></button>

      {/* 모달 팝업 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">가족 정보 입력</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="이름" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-blue-500" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <div className="flex bg-gray-100 p-1 rounded-2xl">
                {['양력', '음력'].map((type) => (
                  <button key={type} type="button" onClick={() => setFormData({...formData, isLunar: type})}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${formData.isLunar === type ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input required type="date" className="p-4 bg-gray-50 rounded-2xl outline-none border text-sm" 
                  value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} />
                <input required type="time" className="p-4 bg-gray-50 rounded-2xl outline-none border text-sm" 
                  value={formData.birthTime} onChange={e => setFormData({...formData, birthTime: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input placeholder="MBTI" className="p-4 bg-gray-50 rounded-2xl outline-none border" 
                  value={formData.mbti} onChange={e => setFormData({...formData, mbti: e.target.value})} />
                <input placeholder="취미" className="p-4 bg-gray-50 rounded-2xl outline-none border" 
                  value={formData.hobby} onChange={e => setFormData({...formData, hobby: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg flex justify-center items-center">
                {isSubmitting ? <Loader2 className="animate-spin" /> : '가족 명단에 추가하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
