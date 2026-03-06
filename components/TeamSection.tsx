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
        role: 'Scientific Advisor, Mentor',
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
    </svg>
);

const TeamSection: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-teal-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Leadership</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-blue mb-6">Meet the Visionaries</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">The brilliant minds driving innovation at Drepto Biodevices.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard key={index} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
    return (
        <div className="group relative w-full max-w-xs">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center border border-white shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="mb-6 relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-slow"></div>
                </div>

                <h3 className="text-xl font-bold text-dark-blue mb-1 group-hover:text-primary transition-colors">{member.name}</h3>

                <p className="text-sm font-semibold text-teal-600 mb-3 uppercase tracking-wide">{member.role}</p>

                <div className="h-px w-12 bg-gray-300 my-4 group-hover:w-full group-hover:bg-teal-200 transition-all duration-500"></div>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{member.description}</p>

                <a href={member.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110">
                    <LinkedInIcon />
                </a>
            </div>
        </div>
    );
};

export default TeamSection;
