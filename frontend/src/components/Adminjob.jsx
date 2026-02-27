
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { 
  Briefcase, Plus, Trash2, FileText, Award, 
  Search, X, Users, History, Building2, BadgeCheck, ChevronRight, ChevronLeft
} from "lucide-react";

export default function AdminJobs() {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    titleAr: "", titleEn: "", typeAr: "", typeEn: ""
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingApps, setLoadingApps] = useState(false);

  const userLang = i18n.language;
  const isAr = userLang === "ar";

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/jobs`);
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(isAr ? "فشل تحميل الوظائف" : "Failed to load jobs");
    }
  };

  const viewApplications = async (jobId) => {
    setSelectedJob(jobId);
    setLoadingApps(true);
    setApplications([]);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/jobs/applications/${jobId}`);
      setApplications(res.data);
      if(res.data.length > 0) {
        toast.success(isAr ? `تم العثور على ${res.data.length} متقدمين` : `Found ${res.data.length} applicants`);
      }
    } catch (err) {
      toast.error(isAr ? "خطأ في تحميل الطلبات" : "Error loading applications");
    } finally {
      setLoadingApps(false);
    }
  };

  const addJob = async () => {
    if (!form.titleAr || !form.titleEn || !form.typeAr || !form.typeEn) {
      toast.error(isAr ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    const loadingToast = toast.loading(isAr ? "جاري حفظ الوظيفة..." : "Saving job...");
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/jobs`, form);
      toast.success(isAr ? "تم إضافة الوظيفة بنجاح" : "Job added successfully", { id: loadingToast });
      setForm({ titleAr: "", titleEn: "", typeAr: "", typeEn: "" });
      setShowAddForm(false);
      fetchJobs();
    } catch (err) {
      toast.error(isAr ? "فشل في إضافة الوظيفة" : "Failed to add job", { id: loadingToast });
    }
  };

  const deleteJob = (id) => {
    toast((toastItem) => (
      <div className="flex flex-col gap-4 p-1">
        <p className="font-bold text-sm text-white">
          {isAr ? 'هل أنت متأكد من حذف هذه الوظيفة؟' : 'Are you sure you want to delete this job?'}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              executeDelete(id);
              toast.dismiss(toastItem.id);
            }}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 transition-all"
          >
            {isAr ? 'نعم، احذف' : 'YES, DELETE'}
          </button>
          <button
            onClick={() => toast.dismiss(toastItem.id)}
            className="bg-white/10 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-white/20 transition-all"
          >
            {isAr ? 'إلغاء' : 'CANCEL'}
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const executeDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/jobs/${id}`);
      toast.success(isAr ? "تم الحذف بنجاح" : "Job deleted");
      fetchJobs();
      if (selectedJob === id) setSelectedJob(null);
    } catch (err) {
      toast.error(isAr ? "فشل الحذف" : "Delete failed");
    }
  };

  const filteredJobs = jobs.filter(j => {
    const title = j.title?.[userLang] || j.title?.ar || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20 pt-10" dir={isAr ? "rtl" : "ltr"}>
      
      <Toaster 
        position="top-center" 
        containerStyle={{ zIndex: 100000 }} 
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(249,115,22,0.3)',
            minWidth: '320px'
          },
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Briefcase className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter">
              <span className="text-orange-500">HIGH</span> FIT {isAr ? "الإدارة" : "ADMIN"}
            </h1>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white text-black hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-black transition-all flex items-center gap-2 text-sm"
          >
            {showAddForm ? <X size={18}/> : <Plus size={18}/>}
            {showAddForm ? (isAr ? "إغلاق" : "CLOSE") : (isAr ? "وظيفة جديدة" : "NEW JOB")}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-center md:text-start">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-2">{isAr ? "الوظائف النشطة" : "Active Jobs"}</p>
            <p className="text-5xl font-black italic">{jobs.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-2">{isAr ? "المتقدمين الذين تم العثور عليهم" : "Applicants Found"}</p>
            <p className="text-5xl font-black italic text-orange-500">{applications.length}</p>
          </div>
        </div>

        {/* Create Job Form */}
        {showAddForm && (
          <div className="bg-[#111] border border-orange-500/20 rounded-[2.5rem] p-8 mb-12 animate-in fade-in slide-in-from-top-4">
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Title (EN)" value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className={`bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 ${isAr ? 'text-left' : ''}`} />
              <input placeholder="المسمى الوظيفي (AR)" dir="rtl" value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 text-right" />
              <input placeholder="Type (EN)" value={form.typeEn} onChange={e => setForm({...form, typeEn: e.target.value})} className={`bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 ${isAr ? 'text-left' : ''}`} />
              <input placeholder="نوع الدوام (AR)" dir="rtl" value={form.typeAr} onChange={e => setForm({...form, typeAr: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 text-right" />
            </div>
            <button onClick={addJob} className="w-full bg-orange-500 mt-6 py-4 rounded-xl font-black uppercase italic hover:bg-orange-600 transition-all">
              {isAr ? "نشر الوظيفة" : "Publish Job"}
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-10">
          <Search className={`absolute ${isAr ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-white/20`} size={20} />
          <input 
            placeholder={isAr ? "بحث عن الوظائف..." : "Search positions..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 ${isAr ? 'pr-14 pl-6' : 'pl-14 pr-6'} outline-none focus:border-orange-500/40 italic font-bold`}
          />
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {filteredJobs.map(job => (
            <div key={job._id} className={`p-8 rounded-[2rem] border transition-all group ${selectedJob === job._id ? 'border-orange-500 bg-orange-500/5 shadow-2xl' : 'border-white/5 bg-white/5'}`}>
              <h3 className="text-xl font-black italic uppercase mb-2 group-hover:text-orange-500 transition-colors">
                {job.title?.[userLang] || job.title?.ar}
              </h3>
              <p className="text-white/30 text-xs mb-8 font-bold uppercase tracking-widest">
                {job.type?.[userLang] || job.type?.ar}
              </p>
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => viewApplications(job._id)}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] flex items-center justify-center gap-2 tracking-widest transition-all ${selectedJob === job._id ? 'bg-orange-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <Users size={14}/> {isAr ? "المتقدمين" : "APPLICANTS"}
                </button>
                <button onClick={() => deleteJob(job._id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Applications Section */}
        {selectedJob && (
          <div className="animate-in slide-in-from-bottom-10 pt-10 border-t border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter underline decoration-orange-500 decoration-4 underline-offset-8">
                {isAr ? "ملفات المرشحين" : "Candidates Portfolio"}
              </h2>
              <button onClick={() => {setSelectedJob(null); setApplications([]);}} className="p-3 bg-white/5 rounded-full hover:bg-orange-500 transition-colors"><X/></button>
            </div>

            {loadingApps ? (
              <div className="text-center py-20 text-orange-500 font-black animate-pulse uppercase tracking-[0.3em]">
                {isAr ? "جاري الاستعلام..." : "Querying Database..."}
              </div>
            ) : applications.length === 0 ? (
              <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-white/20 italic">
                {isAr ? "لا يوجد متقدمين لهذه الوظيفة بعد." : "No applicants for this role yet."}
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map(app => (
                  <div key={app._id} className="bg-[#111] border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col gap-8">
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div><p className="text-[10px] text-orange-500 font-black mb-1 uppercase">{isAr ? "الاسم بالكامل" : "Full Name"}</p><p className="font-bold text-lg">{app.applicantName}</p></div>
                      <div><p className="text-[10px] text-orange-500 font-black mb-1 uppercase">{isAr ? "الاتصال" : "Contact"}</p><p className="font-bold text-base tracking-tighter">{app.phone}</p></div>
                      <div><p className="text-[10px] text-orange-500 font-black mb-1 uppercase">{isAr ? "الجنسية" : "Nationality"}</p><p className="font-bold text-base">{app.nationality}</p></div>
                      <div><p className="text-[10px] text-orange-500 font-black mb-1 uppercase">{isAr ? "العمر" : "Age"}</p><p className="font-bold text-base">{app.age} {isAr ? "سنة" : "Years"}</p></div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <div className={`flex flex-col md:flex-row gap-6 md:items-center ${isAr ? 'md:flex-row' : ''}`}>
                        <div className="flex items-center gap-2 shrink-0">
                          <History className={app.workedBefore === 'yes' ? 'text-green-500' : 'text-red-500'} size={18}/>
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {app.workedBefore === 'yes' ? (isAr ? 'لديه خبرة' : 'Experienced') : (isAr ? 'خريج جديد' : 'Fresh Candidate')}
                          </span>
                        </div>
                        
                        {app.workedBefore === 'yes' && (
                          <div className={`flex flex-col md:flex-row gap-6 md:gap-12 border-t md:border-t-0 ${isAr ? 'md:border-r md:pr-8' : 'md:border-l md:pl-8'} border-white/10 pt-4 md:pt-0 w-full`}>
                            <div className="flex items-center gap-3">
                              <Building2 size={16} className="text-white/40"/>
                              <div>
                                <p className="text-[9px] text-white/40 font-bold uppercase">{isAr ? "آخر شركة" : "Last Company"}</p>
                                <p className="font-bold italic text-sm">{app.previousJobs || "N/A"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <BadgeCheck size={16} className="text-white/40"/>
                              <div>
                                <p className="text-[9px] text-white/40 font-bold uppercase">{isAr ? "آخر مسمى" : "Last Title"}</p>
                                <p className="font-bold italic text-sm">{app.previousTitle || "N/A"}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                      {app.resume && app.resume !== "null" && (
                        <a href={app.resume} target="_blank" className="flex-1 bg-white text-black hover:bg-orange-500 hover:text-white py-4 rounded-xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-black/20">
                          <FileText size={16}/> {isAr ? "عرض السيرة الذاتية" : "VIEW RESUME"}
                        </a>
                      )}
                      {app.experienceCertificate && app.experienceCertificate !== "null" && (
                        <a href={app.experienceCertificate} target="_blank" className="flex-1 bg-white/5 border border-white/10 hover:border-orange-500 py-4 rounded-xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all">
                          <Award size={16}/> {isAr ? "شهادة الخبرة" : "EXPERIENCE CERT"}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}