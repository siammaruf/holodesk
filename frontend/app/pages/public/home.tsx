import { Link } from 'react-router-dom'
import { Code, Users, Video, Polygon, Sparkle, ArrowRight, Shield } from '@phosphor-icons/react'

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkle className="w-5 h-5 text-white" weight="fill" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              HoloDesk
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/signin"
              className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/signin"
              className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now in early access
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Your Virtual Space,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A fully customizable virtual environment with proximity-based video chat,
            tile-based movement, and real-time multiplayer networking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signin"
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
            >
              <Code className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Built from the ground up for immersive virtual collaboration and social experiences.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Video className="w-6 h-6 text-blue-400" weight="fill" />}
              title="Proximity Video Chat"
              description="Talk to people nearby with spatial audio and video that fades with distance."
            />
            <FeatureCard
              icon={<Polygon className="w-6 h-6 text-purple-400" weight="fill" />}
              title="Tile-Based Worlds"
              description="Build and customize your own spaces with an intuitive tile-based editor."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-pink-400" weight="fill" />}
              title="Multiplayer Networking"
              description="Real-time synchronization powered by Socket.io for seamless interaction."
            />
            <FeatureCard
              icon={<Sparkle className="w-6 h-6 text-amber-400" weight="fill" />}
              title="AI-Ready Architecture"
              description="Built with extensibility in mind for integrating AI agents and assistants."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-emerald-400" weight="fill" />}
              title="Secure by Default"
              description="JWT-based authentication with httpOnly cookies and role-based access."
            />
            <FeatureCard
              icon={<Code className="w-6 h-6 text-cyan-400" weight="fill" />}
              title="Open Source"
              description="Fully open source. Customize, extend, and deploy however you want."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to dive in?</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join the community and start building your own virtual spaces today.
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-gray-100 px-8 py-3.5 rounded-xl font-semibold transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            created by <span className="font-semibold text-gray-400">HoloDesk Team</span>
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              see the code
              <Code className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
