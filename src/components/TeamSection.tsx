import React from 'react';
import { Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image?: string;
  linkedin?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Rahul Kumar Gupta',
    role: 'Founder & Chief Executive Officer',
    description: 'IIT Bombay Alumnus & Biomedical Innovator. Driving transdermal therapeutic formulation and corporate strategy.',
    image: '/images/rahulsir.jpeg',
    linkedin: 'https://www.linkedin.com/in/rahul-kumar-gupta-4b8bb8190/',
  },
  {
    name: 'Prof. Rohit Srivastava',
    role: 'Scientific Advisor & Mentor',
    description: 'Professor, Dept of Biosciences & Bioengineering, IIT Bombay (Shanti Swarup Bhatnagar Awardee).',
    image: '/images/rohitsir.jpeg',
    linkedin: 'https://www.linkedin.com/in/rohit-srivastava-02bb2b16/',
  },
  {
    name: 'Dr. Chandan Yadav',
    role: 'Chief Medical Officer',
    description: 'Senior Radiologist, Medanta Hospital. Leading clinical evaluation and therapeutic protocols.',
    image: '/images/dr_chandan.jpg',
    linkedin: 'https://www.dreptobiodevices.com/',
  },
];

export const TeamSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#f8f9fa] border-t border-slate-200/80 scroll-mt-24" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <span>EXECUTIVE LEADERSHIP &amp; ADVISORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold sm:font-black text-slate-900 tracking-tight leading-tight font-display">
            The Scientific &amp; Strategic Minds Behind Drepto
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Combining world-class academic engineering from IIT Bombay with pharmaceutical industry leadership and clinical hospital expertise.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-[#ebedf1] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-300/90 shadow-2xs hover:shadow-md transition-all duration-300 w-full max-w-sm flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#c01226] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Member Portrait */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 font-display">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-[#c01226] uppercase tracking-wider mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {member.description}
                  </p>
                </div>
              </div>

              {/* LinkedIn / Bio Link */}
              {member.linkedin && (
                <div className="mt-6 pt-4 border-t border-slate-300/60 flex items-center justify-center">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#c01226] transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-[#c01226]" />
                    <span>View Professional Profile</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TeamSection;
