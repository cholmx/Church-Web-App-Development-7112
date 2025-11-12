import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {SkeletonGrid,LoadingTransition} from '../components/LoadingSkeletons';
import supabase from '../lib/supabase';

const {FiBell,FiPlay,FiMic,FiUsers,FiCreditCard,FiUserPlus,FiMail,FiCalendar,FiBookOpen,FiSettings,FiFacebook,FiInstagram,FiYoutube}=FiIcons;

const Home=()=> {
const [hasEvents,setHasEvents]=useState(false);
const [hasClasses,setHasClasses]=useState(false);
const [hasResources,setHasResources]=useState(false);
const [loading,setLoading]=useState(true);
const [logoError,setLogoError]=useState(false);

useEffect(()=> {
checkAvailability();
},[]);

const checkAvailability=async ()=> {
try {
// Check for events
const {data: events}=await supabase
.from('events_portal123')
.select('id')
.limit(1);

// Check for classes
const {data: classes}=await supabase
.from('classes_portal123')
.select('id')
.limit(1);

// Check for resources
const {data: resources}=await supabase
.from('resources_portal123')
.select('id')
.limit(1);

setHasEvents(events && events.length > 0);
setHasClasses(classes && classes.length > 0);
setHasResources(resources && resources.length > 0);
} catch (error) {
console.error('Error checking availability:',error);
} finally {
// Add a minimum delay to show skeleton
setTimeout(()=> setLoading(false),800);
}
};

const handleLogoError=()=> {
setLogoError(true);
};

// Featured buttons at the top (Classes and Events)
const featuredButtons=[
...(hasClasses ? [
{
title: 'Classes',
description: 'Available church classes',
icon: FiBookOpen,
path: '/class-registration',
},
] : []),
...(hasEvents ? [
{
title: 'Events',
description: 'Upcoming church events',
icon: FiCalendar,
path: '/event-registration',
},
] : []),
];

// Main buttons (including Contact for desktop)
const mainButtons=[
{
title: 'Announcements',
description: 'Latest church news and updates',
icon: FiBell,
path: '/announcements',
},
{
title: 'Sermon Blog',
description: 'Weekly sermons and discussion',
icon: FiPlay,
path: '/sermon-blog',
},
{
title: 'Shine Podcast',
description: 'Latest podcast episodes',
icon: FiMic,
path: '/shine-podcast',
},
{
title: 'Sermon Podcast',
description: 'Listen to our sermon recordings',
icon: FiPlay,
path: '/sermon-podcast',
},
{
title: 'Table Group Sign-Up',
description: 'Join a small group',
icon: FiUsers,
path: '/table-group-signup',
},
{
title: 'Give',
description: 'Online giving portal',
icon: FiCreditCard,
path: '/give',
},
// Conditionally include resources
...(hasResources ? [
{
title: 'Resources',
description: 'Books and helpful materials',
icon: FiBookOpen,
path: '/resources',
},
] : []),
{
title: 'Join Realm',
description: 'Become a member',
icon: FiUserPlus,
path: '/join-realm',
},
{
title: 'Contact',
description: 'Get in touch with us',
icon: FiMail,
path: '/contact',
},
];

// Mobile-only buttons (excluding Contact)
const mobileMainButtons=mainButtons.filter(button=> button.title !=='Contact');

// Contact button (separate for mobile centering)
const contactButton={
title: 'Contact',
description: 'Get in touch with us',
icon: FiMail,
path: '/contact',
};

const socialLinks=[
{
name: 'Facebook',
icon: FiFacebook,
url: 'https://www.facebook.com/urfellowship/',
hoverColor: 'hover:text-blue-600',
},
{
name: 'Instagram',
icon: FiInstagram,
url: 'https://www.instagram.com/urfellowship/',
hoverColor: 'hover:text-pink-600',
},
{
name: 'YouTube',
icon: FiYoutube,
url: 'https://www.youtube.com/c/TheUpperRoomFellowship',
hoverColor: 'hover:text-red-600',
},
];

// Custom skeleton for featured buttons (horizontal layout)
const FeaturedButtonsSkeleton=()=> (
<div className="mb-4 flex justify-center">
<div className="flex justify-center gap-4">
{Array.from({length: featuredButtons.length || 2}).map((_,i)=> (
<div
key={i}
className="animate-shimmer bg-gray-200 rounded-2xl shadow-soft featured-skeleton"
style={{
// Mobile: 160px x 120px, Desktop: 225px x 150px (matches actual buttons)
width: '160px',
height: '120px'
}}
>
<div className="p-4 flex flex-col items-center justify-center h-full">
<div className="w-6 h-6 bg-gray-300 rounded-full mb-2"></div>
<div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
<div className="h-2 bg-gray-300 rounded w-20"></div>
</div>
</div>
))}
</div>
</div>
);

// Custom skeleton for main buttons (matches actual layout)
const MainButtonsSkeleton=()=> (
<div className="mb-8 flex justify-center">
{/* Desktop: 3x3 Grid */}
<div className="hidden md:grid md:grid-cols-3 gap-4">
{Array.from({length: 9}).map((_,i)=> (
<div
key={i}
className="animate-shimmer bg-gray-200 rounded-2xl shadow-soft"
style={{
width: '225px',
height: '150px'
}}
>
<div className="p-7 flex flex-col items-center justify-center h-full">
<div className="w-7 h-7 bg-gray-300 rounded-full mb-3"></div>
<div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
<div className="h-2 bg-gray-300 rounded w-24"></div>
</div>
</div>
))}
</div>

{/* Mobile: 2 columns */}
<div className="grid grid-cols-2 md:hidden gap-3">
{Array.from({length: 8}).map((_,i)=> (
<div
key={i}
className="animate-shimmer bg-gray-200 rounded-2xl shadow-soft"
style={{
width: '160px',
height: '120px'
}}
>
<div className="p-4 flex flex-col items-center justify-center h-full">
<div className="w-5 h-5 bg-gray-300 rounded-full mb-2"></div>
<div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
<div className="h-2 bg-gray-300 rounded w-20"></div>
</div>
</div>
))}
</div>
</div>
);

// Contact button skeleton for mobile
const ContactButtonSkeleton=()=> (
<div className="flex justify-center mt-4 md:hidden">
<div
className="animate-shimmer bg-gray-200 rounded-2xl shadow-soft"
style={{
width: '160px',
height: '120px'
}}
>
<div className="p-4 flex flex-col items-center justify-center h-full">
<div className="w-5 h-5 bg-gray-300 rounded-full mb-2"></div>
<div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
<div className="h-2 bg-gray-300 rounded w-20"></div>
</div>
</div>
</div>
);

return (
<div className="min-h-screen py-12" style={{backgroundColor: '#fcfaf2'}}>
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

{/* Header */}
<div className="text-center mb-8">
<motion.div
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8}}
className="flex flex-col items-center justify-center"
>
{/* Desktop: Circle Logo,Title and Social Icons */}
<div className="hidden md:flex md:items-center md:justify-center md:space-x-8 mb-4">
{/* Circle Logo with URF */}
<div
className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-soft"
style={{backgroundColor: '#83A682'}}
>
<span
className="text-white text-sm font-bold"
style={{fontFamily: 'Inter Tight,sans-serif'}}
>
URF
</span>
</div>

