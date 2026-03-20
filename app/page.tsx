'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Calendar as CalendarIcon, Sparkles, Loader2 } from 'lucide-react';

export default function FamilyApp() {
  const [view, setView] = useState<'profile' | 'calendar'>('profile');
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 폼 상태 (태어난 시간 추가)
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    birthTime: '12:00', // 기본값 설정
    mbti: '',
    hobby: ''
  });

  const fetchData = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL!);
      const data = await res.json();
      setMembers(data.members || []);
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지
    setIsSubmitting(true);

    try {
      // 구글 앱스 스크립트로 데이터 전송
      const response = await fetch(process.env.NEXT_PUBLIC_GAS_URL!, {
        method: 'POST',
        mode: 'no-cors', // GAS 전송 시 필수 설정인 경우가 많음
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'member', data: formData }),
      });

      alert(`${formData.name}님의 정보가 등록되었습니다!`);
      setIsModalOpen(false);
      setFormData({ name: '', birthday: '', birthTime: '12:00', mbti: '', hobby: '' });
      fetchData(); // 명단 새로고침
    } catch (error) {
      console.error("등록 에러:", error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20 font-sans">
      <nav className="flex bg-white border-b sticky top-0 z-10 shadow-sm">
        <button onClick={() => setView('profile')} className={`flex-1 p-4 flex justify-center ${view === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}><Users /></button>
        <button onClick={() => setView('calendar')} className={`flex-1 p-4 flex justify-center ${view === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}><CalendarIcon /></button>
      </nav>

      <main className="p-4">
        {view === 'profile' && (
          <div className="space-y-4">
            <h2 className="font-bold text-xl px-1">우리 가족</h2>
            {members.map((m: any, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{m.name}</h3>
                    <p className="text-xs text-gray-400">{m.mbti || 'MBTI 미등록'}</p>
                  </div>
                  <button className="bg-purple-50 text-purple-600 p-2 rounded-xl"><Sparkles size={18}/></button>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  🎂 {m.birthday} ({m.birthTime})
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 등록 버튼 */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl"
      >
        <Plus size={28} />
      </button>

      {/* 모달 팝업 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">새 가족 등록</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="이름" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-blue-500" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">생년월일</label>
                  <input required type="date" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border" 
                    value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">태어난 시간</label>
                  <input required type="time" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border" 
                    value={formData.birthTime} onChange={e => setFormData({...formData, birthTime: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input placeholder="MBTI" className="p-4 bg-gray-50 rounded-2xl outline-none border" 
                  value={formData.mbti} onChange={e => setFormData({...formData, mbti: e.target.value})} />
                <input placeholder="취미" className="p-4 bg-gray-50 rounded-2xl outline-none border" 
                  value={formData.hobby} onChange={e => setFormData({...formData, hobby: e.target.value})} />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : '가족 명단에 추가하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
