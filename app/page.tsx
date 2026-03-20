'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Calendar as CalendarIcon, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';

export default function FamilyApp() {
  const [view, setView] = useState<'profile' | 'calendar'>('profile');
  const [members, setMembers] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState(false);
  const [currentFortune, setCurrentFortune] = useState("");
  const [loadingFortune, setLoadingFortune] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', birthday: '', isLunar: '양력', birthTime: '12:00', mbti: '', hobby: ''
  });

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_URL}?t=${Date.now()}`);
      const data = await res.json();
      setMembers(data.members || []);
    } catch (e) { console.error("로드 실패", e); }
  };

  useEffect(() => { fetchData(); }, []);

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
    } catch (e) { setCurrentFortune("API 설정을 확인해주세요."); }
    finally { setLoadingFortune(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(process.env.NEXT_PUBLIC_GAS_URL!, {
        method: 'POST', mode: 'no-cors',
        body: JSON.stringify({ type: 'member', data: formData }),
      });
      alert(`${formData.name}님 등록 완료!`);
      setIsModalOpen(false);
      setFormData({ name: '', birthday: '', isLunar: '양력', birthTime: '12:00', mbti: '', hobby: '' });
      fetchData();
    } catch (error) { alert("등록 중 오류가 발생했습니다."); }
    finally { setIsSubmitting(false); }
  };

  // --- 달력 렌더링 로직 ---
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const fullDate = format(day, "yyyy-MM-dd");
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        // 해당 날짜에 생일인 가족 찾기 (월-일만 비교)
        const dayBirthdays = members.filter((m: any) => {
          if (!m.birthday) return false;
          return m.birthday.substring(5) === fullDate.substring(5);
        });

        days.push(
          <div key={fullDate} className={`min-h-[80px] border-t p-1 ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : 'bg-white'}`}>
            <span className="text-xs font-medium">{formattedDate}</span>
            <div className="mt-1 space-y-1">
              {dayBirthdays.map((m: any, idx) => (
                <div key={idx} className="text-[10px] bg-pink-100 text-pink-600 p-1 rounded leading-none truncate">
                  🎂 {m.name}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7">{days}</div>);
      days = [];
    }
    return rows;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20 font-sans text-gray-900">
      <nav className="flex bg-white border-b sticky top-0 z-10 shadow-sm">
        <button onClick={() => setView('profile')} className={`flex-1 p-4 flex justify-center ${view === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}><Users size={20}/></button>
        <button onClick={() => setView('calendar')} className={`flex-1 p-4 flex justify-center ${view === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}><CalendarIcon size={20}/></button>
      </nav>

      <main className="p-4">
        {view === 'profile' ? (
          <div className="space-y-4">
            <h2 className="font-bold text-xl ml-1">우리 가족</h2>
            {members.map((m: any, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{m.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">🎂 {m.birthday} <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded ml-1">{m.isLunar}</span></div>
                </div>
                <button onClick={() => getFortune(m)} className="bg-purple-100 text-purple-600 p-3 rounded-2xl active:scale-90 transition-transform"><Sparkles size={20}/></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="font-bold text-lg">{format(currentMonth, 'yyyy년 M월')}</h2>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20}/></button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={20}/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center py-2 bg-gray-50 text-[10px] font-bold text-gray-400 border-b">
              {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                <div key={d} className={i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : ''}>{d}</div>
              ))}
            </div>
            <div className="bg-white">{renderCalendar()}</div>
          </div>
        )}
      </main>

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl active:scale-95 transition-transform z-40"><Plus size={28}/></button>

      {/* 등록 모달 & 운세 모달 생략 (위와 동일하게 유지하세요) */}
      {/* ... (이전 코드의 등록 모달/운세 모달 부분 삽입) ... */}
    </div>
  );
}