{/* Title and Subtitle Container */}
<div className="flex flex-col items-start">
<h1
className="text-2xl md:text-3xl font-bold text-secondary text-left"
style={{fontFamily: 'Inter Tight,sans-serif'}}
>
Upper Room Fellowship
</h1>
<p
className="text-sm text-secondary text-left mt-1"
style={{fontFamily: 'Inter,sans-serif',fontWeight: '400'}}
>
Your hub for church life
</p>
</div>

{/* Social Media Icons - Desktop Only */}
<div className="flex space-x-4">
{socialLinks.map((social,index)=> (
<motion.a
key={social.name}
href={social.url}
target="_blank"
rel="noopener noreferrer"
initial={{opacity: 0,scale: 0.8}}
animate={{opacity: 1,scale: 1}}
transition={{duration: 0.5,delay: 0.4 + index * 0.1}}
className="text-social-green hover:text-secondary transition-all duration-300 hover:scale-110"
title={`Follow us on ${social.name}`}
>
<SafeIcon icon={social.icon} className="h-7 w-7" />
</motion.a>
))}
</div>
</div>

{/* Mobile: Circle Logo and Title */}
<div className="md:hidden flex items-center justify-center space-x-4 mb-2">
{/* Circle Logo with URF */}
<div
className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-soft"
style={{backgroundColor: '#83A682'}}
>
<span
className="text-white text-xs font-bold"
style={{fontFamily: 'Inter Tight,sans-serif'}}
>
URF
</span>
</div>
<div className="flex flex-col items-start">
<h1
className="text-2xl font-bold text-secondary text-left"
style={{fontFamily: 'Inter Tight,sans-serif'}}
>
Upper Room Fellowship
</h1>
<p
className="text-sm text-secondary text-left mt-1"
style={{fontFamily: 'Inter,sans-serif',fontWeight: '400'}}
>
Your hub for church life
</p>
</div>
</div>
</motion.div>
</div>

