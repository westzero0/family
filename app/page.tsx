'use client'; // 1. 상호작용을 위해 반드시 필요!

import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export default function FamilyApp() {
  const [view, setView] = useState<'profile' | 'calendar'>('profile');
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. 모달 상태 관리

  // 입력 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    birthTime: '',
    mbti: '',
    hobby: ''
  });

  // 데이터 불러오기 (구글 시트 연동)
  const fetchData = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL!);
      const data = await res.json();
      setMembers(data.members || []);
    } catch (e) {
      console.error("데이터 로드 실패", e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 가족 추가 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 구글 시트로 데이터 전송 (POST)
    await fetch(process.env.NEXT_PUBLIC_GAS_URL!, {
      method: 'POST',
      body: JSON.stringify({ type: 'member', data: formData }),
    });

    setIsModalOpen(false); // 창 닫기
    setFormData({ name: '', birthday: '', birthTime: '', mbti: '', hobby: '' }); // 폼 초기화
    fetchData(); // 명단 새로고침
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20 font-sans">
      {/* 상단 탭 */}
      <nav className="flex bg-white border-b sticky top-0 z-10">
        <button onClick={() => setView('profile')} className={`flex-1 p-4 flex justify-center ${view === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}><Users size={20} /></button>
        <button onClick={() => setView('calendar')} className={`flex-1 p-4 flex justify-center ${view === 'calendar' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}><CalendarIcon size={20} /></button>
      </nav>

      <main className="p-4">
        {view === 'profile' && (
          <section className="space-y-4">
            <h2 className="font-bold text-xl text-gray-800">우리 가족 명단</h2>
            {members.length > 0 ? members.map((m: any, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{m.name}</span>
                  <button className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full flex items-center gap-1 font-semibold">
                    <Sparkles size={12} /> 운세 보기
                  </button>
                </div>
                <div className="text-sm text-gray-500 mt-2 space-x-2">
                  <span>🎂 {m.birthday}</span>
                  <span>✨ {m.mbti}</span>
                </div>
              </div>
            )) : <p className="text-center py-10 text-gray-400">가족을 등록해주세요!</p>}
          </section>
        )}
      </main>

      {/* 3. 플러스 버튼: 누르면 setIsModalOpen(true) 실행 */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
      >
        <Plus size={28} />
      </button>

      {/* 4. 실제 모달 창 (조건부 렌더링) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">가족 추가</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="성함" className="w-full p-4 bg-gray-100 rounded-2xl outline-none" 
                onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input required type="date" className="p-4 bg-gray-100 rounded-2xl outline-none" 
                  onChange={e => setFormData({...formData, birthday: e.target.value})} />
                <input placeholder="MBTI" className="p-4 bg-gray-100 rounded-2xl outline-none" 
                  onChange={e => setFormData({...formData, mbti: e.target.value})} />
              </div>
              <input placeholder="취미 (예: 클라이밍)" className="w-full p-4 bg-gray-100 rounded-2xl outline-none" 
                onChange={e => setFormData({...formData, hobby: e.target.value})} />
              
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg mt-4">
                등록하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
