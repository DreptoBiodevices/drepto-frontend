import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Instagram, Linkedin, Twitter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SOCIAL_MEDIA_EMBEDS } from '../constants';
import { SocialMediaPost } from '../types';

type PlatformFilter = 'all' | 'instagram' | 'linkedin' | 'twitter';

const platformMeta = {
    instagram: {
        label: 'Instagram',
        icon: Instagram,
        gradient: 'from-pink-500 via-purple-500 to-orange-400',
        bg: 'bg-gradient-to-br from-pink-50 to-purple-50',
        border: 'border-pink-200',
        text: 'text-pink-600',
    },
    linkedin: {
        label: 'LinkedIn',
        icon: Linkedin,
        gradient: 'from-blue-600 to-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
    },
    twitter: {
        label: 'Twitter / X',
        icon: Twitter,
        gradient: 'from-sky-400 to-sky-600',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        text: 'text-sky-600',
    },
};

const SocialMediaBlogPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<PlatformFilter>('all');
    const [posts, setPosts] = useState<SocialMediaPost[]>(SOCIAL_MEDIA_EMBEDS);

    const filteredPosts =
        activeFilter === 'all' ? posts : posts.filter((p) => p.platform === activeFilter);

    const filters: { key: PlatformFilter; label: string; icon?: React.FC<any> }[] = [
        { key: 'all', label: 'All Posts' },
        { key: 'instagram', label: 'Instagram', icon: Instagram },
        { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
        { key: 'twitter', label: 'Twitter', icon: Twitter },
    ];

    // Load platform embed scripts
    useEffect(() => {
        // Instagram embed
        if (!document.getElementById('instagram-embed-script')) {
            const igScript = document.createElement('script');
            igScript.id = 'instagram-embed-script';
            igScript.src = 'https://www.instagram.com/embed.js';
            igScript.async = true;
            document.body.appendChild(igScript);
        } else {
            (window as any).instgrm?.Embeds?.process();
        }

        // Twitter/X embed
        if (!document.getElementById('twitter-embed-script')) {
            const twScript = document.createElement('script');
            twScript.id = 'twitter-embed-script';
            twScript.src = 'https://platform.twitter.com/widgets.js';
            twScript.async = true;
            document.body.appendChild(twScript);
        } else {
            (window as any).twttr?.widgets?.load();
        }
    }, [activeFilter]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-28 pb-16 bg-gradient-to-br from-[#001a2c] via-[#002a3f] to-[#001a2c] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-32 right-20 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-1/2 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-teal-300/70 hover:text-teal-200 transition-colors mb-6 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold text-white font-display mb-4">
                        Social Media & Blog
                    </h1>
                    <p className="text-teal-200/70 max-w-xl mx-auto">
                        Stay updated with our latest posts, announcements, and behind-the-scenes content from across our social channels.
                    </p>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="container mx-auto px-6 -mt-6 relative z-20">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-2 overflow-x-auto">
                    {filters.map((f) => {
                        const Icon = f.icon;
                        return (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeFilter === f.key
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {f.label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Posts Grid */}
            <section className="container mx-auto px-6 py-12">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ExternalLink className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-600 mb-2">No posts found</h3>
                        <p className="text-gray-400 text-sm">
                            No {activeFilter !== 'all' ? activeFilter : ''} posts available yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post, index) => {
                            const meta = platformMeta[post.platform];
                            const PlatformIcon = meta.icon;

                            return (
                                <div
                                    key={index}
                                    className={`rounded-2xl border ${meta.border} ${meta.bg} overflow-hidden hover:shadow-lg transition-all duration-300 group`}
                                >
                                    {/* Platform Header */}
                                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100/50">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
                                                <PlatformIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className={`text-sm font-bold ${meta.text}`}>
                                                {meta.label}
                                            </span>
                                        </div>
                                        {post.date && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(post.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Caption */}
                                        {post.caption && (
                                            <p className="text-gray-700 text-sm font-medium mb-4 leading-relaxed">
                                                {post.caption}
                                            </p>
                                        )}

                                        {/* Embed Placeholder */}
                                        <div className="bg-white rounded-xl border border-gray-100 p-4 min-h-[200px] flex items-center justify-center">
                                            {post.platform === 'instagram' ? (
                                                <blockquote
                                                    className="instagram-media"
                                                    data-instgrm-permalink={post.embedUrl}
                                                    data-instgrm-version="14"
                                                    style={{ maxWidth: '100%', width: '100%' }}
                                                />
                                            ) : post.platform === 'twitter' ? (
                                                <blockquote className="twitter-tweet" data-theme="light">
                                                    <a href={post.embedUrl}>View Tweet</a>
                                                </blockquote>
                                            ) : post.platform === 'linkedin' ? (
                                                <iframe
                                                    src={post.embedUrl}
                                                    width="100%"
                                                    height="300"
                                                    frameBorder="0"
                                                    allowFullScreen
                                                    title="LinkedIn Post"
                                                    className="rounded-lg"
                                                />
                                            ) : null}
                                        </div>

                                        {/* View on Platform */}
                                        <a
                                            href={post.embedUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold ${meta.text} hover:opacity-70 transition-opacity`}
                                        >
                                            View on {meta.label}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default SocialMediaBlogPage;
