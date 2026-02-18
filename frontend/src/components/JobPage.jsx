"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { 
  Briefcase, User, Mail, Phone, Globe, GraduationCap, 
  Calendar, Upload, ChevronRight, CheckCircle2, Info
} from "lucide-react";

export default function JobsPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    phone: "",
    nationality: "",
    education: "",
    age: "",
    startDate: "",
    resume: null,
    experienceCertificate: null,
    photo: null,
    workedBefore: "no",
    previousJobs: "",
    previousTitle: "",
    jobId: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/jobs`);
      setJobs(res.data);
    } catch (err) {
      toast.error(t("failed_load_jobs") || "Failed to load jobs");
    }
  };

  const handleFileChange = (e, field) => {
    setForm({ ...form, [field]: e.target.files[0] });
  };

  const validateForm = () => {
    const phoneRegex = /^\d{10}$/;
    if (!form.jobId || !form.applicantName || !form.applicantEmail || !form.phone) {
      toast.error(t("fill_required_fields") || "Please fill required fields");
      return false;
    }
    if (!phoneRegex.test(form.phone)) {
      toast.error(t("invalid_phone_10_digits") || "Invalid phone number");
      return false;
    }
    return true;
  };

  const applyJob = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(t("application_success") || "Application sent!");
      setForm({
        applicantName: "", applicantEmail: "", phone: "", nationality: "",
        education: "", age: "", startDate: "", resume: null,
        experienceCertificate: null, workedBefore: "no", previousJobs: "",
        previousTitle: "", jobId: "",
      });
    } catch (err) {
      toast.error(t("application_error") || "Error sending application");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans" dir={currentLang === "ar" ? "rtl" : "ltr"}>
      <Toaster position="top-center" />

      {/* Hero Header */}
      <div className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5 skew-y-3 origin-left"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter mb-4">
            <span className="text-orange-500">HIGH</span> FIT CAREERS
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto uppercase tracking-widest">
            {t("join_team")}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Jobs List Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-8 w-2 bg-orange-500"></div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">{t("available_jobs")}</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/10 p-12 rounded-3xl text-center">
              <p className="text-white/40">{t("no_jobs")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => setForm({ ...form, jobId: job._id })}
                  className={`cursor-pointer group p-6 rounded-2xl border transition-all ${
                    form.jobId === job._id 
                    ? "bg-orange-500 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.2)]" 
                    : "bg-[#111] border-white/5 hover:border-orange-500/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${form.jobId === job._id ? "text-white" : "text-orange-500"}`}>
                        {currentLang === "ar" ? job.title.ar : job.title.en}
                      </h3>
                      <p className={form.jobId === job._id ? "text-white/80" : "text-white/40"}>
                        {currentLang === "ar" ? job.type.ar : job.type.en}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      form.jobId === job._id ? "bg-white text-orange-500" : "bg-white/5 text-white/20"
                    }`}>
                      {form.jobId === job._id ? <CheckCircle2 size={24}/> : <ChevronRight size={24}/>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Application Form */}
        {form.jobId && (
          <section className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-orange-500 p-6 text-center">
                <h3 className="text-xl font-bold uppercase italic tracking-widest">{t("apply_for_job")}</h3>
            </div>
            
            <div className="p-8 sm:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Inputs Grid */}
                <InputField icon={<User size={18}/>} label={t("your_name")} value={form.applicantName} onChange={v => setForm({...form, applicantName: v})} />
                <InputField icon={<Mail size={18}/>} label={t("your_email")} type="email" value={form.applicantEmail} onChange={v => setForm({...form, applicantEmail: v})} />
                <InputField icon={<Phone size={18}/>} label={t("phone")} type="number" value={form.phone} onChange={v => setForm({...form, phone: v})} />
                <InputField icon={<Globe size={18}/>} label={t("nationality")} value={form.nationality} onChange={v => setForm({...form, nationality: v})} />
                <InputField icon={<GraduationCap size={18}/>} label={t("education")} value={form.education} onChange={v => setForm({...form, education: v})} />
                <InputField icon={<Info size={18}/>} label={t("age")} value={form.age} onChange={v => setForm({...form, age: v})} />
                
                <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-white/40 uppercase mb-2 block">{t("start_date")}</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18}/>
                        <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500 transition-all"/>
                    </div>
                </div>
              </div>

              {/* Files */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <FileUploader label={t("resume")} onChange={e => handleFileChange(e, "resume")} />
                <FileUploader label={t("experience_certificate")} onChange={e => handleFileChange(e, "experienceCertificate")} />
              </div>

              {/* Experience Radio */}
              <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-orange-500" size={20}/> {t("worked_before")}
                </p>
                <div className="flex gap-6">
                    {['yes', 'no'].map(opt => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="workedBefore" value={opt} checked={form.workedBefore === opt} onChange={() => setForm({...form, workedBefore: opt})} className="hidden" />
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${form.workedBefore === opt ? 'border-orange-500 bg-orange-500' : 'border-white/20'}`}>
                                {form.workedBefore === opt && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className={form.workedBefore === opt ? 'text-white font-bold' : 'text-white/40'}>{t(opt)}</span>
                        </label>
                    ))}
                </div>

                {form.workedBefore === "yes" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-in zoom-in-95">
                    <input placeholder={t("previous_workplace")} value={form.previousJobs} onChange={e => setForm({...form, previousJobs: e.target.value})} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500"/>
                    <input placeholder={t("previous_title")} value={form.previousTitle} onChange={e => setForm({...form, previousTitle: e.target.value})} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500"/>
                  </div>
                )}
              </div>

              <button 
                onClick={applyJob} 
                className="w-full mt-10 bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl text-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 uppercase italic tracking-tighter"
              >
                {t("submit_application")}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function InputField({ icon, label, type="text", value, onChange }) {
    return (
        <div className="relative group">
            <label className="text-xs font-bold text-white/40 uppercase mb-2 block px-1 group-focus-within:text-orange-500 transition-colors">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">{icon}</div>
                <input 
                    type={type} 
                    value={value} 
                    onChange={e => onChange(e.target.value)}
                    placeholder={label}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500 transition-all placeholder:text-white/10"
                />
            </div>
        </div>
    );
}

function FileUploader({ label, onChange }) {
    return (
        <div className="group">
            <label className="text-xs font-bold text-white/40 uppercase mb-2 block">{label}</label>
            <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-4 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all">
                <input type="file" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="flex items-center gap-3 text-white/60 group-hover:text-white transition-colors">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center"><Upload size={18}/></div>
                    <span className="text-sm font-medium italic">{label}</span>
                </div>
            </div>
        </div>
    );
}