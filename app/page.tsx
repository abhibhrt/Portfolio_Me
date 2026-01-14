import HomePage from './home/main.home';
import YouTubeShortsSection from './home/embed.home';
import AboutSection from './home/about.home'

const SHORT_IDS = [
  'RP-dHcdcJh4',
  '7LiQUfmYKkg',
  'PaBRTK8LOa0',
  'AB_Q0DhzO8s',
  'wFgBdj7aLAE',
  'TV1z60b9E30',
  'awkviHaVowE',
  'KknABu4SAmc',
  'SkrCBc0vY8g',
  'yPWM74Bxl2s',
  'CxwV8wILkaw',
  'kYlTMH2DWRY',
  'XA-gFL97q1g',
  'XvywuglUZ1k',
  'YrbWKil2gxw'
];

export default function Home() {
  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-purple-500 opacity-20 blur-3xl mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl mix-blend-multiply animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 h-72 w-72 rounded-full bg-cyan-500 opacity-20 blur-3xl mix-blend-multiply animate-pulse delay-500" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px]" />

      <HomePage />
      <YouTubeShortsSection shortIds={SHORT_IDS} />
      <AboutSection />
    </div>
  );
}
