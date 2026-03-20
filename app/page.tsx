"use client";
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Users, Sparkles, Plus } from 'lucide-react';

export default function FamilyApp() {
  const [view, setView] = useState<'profile' | 'calendar'>('profile');
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 데이터 불러오기 (구글 시트)
  const fetchData = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL!);
    const data = await res.json();
    setMembers(data.members);
    setEvents(data.events);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      {/* 상단 탭 */}
      <nav className="flex bg-white border-b sticky top-0 z-10">
        <button onClick={() => setView('profile')} className={`flex-1 p-4 flex justify-center ${view === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}><Users size={20} /></button>
        <button onClick={() => setView('calendar')} className={`flex-1 p-4 flex justify-center ${view === 'calendar' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}><CalendarIcon size={20} /></button>
      </nav>

      <main className="p-4">
        {view === 'profile' ? (
          <section className="space-y-4">
            <h2 className="font-bold text-lg">가족 프로필</h2>
            {members.map((m: any, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">{m.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{m.mbti}</span>
                  </div>
                  <button onClick={async () => {
                    const res = await fetch('/api/fortune', { method: 'POST', body: JSON.stringify(m) });
                    const d = await res.json();
                    alert(d.text);
                  }} className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} /> 운세 보기
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">생일: {m.birthday}</p>
              </div>
            ))}
          </section>
        ) : (
          <section className="bg-white rounded-2xl p-4 shadow-sm border">
             <h2 className="font-bold mb-4">가족 행사 캘린더</h2>
             {/* 캘린더 간략화 버전: 실제 구현 시 위에서 드린 캘린더 로직 삽입 */}
             <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
               {['일','월','화','수','목','금','토'].map(d => <div key={d}>{d}</div>)}
             </div>
             <div className="grid grid-cols-7 gap-1">
               {/* 3월 날짜 렌더링 로직 (생략 - 이전 답변 참조) */}
               <p className="col-span-7 text-center py-10 text-gray-300">날짜별 일정이 표시됩니다.</p>
             </div>
          </section>
        )}
      </main>

      {/* 하단 고정 추가 버튼 */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg">
        <Plus />
      </button>
    </div>
  );
}
