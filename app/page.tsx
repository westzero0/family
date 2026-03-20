'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Calendar as CalendarIcon, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';

export default function FamilyApp() {
  const [view, setView] = useState<'profile' | 'calendar'>('profile');
  const [members, setMembers] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // 모달 상태들
  const [isModalOpen, setIsModalOpen] = useState(false); // 등록 모달
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState(false); // 운세 모달
  const [currentFortune, setCurrentFortune] = useState("");
  const [loadingFortune, setLoadingFortune] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 등록 폼 상태
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

  // 운세 가져오기
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
    } catch (e) { setCurrentFortune("운세를 읽어오지 못했습니다."); }
    finally { setLoadingFortune(false); }
  };

  // 가족 등록
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
    } catch (error) { alert("등록 오류 발생"); }
    finally { setIsSubmitting(false); }
  };

  // 달력 렌더링
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
        const fullDate = format(day, "yyyy-MM-dd");
        const dayBirthdays = members.filter((m: any) => {
          if (!m.birthday) return false;
          return m.birthday.substring(5) === fullDate.substring(5);
        });

        days.push(
          <div key={fullDate} className={`min-h-[90px] border-t p-1 ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-300' : 'bg-white'}`}>
            <span className="text-xs font-medium">{format(day, "d")}</span>
            <div className="mt-1 space-y-1">
              {dayBirthdays.map((m: any, idx) => (
                <div key={idx} className="text-[10px] bg-pink-100 text-pink-600 p-1 rounded truncate">🎂 {m.name}</div>
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
      {/* 상단 탭 */}
      <nav className="flex bg-white border-b sticky top-0 z-10">
        <button onClick={() => setView('profile')} className={`flex-1 p-4 flex justify-center ${view === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}><Users size={20}/></button>
        <button onClick={() => setView('calendar')} className={`flex-1 p-4 flex justify-center ${view === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}><CalendarIcon size={20}/></button>
      </nav>

      <main className="p-4">
        {view === 'profile' ? (
          <div className="space-y-4">
            <h2 className="font-bold text-xl ml-1">우리 가족 명단</h2>
            {members.map((m: any, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{m.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">🎂 {m.birthday} ({m.isLunar})</div>
                </div>
                <button onClick={() => getFortune(m)} className="bg-purple-100 text-purple-600 p-3 rounded-2xl active:scale-90 transition-transform"><Sparkles size={20}/></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b text-gray-800">
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
            <div>{renderCalendar()}</div>
          </div>
        )}
      </main>

      {/* 등록 버튼 */}
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl active:scale-95 transition-transform z-40"><Plus size={28}/></button>

      {/* 1. 가족 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">가족 정보 입력</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="이름" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-blue-500 text-gray-800" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="flex bg-gray-100 p-1 rounded-2xl">
                {['양력', '음력'].map((type) => (
                  <button key={type} type="button" onClick={() => setFormData({...formData, isLunar: type})} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${formData.isLunar === type ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>{type}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-800">
                <input required type="date" className="p-4 bg-gray-50 rounded-2xl outline-none border text-sm" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} />
                <input required type="time" className="p-4 bg-gray-50 rounded-2xl outline-none border text-sm" value={formData.birthTime} onChange={e => setFormData({...formData, birthTime: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-800">
                <input placeholder="MBTI" className="p-4 bg-gray-50 rounded-2xl outline-none border" value={formData.mbti} onChange={e => setFormData({...formData, mbti: e.target.value})} />
                <input placeholder="취미" className="p-4 bg-gray-50 rounded-2xl outline-none border" value={formData.hobby} onChange={e => setFormData({...formData, hobby: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg flex justify-center items-center">
                {isSubmitting ? <Loader2 className="animate-spin" /> : '명단에 추가하기'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. 운세 결과 모달 */}
      {isFortuneModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-6 text-gray-800">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative">
            <button onClick={() => setIsFortuneModalOpen(false)} className="absolute top-4 right-4 text-gray-400"><X /></button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                {loadingFortune ? <Loader2 className="animate-spin text-purple-600" size={32} /> : <Sparkles className="text-purple-600" size={32} />}
              </div>
              <h3 className="text-xl font-bold mb-4">오늘의 운세</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{currentFortune}</p>
              {!loadingFortune && <button onClick={() => setIsFortuneModalOpen(false)} className="mt-8 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold">확인</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
