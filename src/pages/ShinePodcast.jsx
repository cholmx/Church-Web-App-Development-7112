import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AudioPlayer from '../components/AudioPlayer';
import { SkeletonEpisode, LoadingTransition } from '../components/LoadingSkeletons';
import podcastRSSService from '../lib/podcastRSS';

const {FiMic,FiCalendar,FiHome,FiPlay,FiClock,FiRefreshCw,FiExternalLink}=FiIcons;

const ShinePodcast=()=> {
const [podcastData,setPodcastData]=useState({channel: null,episodes: []});
const [loading,setLoading]=useState(true);
const [selectedEpisode,setSelectedEpisode]=useState(null);

useEffect(()=> {
fetchPodcastData();
},[]);

const fetchPodcastData=async ()=> {
setLoading(true);
try {
const data=await podcastRSSService.getEpisodes();
setPodcastData(data);
} catch (error) {
console.error('Error fetching podcast data:',error);
} finally {
// Add minimum delay to show skeleton
setTimeout(() => setLoading(false), 800);
}
};

const formatDate=(dateString)=> {
if (!dateString) return '';
try {
const date=new Date(dateString);
return date.toLocaleDateString('en-US',{
year: 'numeric',
month: 'long',
day: 'numeric'
});
} catch (e) {
return '';
}
};

const stripHtml=(html)=> {
if (!html) return '';
const temp=document.createElement('div');
temp.innerHTML=html;
return temp.textContent || temp.innerText || '';
};

const truncateText=(text,maxLength=150)=> {
if (!text || text.length <=maxLength) return text;
return text.substr(0,maxLength).trim() + '...';
};

return (
<div className="min-h-screen bg-accent py-12 relative">
{/* Back to Home Button - Top Right */}
<div className="fixed top-6 right-6 z-50">
<Link
to="/"
className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
style={{backgroundColor: '#83A682'}}
title="Back to Home"
>
<SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
</Link>
</div>

<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Header */}
<div className="text-center mb-12">
<motion.div
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8}}
className="flex items-center justify-center space-x-4 mb-3"
>
<SafeIcon icon={FiMic} className="h-8 w-8 text-primary" />
<Link to="/" className="hover:text-primary transition-colors">
<h1 className="text-3xl md:text-4xl font-bold text-secondary font-inter">
Shine Podcast
</h1>
</Link>
</motion.div>
<motion.div
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8,delay: 0.2}}
className="flex items-center justify-center space-x-4"
>
<p className="text-lg text-secondary page-subtitle">
Listen to our latest podcast episodes
</p>
<button
onClick={fetchPodcastData}
className="p-2 text-primary hover:text-primary-dark transition-colors"
title="Refresh episodes"
>
<SafeIcon icon={FiRefreshCw} className="h-5 w-5" />
</button>
</motion.div>
</div>

{/* Episodes List with Loading */}
<LoadingTransition
isLoading={loading}
skeleton={
<div className="space-y-6">
<h2 className="text-2xl font-bold text-secondary font-inter">
Episodes
</h2>
{Array.from({ length: 5 }).map((_, i) => (
<SkeletonEpisode key={i} />
))}
</div>
}
>
{podcastData.episodes && podcastData.episodes.length > 0 && (
<div className="space-y-6">
<h2 className="text-2xl font-bold text-secondary font-inter">
Episodes ({podcastData.episodes.length})
</h2>
{podcastData.episodes.map((episode,index)=> (
<motion.div
key={episode.id}
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.5,delay: index * 0.1}}
className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
>
<div className="p-6">
<div className="flex items-start space-x-4">
{episode.image && (
<img
src={episode.image}
alt={episode.title}
className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
onError={(e)=> {
e.target.src='https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop';
}}
/>
)}
<div className="flex-1 min-w-0">
<div className="flex items-start justify-between mb-2">
<h3 className="text-lg font-semibold text-secondary font-inter">
{episode.title}
</h3>
{episode.audioUrl && (
<button
onClick={()=> setSelectedEpisode(episode)}
className="ml-4 bg-white text-primary border-2 border-primary p-2 rounded-full hover:bg-primary hover:text-white transition-colors flex-shrink-0"
title="Play episode"
>
<SafeIcon icon={FiPlay} className="h-4 w-4" />
</button>
)}
</div>
<div className="flex items-center space-x-4 text-sm text-secondary-light mb-3">
{episode.pubDate && (
<div className="flex items-center space-x-1">
<SafeIcon icon={FiCalendar} className="h-3 w-3" />
<span className="font-inter">{formatDate(episode.pubDate)}</span>
</div>
)}
{episode.duration && (
<div className="flex items-center space-x-1">
<SafeIcon icon={FiClock} className="h-3 w-3" />
<span className="font-inter">{episode.duration}</span>
</div>
)}
</div>
{episode.summary && (
<p className="text-secondary mb-4 font-inter">
{truncateText(stripHtml(episode.summary))}
</p>
)}
<div className="flex items-center space-x-4">
{episode.audioUrl ? (
<button
onClick={()=> setSelectedEpisode(episode)}
className="bg-white text-primary border-2 border-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiPlay} className="h-4 w-4" />
<span>Play Episode</span>
</button>
) : (
<div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-semibold inline-flex items-center space-x-2 font-inter">
<SafeIcon icon={FiPlay} className="h-4 w-4" />
<span>Audio Coming Soon</span>
</div>
)}
{episode.link && (
<a
href={episode.link}
target="_blank"
rel="noopener noreferrer"
className="bg-white text-primary border-2 border-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiExternalLink} className="h-4 w-4" />
<span>View Online</span>
</a>
)}
</div>
</div>
</div>
</div>
</motion.div>
))}
</div>
)}

{/* No Episodes State */}
{!loading && (!podcastData.episodes || podcastData.episodes.length===0) && (
<motion.div
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
className="bg-white rounded-lg shadow-md p-12 text-center"
>
<SafeIcon icon={FiMic} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
<h2 className="text-2xl font-bold text-secondary mb-2 font-inter">
No Episodes Available
</h2>
<p className="text-secondary-light font-inter">
Check back soon for new podcast episodes!
</p>
</motion.div>
)}
</LoadingTransition>
</div>

{/* Audio Player */}
<AnimatePresence>
{selectedEpisode && selectedEpisode.audioUrl && (
<AudioPlayer
episode={selectedEpisode}
onClose={()=> setSelectedEpisode(null)}
/>
)}
</AnimatePresence>
</div>
);
};

export default ShinePodcast;