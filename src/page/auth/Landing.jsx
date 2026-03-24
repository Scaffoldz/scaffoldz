import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-background text-gray-800 font-sans">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-gray-200">
        <Link to="/"><img src="/scaffoldz-logo.png" alt="Scaffoldz Logo" className="h-12 w-auto object-contain drop-shadow-sm" /></Link>
        <div className="space-x-4">
          <Link to="/login" className="px-5 py-2 text-primary font-semibold hover:text-primary/80 transition-colors">Login</Link>
          <Link to="/login" className="px-5 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition-transform active:scale-95">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl font-extrabold text-primary leading-tight">
            Construction Project Transparency <br /> & Collaboration Platform
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Connecting Customers, Managing Contractors, and Monitoring Projects.
            Experience complete budget and progress transparency with our digital workflow solution.
          </p>
          <div className="pt-8">
            <Link to="/login" className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-lg shadow-md hover:bg-primary/90 transition-all">
              Start Your Project
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-8 py-16 bg-background border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">Why Scaffoldz?</h2>
          <p className="text-gray-600 leading-relaxed">
            Construction projects often suffer from delays, budget overruns, and lack of communication.
            Scaffoldz solves this by providing a unified platform for accountability and real-time updates.
            We bring digital precision to the construction site.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="px-8 py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="p-8 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-bold text-primary mb-3">Project Monitoring</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Track detailed milestones, view 3D models, and receive daily reports directly from the site.
            </p>
          </div>

          <div className="p-8 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-bold text-primary mb-3">Contractor Collaboration</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Streamline communication, manage bids, and oversee workforce attendance and performance.
            </p>
          </div>

          <div className="p-8 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-bold text-primary mb-3">Financial Transparency</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Monitor budgets in real-time, approve quotations, and track every payment transaction securely.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 text-center text-sm opacity-90">
        <p>&copy; 2026 Scaffoldz Inc. All rights reserved.</p>
        <div className="space-x-4 mt-4 text-white/60">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
