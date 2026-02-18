import React, { useState } from "react";
import {
  ChevronRight,
  Dumbbell,
  Users,
  Zap,
  Award,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
} from "lucide-react";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="fixed w-full bg-[#0a0a0a]/95 backdrop-blur-md z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="text-orange-500">HIGH</span>
          <span className="text-white"> FIT</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-orange-500">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`absolute md:static top-16 left-0 right-0 md:right-auto bg-[#0a0a0a] md:bg-transparent border-b md:border-b-0 border-white/10 md:border-0 ${isMenuOpen ? "block" : "hidden"} md:flex gap-8`}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 md:p-0">
            <a href="#about" className="text-white/80 hover:text-orange-500 transition">About</a>
            <a href="#programs" className="text-white/80 hover:text-orange-500 transition">Programs</a>
            <a href="#features" className="text-white/80 hover:text-orange-500 transition">Features</a>
            <a href="#contact" className="text-white/80 hover:text-orange-500 transition">Contact</a>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition">Join Now</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <span className="text-orange-500 text-sm font-medium">PREMIUM FITNESS EXPERIENCE</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-white leading-tight">
              Transform Your <span className="text-orange-500">Fitness</span> Journey
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Experience luxury fitness with state-of-the-art equipment, expert trainers, and a community dedicated to your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                Start Your Journey <ChevronRight size={20} />
              </button>
              <a href="#about" className="bg-white/5 border border-orange-500 text-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-500/10 transition text-center">
                Learn More
              </a>
            </div>
          </div>
          <div className="relative h-[450px]">
            <img 
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80" 
              alt="Gym Equipment" 
              className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-2xl shadow-orange-500/10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 border-t border-white/10 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">About HIGH FIT</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto italic">
            "We're proud to provide an amazing fitness experience with exceptional equipment and dedicated service"
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {/* تم استبدال المسار برابط يعمل فوراً */}
          <img 
            src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80" 
            alt="Facility" 
            className="w-full rounded-xl border border-white/10 grayscale hover:grayscale-0 transition duration-500"
          />
          <div className="flex flex-col justify-center gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 text-orange-500">Our Mission</h3>
              <p className="text-white/70 leading-relaxed">
                HIGH FIT Family is proud in giving our guests an amazing product with great experience. We endeavor to provide the best prices and customer care services.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 text-white/80">
                <MapPin className="text-orange-500 flex-shrink-0" size={24} />
                <div><p className="font-semibold">Location</p><p className="text-white/50 text-sm">8th Area, Aqaba, Jordan</p></div>
              </div>
              <div className="flex gap-4 text-white/80">
                <Phone className="text-orange-500 flex-shrink-0" size={24} />
                <div><p className="font-semibold">Phone</p><p className="text-white/50 text-sm">00962 32030088</p></div>
              </div>
              <div className="flex gap-4 text-white/80">
                <Mail className="text-orange-500 flex-shrink-0" size={24} />
                <div><p className="font-semibold">Email</p><p className="text-white/50 text-sm">info@highfit.com.jo</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


const features = [
  { icon: Dumbbell, title: "State-of-the-Art Equipment", description: "Latest fitness technology and premium equipment for all training levels" },
  { icon: Users, title: "Expert Trainers", description: "Certified professionals dedicated to your personal fitness goals" },
  { icon: Zap, title: "Dynamic Classes", description: "Variety of group classes led by experienced instructors" },
  { icon: Award, title: "Premium Facilities", description: "Luxurious amenities and comfortable environment" },
  { icon: Users, title: "Community Support", description: "Join a community of fitness enthusiasts and athletes" },
  { icon: Zap, title: "Personalized Plans", description: "Custom training and nutrition plans tailored to your needs" },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-white/5 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 text-white"><h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose HIGH FIT</h2></div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8 hover:border-orange-500 transition group">
              <div className="bg-orange-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 transition"><f.icon className="text-orange-500" size={28} /></div>
              <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-white/60 text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black py-16 px-4 text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
        <div><h3 className="text-2xl font-bold mb-4 text-orange-500">HIGH FIT</h3><p className="text-white/60">Premium fitness experience for everyone.</p></div>
        <div><h4 className="font-bold mb-6 underline decoration-orange-500 underline-offset-8 text-sm">Quick Links</h4>
          <ul className="space-y-3 text-white/50 text-sm"><li><a href="#about" className="hover:text-orange-500">About</a></li><li><a href="#features" className="hover:text-orange-500">Features</a></li><li><a href="#programs" className="hover:text-orange-500">Programs</a></li></ul>
        </div>
        <div><h4 className="font-bold mb-6 underline decoration-orange-500 underline-offset-8 text-sm">Contact</h4>
          <ul className="space-y-3 text-white/50 text-sm"><li>8th Area, Aqaba</li><li>00962 32030088</li><li>info@highfit.com.jo</li></ul>
        </div>
        <div><h4 className="font-bold mb-6 underline decoration-orange-500 underline-offset-8 text-sm">Hours</h4>
          <ul className="space-y-3 text-white/50 text-sm"><li>Mon-Fri: 6AM-10PM</li><li>Sat-Sun: 8AM-10PM</li></ul>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <NavBar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}