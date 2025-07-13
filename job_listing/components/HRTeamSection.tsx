"use client";
import { FC } from 'react';
import { useRouter } from 'next/navigation';

const hrMembers = [
  {
    name: 'Sara Mekonnen',
    title: 'HR Manager',
    email: 'sara.mekonnen@company.com',
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Abel Tadesse',
    title: 'Recruitment Lead',
    email: 'abel.tadesse@company.com',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Lily Tesfaye',
    title: 'Employee Relations',
    email: 'lily.tesfaye@company.com',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Samuel Kebede',
    title: 'HR Specialist',
    email: 'samuel.kebede@company.com',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Helen Asfaw',
    title: 'HR Coordinator',
    email: 'helen.asfaw@company.com',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
];

const applicantTestimonials = [
  {
    quote: "The HR team made my application process smooth and welcoming!",
    name: "Mekdes Alemu",
    role: "Applicant",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "I felt supported every step of the way.",
    name: "Yonas Getachew",
    role: "Applicant",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "Professional and caring approach throughout the entire process.",
    name: "Bethel Tadesse",
    role: "Applicant",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "Clear communication and timely updates made all the difference.",
    name: "Daniel Kebede",
    role: "Applicant",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "The HR team truly understands what candidates need.",
    name: "Ruth Asfaw",
    role: "Applicant",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "Exceptional experience from application to onboarding.",
    name: "Michael Tekle",
    role: "Applicant",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
];

const employeeTestimonials = [
  {
    quote: "The HR team truly cares about our well-being and growth.",
    name: "Selamawit Tadesse",
    role: "Employee",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "They are always available to help with any issue.",
    name: "Abraham Fikru",
    role: "Employee",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "Supportive environment that encourages professional development.",
    name: "Grace Mengistu",
    role: "Employee",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "Transparent policies and fair treatment for everyone.",
    name: "David Haile",
    role: "Employee",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "The HR team creates a positive workplace culture.",
    name: "Sofia Bekele",
    role: "Employee",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
  },
  {
    quote: "Excellent support system for career growth and development.",
    name: "John Demeke",
    role: "Employee",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
];

const Marquee: FC<{
  testimonials: { quote: string; name: string; role: string; img: string; degree?: string }[],
  speed?: number,
  direction?: 'left' | 'right',
  offset?: string
}> = ({ testimonials, speed = 30, direction = 'left', offset = '' }) => (
  <div className="overflow-hidden w-full">
    <div
      className={`flex gap-6 animate-marquee items-center ${offset}`}
      style={{
        animationDuration: `${speed}s`,
        animationDirection: direction === 'right' ? 'reverse' : 'normal',
      }}
    >
      {[...testimonials, ...testimonials].map((t, idx) => (
        <div
          key={idx}
          className="w-[400px] h-[120px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md px-5 py-4 flex items-center gap-4 text-left border border-blue-100"
        >
          <div className="flex-shrink-0">
            <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 leading-tight mb-2 line-clamp-2">"{t.quote}"</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-semibold text-xs">
                {t.name}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{t.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation-name: marquee;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    `}</style>
  </div>
);

const HRTeamSection: FC = () => {
  const router = useRouter();

  return (
    <section className="w-full bg-[#f8f9fb] pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title & Achievements */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight text-gray-900">Our HR Team Achievements</h2>
        <p className="text-lg text-center text-gray-500 mb-8 max-w-2xl mx-auto">
          Over the past decade, our HR team has facilitated the recruitment of 200+ employees, launched multiple employee wellness programs, and maintained a 95% employee satisfaction rate. We are committed to supporting every applicant and employee with transparency, care, and innovation.
        </p>
        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            className="px-5 py-2.5 rounded-lg border border-[#087684] bg-white text-[#087684] font-semibold shadow-sm hover:bg-[#087684]/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2"
            onClick={() => router.push('/contact')}
          >
            Contact Us
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-[#087684] text-white font-semibold shadow-sm hover:bg-[#065a5e] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2"
            onClick={() => window.location.href = 'mailto:hr@innovationhub.com'}
          >
            Send an Email
          </button>
        </div>
        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {hrMembers.map((member) => (
            <div key={member.email} className="flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden group transition">
              <div className="w-full h-64 bg-gray-200 overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition duration-500"
                />
              </div>
              <div className="w-full px-4 py-4 bg-white text-center">
                <div className="font-semibold text-lg text-gray-900 truncate">{member.name}</div>
                <div className="text-sm text-gray-500 mb-1 truncate">{member.title}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Testimonial Section Intro */}
        <div className="mt-12 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 bg-white text-[#087684] font-semibold px-4 py-1.5 rounded-full shadow text-sm">
              <svg className="w-5 h-5 text-[#087684]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
              Trusted by hundreds of applicants and employees
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-2 text-gray-900">What people say about our HR team</h3>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Real feedback from applicants and employees about their experience with our HR department.</p>
        </div>
        {/* Marquee Testimonials - Two Rows */}
        <div className="bg-white rounded-3xl shadow-xl px-6 py-10 max-w-5xl mx-auto space-y-8">
          {/* Row 1: Applicants */}
          <div className="overflow-hidden w-full">
            <div className="flex gap-6 animate-marquee items-center" style={{ animationDuration: '40s' }}>
              {[...applicantTestimonials, ...applicantTestimonials].map((t, idx) => (
                <div key={idx} className="flex flex-col h-full bg-[#e0f7fa] rounded-2xl shadow border border-[#b2ebf2] p-6 min-w-[320px] max-w-[320px]">
                  <div className="mb-3">
                    <svg className="w-7 h-7 text-[#087684]" fill="currentColor" viewBox="0 0 24 24"><path d="M7.17 6A5.001 5.001 0 002 11c0 2.21 1.79 4 4 4v3a1 1 0 001 1h3a1 1 0 001-1v-3c0-2.21-1.79-4-4-4a3 3 0 013-3h.17zM17.17 6A5.001 5.001 0 0012 11c0 2.21 1.79 4 4 4v3a1 1 0 001 1h3a1 1 0 001-1v-3c0-2.21-1.79-4-4-4a3 3 0 013-3h.17z" /></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-base leading-relaxed mb-4">{t.quote}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Row 2: Employees */}
          <div className="overflow-hidden w-full">
            <div className="flex gap-6 animate-marquee items-center" style={{ animationDuration: '50s', animationDirection: 'reverse' }}>
              {[...employeeTestimonials, ...employeeTestimonials].map((t, idx) => (
                <div key={idx} className="flex flex-col h-full bg-[#e0f7fa] rounded-2xl shadow border border-[#b2ebf2] p-6 min-w-[320px] max-w-[320px]">
                  <div className="mb-3">
                    <svg className="w-7 h-7 text-[#087684]" fill="currentColor" viewBox="0 0 24 24"><path d="M7.17 6A5.001 5.001 0 002 11c0 2.21 1.79 4 4 4v3a1 1 0 001 1h3a1 1 0 001-1v-3c0-2.21-1.79-4-4-4a3 3 0 013-3h.17zM17.17 6A5.001 5.001 0 0012 11c0 2.21 1.79 4 4 4v3a1 1 0 001 1h3a1 1 0 001-1v-3c0-2.21-1.79-4-4-4a3 3 0 013-3h.17z" /></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-base leading-relaxed mb-4">{t.quote}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation-name: marquee;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default HRTeamSection; 