{/* Social Media Icons - Mobile Only */}
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8,delay: 0.3}}
className="flex md:hidden justify-center space-x-6 mb-12"
>
{socialLinks.map((social,index)=> (
<motion.a
key={social.name}
href={social.url}
target="_blank"
rel="noopener noreferrer"
initial={{opacity: 0,scale: 0.8}}
animate={{opacity: 1,scale: 1}}
transition={{duration: 0.5,delay: 0.4 + index * 0.1}}
className="text-social-green hover:text-secondary transition-all duration-300 hover:scale-110"
title={`Follow us on ${social.name}`}
>
<SafeIcon icon={social.icon} className="h-9 w-9" />
</motion.a>
))}
</motion.div>

{/* FEATURED SECTION - Classes and Events with Loading */}
{loading ? (
<FeaturedButtonsSkeleton />
) : (
featuredButtons.length > 0 && (
<div className="mb-4 flex justify-center">
{/* Center the featured buttons */}
<div className="flex justify-center gap-4">
{featuredButtons.map((button,index)=> (
<motion.div
key={`featured-${button.title}-${index}`}
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.6,delay: 0.5 + index * 0.1}}
>
<Link
to={button.path}
className="relative overflow-hidden text-white p-4 md:p-7 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-500 hover:scale-105 block text-center group border border-transparent flex flex-col justify-center items-center featured-button hover-scale"
style={{
background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',
width: '160px',
height: '120px'
}}
>
{/* Blue overlay for hover effect */}
<div
className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
style={{
background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',
}}
></div>

{/* Content */}
<div className="relative z-10">
<SafeIcon
icon={button.icon}
className="h-5 w-5 md:h-7 md:w-7 mx-auto mb-2 md:mb-3 text-white group-hover:text-yellow-400 group-hover:scale-125 transition-all duration-500"
/>
<h3 className="text-xs md:text-sm font-bold mb-1 text-white font-inter leading-tight">
{button.title}
</h3>
<p className="text-xs text-white group-hover:text-white font-inter opacity-90 leading-tight">
{button.description}
</p>
</div>
</Link>
</motion.div>
))}
</div>
</div>
)
)}

{/* MAIN BUTTONS SECTION with Loading */}
{loading ? (
<>
<MainButtonsSkeleton />
<ContactButtonSkeleton />
</>
) : (
<>
<div className="mb-8 flex justify-center">
{/* Desktop: 3x3 Grid with Contact included */}
<div className="hidden md:grid md:grid-cols-3 gap-4">
{mainButtons.map((button,index)=> (
<motion.div
key={`desktop-button-${button.title}-${index}`}
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.5,delay: 0.7 + index * 0.05}}
>
<Link
to={button.path}
className="relative overflow-hidden text-white p-7 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-500 hover:scale-105 block text-center group border border-transparent flex flex-col justify-center items-center hover-scale ripple"
style={{
background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',
width: '225px',
height: '150px'
}}
>
{/* Gradient overlay for hover effect */}
<div
className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
style={{
background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',
}}
></div>

{/* Content */}
<div className="relative z-10">
<SafeIcon
icon={button.icon}
className="h-7 w-7 mx-auto mb-3 text-yellow-400 group-hover:text-white group-hover:scale-125 transition-all duration-500"
/>
<h3 className="text-sm font-bold mb-1 text-white font-inter leading-tight">
{button.title}
</h3>
<p className="text-xs text-gray-200 group-hover:text-white font-inter opacity-80 leading-tight">
{button.description}
</p>
</div>
</Link>
</motion.div>
))}
</div>

