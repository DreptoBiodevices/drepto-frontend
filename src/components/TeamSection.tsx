import React from 'react';

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
    role: 'Founder & Director',
    description: 'M.Tech-PhD, IIT Bombay',
    image: '/images/rahulsir.jpeg',
    linkedin: 'https://www.linkedin.com/in/rahul-kumar-gupta-4b8bb8190/'
  },
  {
    name: 'Prof. Rohit Srivastava',
    role: 'Scientific Advisor & Mentor',
    description: 'Prof. IIT Bombay',
    image: '/images/rohitsir.jpeg',
    linkedin: 'https://www.linkedin.com/in/rohit-srivastava-02bb2b16/'
  },
  {
    name: 'Dr. Rupesh Ghyar',
    role: 'Technical Advisor',
    description: 'Alumnus, IIT Bombay',
    image: '/images/dr_rupesh.jpg',
    linkedin: 'https://www.linkedin.com/in/rupesh-ghyar-7510442b7/'
  },
  {
    name: 'Dr. Chandan Yadav',
    role: 'Medical Advisor',
    description: 'Senior Radiologist, Medanta Hospital',
    image: '/images/dr_chandan.jpg',
    linkedin: 'https://www.dreptobiodevices.com/'
  }
];

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
  </svg>
);

const TeamSection: React.FC = () => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* header — consistent with other sections */}
        <div className="border-t border-gray-100 pt-8 mb-20">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Leadership</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-none">
              The Team
            </h2>
            <p className="text-sm text-gray-400 hidden md:block">
              The minds behind Drepto Biodevices.
            </p>
          </div>
        </div>

        {/* team grid — portrait-first, no cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-gray-100">
          {teamMembers.map((member, index) => (
            <div key={index} className="group px-6 first:pl-0 last:pr-0">

              {/* photo — square crop, no border halo, no shadow */}
              <div className="overflow-hidden bg-gray-50 aspect-square mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* index number */}
              <p className="text-xs tabular-nums text-gray-300 mb-3">
                {String(index + 1).padStart(2, '0')}
              </p>

              {/* name */}
              <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">
                {member.name}
              </h3>

              {/* role */}
              <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">
                {member.role}
              </p>

              {/* credential */}
              <p className="text-xs text-gray-400 leading-relaxed mb-5">
                {member.description}
              </p>

              {/* linkedin — text link, no icon button blob */}
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors duration-200"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TeamSection;