{/* Mobile: 2 columns WITHOUT Contact */}
<div className="grid grid-cols-2 md:hidden gap-3">
{mobileMainButtons.map((button,index)=> (
<motion.div
key={`mobile-button-${button.title}-${index}`}
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.5,delay: 0.7 + index * 0.05}}
>
<Link
to={button.path}
className="relative overflow-hidden text-white p-4 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-500 hover:scale-105 block text-center group border border-transparent flex flex-col justify-center items-center hover-scale ripple"
style={{
background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',
width: '160px',
height: '120px'
}}
>
{/* Gradient overlay for hover effect */}
<div
className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
style={{
background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',
}}
></div>

{/* Content */}
<div className="relative z-10">
<SafeIcon
icon={button.icon}
className="h-5 w-5 mx-auto mb-2 text-yellow-400 group-hover:text-white group-hover:scale-125 transition-all duration-500"
/>
<h3 className="text-xs font-bold mb-1 text-white font-inter leading-tight">
{button.title}
</h3>
<p className="text-xs text-gray-200 group-hover:text-white font-inter opacity-80 leading-tight">
{button.description}
</p>
</div>
</Link>
</motion.div>
))}
</div>
</div>

{/* MOBILE ONLY: Contact button centered below main grid */}
<div className="flex justify-center mt-4 md:hidden">
<motion.div
key="mobile-contact-button"
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.5,delay: 0.7 + mobileMainButtons.length * 0.05}}
>
<Link
to={contactButton.path}
className="relative overflow-hidden text-white p-4 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-500 hover:scale-105 block text-center group border border-transparent flex flex-col justify-center items-center hover-scale ripple"
style={{
background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',
width: '160px',
height: '120px'
}}
>
{/* Gradient overlay for hover effect */}
<div
className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
style={{
background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',
}}
></div>

{/* Content */}
<div className="relative z-10">
<SafeIcon
icon={contactButton.icon}
className="h-5 w-5 mx-auto mb-2 text-yellow-400 group-hover:text-white group-hover:scale-125 transition-all duration-500"
/>
<h3 className="text-xs font-bold mb-1 text-white font-inter leading-tight">
{contactButton.title}
</h3>
<p className="text-xs text-gray-200 group-hover:text-white font-inter opacity-80 leading-tight">
{contactButton.description}
</p>
</div>
</Link>
</motion.div>
</div>
</>
)}

{/* Admin Link */}
<motion.div
initial={{opacity: 0,y: 30}}
animate={{opacity: 1,y: 0}}
transition={{duration: 0.8,delay: 1.2}}
className="mt-16 text-center"
>
<Link
to="/admin"
className="inline-flex items-center space-x-2 text-base text-secondary-light hover:text-secondary transition-all duration-300 hover:scale-105 group"
>
<SafeIcon icon={FiSettings} className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
<span>Admin</span>
</Link>
</motion.div>

</div>

{/* CSS for responsive featured buttons */}
<style jsx>{`
/* Featured button responsive sizing */
@media (min-width: 768px) {
.featured-button {
width: 225px !important;
height: 150px !important;
}
.featured-skeleton {
width: 225px !important;
height: 150px !important;
}
}

/* Ensure mobile sizing is consistent */
@media (max-width: 767px) {
.featured-button,
.featured-skeleton {
width: 160px !important;
height: 120px !important;
}
}
`}</style>

</div>
);
};

export default Home;
