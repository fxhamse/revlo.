// app/page.tsx - Revlo Home Page (Left Aligned, 1000% Enhanced Design & Features)
import Link from 'next/link';
import React from 'react';
import {
  Briefcase, DollarSign, Warehouse, Users, Truck, LineChart, Zap, LayoutDashboard, Coins, ChevronRight, ShieldCheck,
  Award, RefreshCw, Smartphone, Cloud, Bell, Mail, MapPin, Phone, MessageSquare, Plus, CheckCircle,
  Code,  // New icon for API Access
  Palette, // New icon for Customization
  Globe, // New icon for Multi-language
  Cpu, // New icon for AI Assistant
  ReceiptText, // New icon for OCR/Receipt Scan
  Clock, // New icon for Time Tracking
  ClipboardCopy, // New icon for Bulk Entry
  CreditCard, // New icon for Payment Schedule
  FileText, // New icon for Debt Repayment
  HandPlatter, // New icon for Vendors/Suppliers
  CalendarCheck, // New icon for Recurring Expenses
  Activity, // New icon for User Access Logs
  Database, // New icon for Backup/Restore
} from 'lucide-react'; // Imports all necessary icons from Lucide React

// --- Custom Components for Reusability and Cleanliness ---

// Feature Card Component (Enhanced with hover effect)
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number }> = ({ icon, title, description, delay }) => (
  <div
    className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-lightGray dark:border-gray-700 
               flex flex-col items-center text-center transform hover:scale-105 transition-all duration-500 group 
               overflow-hidden animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
    <div className={`relative text-6xl text-primary dark:text-secondary mb-6 group-hover:text-white transition-colors duration-300 z-10`}>
      {icon}
    </div>
    <h4 className="relative text-3xl font-extrabold text-darkGray dark:text-gray-100 mb-4 z-10">{title}</h4>
    <p className="relative text-lg text-mediumGray dark:text-gray-300 leading-relaxed z-10">{description}</p>
  </div>
);

// Step Card Component (Enhanced with subtle hover effect)
const StepCard: React.FC<{ step: number; title: string; description: string; bgColor: string; delay: number }> = ({ step, title, description, bgColor, delay }) => (
  <div 
    className="relative p-8 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-lightGray dark:border-gray-700 
               transform hover:-translate-y-2 transition-transform duration-500 animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`absolute -top-6 ${bgColor} text-white text-3xl font-bold w-16 h-16 rounded-full flex items-center justify-center border-4 border-lightGray dark:border-gray-700 shadow-lg`}>
      {step}
    </div>
    <h4 className="text-2xl font-bold text-darkGray dark:text-gray-100 mt-8 mb-4">{title}</h4>
    <p className="text-lg text-mediumGray dark:text-gray-300 leading-relaxed">{description}</p>
  </div>
);

// Testimonial Card Component (Enhanced with subtle hover effect)
const TestimonialCard: React.FC<{ text: string; name: string; role: string; delay: number }> = ({ text, name, role, delay }) => (
  <div 
    className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-lightGray dark:border-gray-700 text-center 
               transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <p className="text-xl italic text-mediumGray dark:text-gray-300 mb-6 leading-relaxed">
      "{text}"
    </p>
    <p className="text-lg font-bold text-darkGray dark:text-gray-100">{name}</p>
    <p className="text-md text-mediumGray dark:text-gray-300">{role}</p>
  </div>
);

// New: Value Proposition Card (for Solutions Section)
const ValuePropCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transform hover:shadow-lg transition-shadow duration-300">
    <div className="text-primary dark:text-secondary flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h4 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-1">{title}</h4>
      <p className="text-mediumGray dark:text-gray-300">{description}</p>
    </div>
  </div>
);

// --- Main Page Component ---
export default function HomePage() {
  return (
    <div className="min-h-screen bg-lightGray dark:bg-gray-900 text-darkGray dark:text-gray-200 flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-lg py-4 px-8 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-4xl font-extrabold tracking-wide text-darkGray dark:text-gray-100">
          Revl<span className="text-secondary">o</span>
        </h1>
        <nav className="hidden md:flex space-x-6 items-center"> {/* Hidden on mobile */}
          {['Features', 'How It Works', 'Solutions', 'Pricing', 'Testimonials', 'Contact Us'].map((text, i) => (
            <a key={i} href={`#${text.toLowerCase().replace(/ /g, '-')}`} className="text-darkGray dark:text-gray-200 hover:text-primary transition-colors duration-200 font-medium text-lg">
              {text}
            </a>
          ))}
          <Link href="/signup" className="bg-primary text-white py-2.5 px-6 rounded-full font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md">
            Sign Up
          </Link>
          <Link href="/login" className="border-2 border-primary text-primary dark:text-white py-2.5 px-6 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition duration-200">
            Log In
          </Link>
        </nav>
        {/* Mobile Menu Icon (Hamburger) - Needs actual implementation */}
        <div className="md:hidden">
          <button className="text-darkGray dark:text-gray-100 text-3xl">☰</button>
        </div>
      </header>

      {/* Hero Section - LEFT ALIGNED */}
      <section className="relative flex items-center py-32 px-6 md:px-16 bg-gradient-to-br from-primary to-blue-500 text-white overflow-hidden shadow-2xl">
        <div className="max-w-7xl mx-auto z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Text Content - Left Aligned */}
          <div className="text-left animate-fade-in-left">
            <h2 className="text-5xl md:text-7xl font-extrabold leading-tight mb-7 drop-shadow-xl">
              Maamul Ganacsigaaga,<br />
              <span className="text-secondary">Kobci Mustaqbalkaaga</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-xl">
              Revlo waa nidaam ERP ah oo loogu talagalay shirkadaha yaryar iyo kuwa dhexe. Wuxuu kaa caawinayaa inaad si hufan u maamusho mashaariicda, kharashaadka, bakhaarka, iyo macaamiisha.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/signup" className="bg-secondary text-white py-4 px-10 rounded-full text-xl font-extrabold hover:bg-green-600 transition-all duration-300 shadow-xl transform hover:scale-105 flex items-center justify-center">
                Bilaaw Bilaash <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/login" className="border-2 border-white text-white py-4 px-10 rounded-full text-xl font-extrabold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                Log In
              </Link>
            </div>
          </div>
          
          {/* Image/Mockup - Right Side */}
          <div className="flex justify-center md:justify-end animate-fade-in-right">
            {/* Hubi in Sawirka uu ku jiro public/images/hero-dashboard-preview.svg */}
            <img src="/images/hero-dashboard-preview.svg" alt="Revlo ERP Dashboard Preview" className="w-full max-w-lg rounded-xl shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-bounce-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-bounce-fast"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-accent rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-bounce-slowest"></div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 px-6 md:px-16 bg-lightGray dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-darkGray dark:text-gray-100">Qiimaha Revlo Kuu Siiyo</h3>
          <p className="text-lg md:text-xl text-mediumGray dark:text-gray-400 max-w-3xl mx-auto">
            Qalabka muhiimka ah ee aad u baahan tahay hal meel, si aad ganacsigaaga u kobciso una qaado heerka xiga.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          <FeatureCard
            icon={<Briefcase />}
            title="Maamulka Mashruuca"
            description="Qorshee oo la soco mashaariicda Kanban & timeline muuqda. Maamul hawlaha, ilaha, iyo jadwalka si hufan."
            delay={0}
          />
          <FeatureCard
            icon={<DollarSign />}
            title="Maamulka Kharashaadka"
            description="Diiwaan geli kharashaadka, isticmaal OCR rasiidka, xisaabi otomaatig. Hel aragti ku saabsan lacagtaada iyo miisaaniyadda."
            delay={100}
          />
          <FeatureCard
            icon={<Warehouse />}
            title="Maamulka Bakhaarka"
            description="Si hufan ula socod alaabtaada, isticmaalkeeda mashruuca, iyo heerarka stock-ga. Hel digniino markay alaabtu dhammaato."
            delay={200}
          />
          <FeatureCard
            icon={<Users />}
            title="Maamulka Macaamiisha"
            description="Diiwaan geli macaamiishaada, la socod taariikhdooda, iyo mashaariicda ay kula leeyihiin. Dib u eeg lacag-bixinta iyo xiriirka."
            delay={300}
          />
          <FeatureCard
            icon={<Truck />}
            title="Maamulka Iibiyayaasha"
            description="Maamulka qandaraasleyaasha iyo waxyaabaha aad ka iibsatay. La soco waxqabadkooda iyo taariikhda lacag-bixinta."
            delay={400}
          />
          <FeatureCard
            icon={<LineChart />}
            title="Warbixino & Falanqayn"
            description="Warbixino faahfaahsan oo ku saleysan xogtaada, oo ay ku jiraan shaxanyo muuqaal ah iyo filter-yo horumarsan. Ka gaar go'aano xog ku salaysan."
            delay={500}
          />
        </div>
      </section>

      {/* Solutions Section - NEW */}
      <section id="solutions" className="py-24 px-6 md:px-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-darkGray dark:text-gray-100">Xalka Gaarka ah ee Revlo Bixiyo</h3>
          <p className="text-lg md:text-xl text-mediumGray dark:text-gray-400 max-w-3xl mx-auto">
            Revlo wuxuu bixiyaa qalab casri ah oo u sahlaya ganacsigaaga inuu noqdo mid hufan oo toosan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ValuePropCard 
            icon={<Cpu className="w-8 h-8" />} 
            title="AI-Powered Insights" 
            description="Isticmaal caawiyaha AI si aad u hesho aragtiyo degdeg ah oo ku saabsan xogtaada, iyo inaad ku galiso xogta cod." 
          />
          <ValuePropCard 
            icon={<ReceiptText className="w-8 h-8" />} 
            title="Scan & Auto-Fill Receipts" 
            description="Si degdeg ah ugu shubo rasiidyada. OCR wuxuu akhrin doonaa macluumaadka oo wuxuu si toos ah u buuxin doonaa foomamka kharashyada." 
          />
          <ValuePropCard 
            icon={<ClipboardCopy className="w-8 h-8" />} 
            title="Bulk Data Entry" 
            description="Gelinta kharashaad badan ama alaab hal mar adigoo isticmaalaya templates CSV ah, waqti badan baastay." 
          />
          <ValuePropCard 
            icon={<Clock className="w-8 h-8" />} 
            title="Time Tracking" 
            description="La socod saacadaha shaqada ee mashruuc kasta, si aad si sax ah ugu xisaabiso kharashka shaqaalaha." 
          />
          <ValuePropCard 
            icon={<Cloud className="w-8 h-8" />} 
            title="Offline Mode (PWA)" 
            description="Sii wad shaqada xitaa haddii internetku maqan yahay. Xogtaada si toos ah ayey iskugu shuban doontaa marka aad online timaado." 
          />
          <ValuePropCard 
            icon={<Palette className="w-8 h-8" />} 
            title="Customizable Interface" 
            description="U habayso interface-ka Revlo si ay ugu dhigmaan astaanta shirkaddaada iyo dookhaaga shakhsi ahaaneed." 
          />
           <ValuePropCard 
            icon={<Award className="w-8 h-8" />} 
            title="Expense Approval Workflow" 
            description="Maamul kharashyada u baahan ansixinta maamulaha, oo hubi in xisaabaadkaagu ay sax yihiin." 
          />
           <ValuePropCard 
            icon={<CreditCard className="w-8 h-8" />} 
            title="Payment Schedule Tracking" 
            description="La socod lacagaha laguugu leeyahay iyo kuwa kaa maqan, oo hel xasuusin marka ay lacagtu timaado." 
          />
           <ValuePropCard 
            icon={<CalendarCheck className="w-8 h-8" />} 
            title="Recurring Expenses Management" 
            description="Deji kharashyada soo noqnoqda si ay si toos ah isu diiwaan geliyaan bil kasta." 
          />
        </div>
      </section>


      {/* Mobile App Section */}
      <section id="mobile-app" className="py-24 px-6 md:px-16 bg-lightGray dark:bg-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-darkGray dark:text-gray-100">Revlo Mobile: Maamul Goobta Kasta</h3>
            <p className="text-lg md:text-xl text-mediumGray dark:text-gray-400 mb-8 leading-relaxed">
              Qaado Revlo jeebkaaga! App-ka moobilka ee sahlan wuxuu kuu oggolaanayaa inaad geliso kharashyada, la socoto mashaariicda, oo aad gasho macluumaadka muhiimka ah meel kasta oo aad joogto, xitaa marka aysan jirin internet.
            </p>
            <ul className="space-y-4 text-lg text-darkGray dark:text-gray-200 mb-8">
              <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-secondary" /><span>Gelinta Kharashyada Degdeg ah (Scan Receipt)</span></li>
              <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-secondary" /><span>La Socodka Horumarka Mashruuca</span></li>
              <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-secondary" /><span>Galitaanka Xogta Offline</span></li>
              <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-secondary" /><span>Aragtiyo degdeg ah (Quick Insights)</span></li> {/* New mobile feature */}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link href="#" className="bg-darkGray dark:bg-gray-700 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 shadow-md flex items-center">
                <Smartphone className="mr-2" /> App Store
              </Link>
              <Link href="#" className="bg-darkGray dark:bg-gray-700 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 shadow-md flex items-center">
                <Award className="mr-2" /> Google Play
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end animate-fade-in-right"> {/* Adjusted for right alignment on desktop */}
            {/* Placeholder for mobile app screenshot */}
            <img src="/images/mobile-app-preview.png" alt="Revlo Mobile App" className="w-80 md:w-96 rounded-xl shadow-2xl border-4 border-white dark:border-gray-700 transform rotate-3 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Pricing Section (Consider moving to a dedicated page later) */}
      <section id="pricing" className="py-24 px-6 md:px-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-darkGray dark:text-gray-100">Qiimaha Xubinimada</h3>
          <p className="text-lg md:text-xl text-mediumGray dark:text-gray-400 max-w-3xl mx-auto">Dooro qorshaha ku habboon baahida ganacsigaaga. Bilaw bilaash, oo mar walba kor u qaad.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: 'Basic', price: 'Free', features: ['1 User', '10 Projects', '50 Kharash', 'Maamulka Bakhaarka (50 shay)'], featured: false, delay: 0 },
            { name: 'Business', price: '$29/mo', features: ['5 Users', 'Unlimited Projects', 'Unlimited Kharash', 'Maamulka Bakhaarka (Unlimited)', 'Warbixino horumarsan', 'Taageero mudnaan leh', 'OCR Rasiidka'], featured: true, delay: 100 },
            { name: 'Enterprise', price: 'Custom', features: ['Unlimited Users', 'Dhammaan features-ka Business', 'Maamule u gaar ah', 'Isku-dhexgalka API', 'Talo bixin shakhsi ah'], featured: false, delay: 200 },
          ].map((plan, i) => (
                <div key={i} className={`p-8 rounded-xl shadow-2xl border text-center transform hover:scale-105 transition duration-300 animate-fade-in-up ${plan.featured ? 'border-primary bg-primary/10' : 'border-lightGray dark:border-gray-700'}`} style={{ animationDelay: `${plan.delay}ms` }}>
                  <h4 className="text-2xl font-bold mb-4 text-darkGray dark:text-gray-100">{plan.name}</h4>
                  <p className="text-4xl font-extrabold mb-6 text-darkGray dark:text-gray-100">{plan.price}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, idx) => <li key={idx} className="text-mediumGray dark:text-gray-300">{f}</li>)}
                  </ul>
                  <Link href="/signup" className={`inline-block py-3 px-8 rounded-full font-semibold ${plan.featured ? 'bg-secondary text-white hover:bg-green-600' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}>
                    {plan.featured ? 'Start Free Trial' : 'Choose Plan'}
                  </Link>
                </div>
              ))}
        </div>
      </section>

      {/* Trusted Clients */}
      <section className="py-24 px-6 md:px-16 bg-lightGray dark:bg-gray-900 text-center">
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-4xl font-bold mb-4 text-darkGray dark:text-gray-100">Kuwo Naga Kalsoon</h3>
          <p className="text-lg md:text-xl text-mediumGray dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Kumanaan ganacsi ayaa maalin walba ku kalsoon Revlo si ay u maamulaan hawlahooda muhiimka ah.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
            {/* Replace with real logos - use actual img tags with local paths */}
            {['Client A', 'Client B', 'Client C', 'Client D', 'Client E', 'Client F'].map((c, i) => (
              <div key={i} className="w-32 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-lg">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 md:px-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-darkGray dark:text-gray-100">Waxa Ay Dadku Ka Dhahaan Revlo</h3>
          <p className="text-lg md:text-xl text-mediumGray dark:text-gray-400 max-w-3xl mx-auto">
            Halkaan ka ogoow sababta Revlo uu u yahay doorashada koowaad ee ganacsato badan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          <TestimonialCard text="Revlo wuxuu si buuxda u bedelay sida aan u maamulo mashruucyadayda furniture-ka. Hufnaanta iyo fududeynta ayaa ah mid aan caadi ahayn!" name="Axmed Maxamed" role="Maamulaha, X‑Furniture" delay={0} />
          <TestimonialCard text="Maamulka kharashaadku waligiis ma ahayn mid sidan u fudud. Hawl yar iyo waqti badan oo aan ganacsigayga ku kobciyo." name="Faadumo Cali" role="Qandiraasle, Y‑Construction" delay={100} />
          <TestimonialCard text="Qaybta bakhaarka waa mid aan laga maarmin. Waxaan hadda ka warqabaa wax kasta oo ku jira bakhaarkayga waqti kasta." name="Nuur Xassan" role="Ganacsade, Z‑Hardware" delay={200} />
        </div>
      </section>

      {/* Call to Action */}
      <section id="contact" className="py-24 px-6 md:px-16 bg-gradient-to-tr from-blue-700 to-primary text-white text-center">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Diyaar Ma U Tahay inaad Ganacsigaaga Kobciso?</h3>
          <p className="text-lg md:text-2xl mb-10 opacity-90 max-w-4xl mx-auto">
            Ku soo biir boqolaal ganacsi oo kale oo ku kalsoon Revlo si ay u maamulaan hawlahooda maalinlaha ah, oo aad si buuxda u xakameyso ganacsigaaga.
          </p>
          <Link href="/signup" className="bg-white text-primary py-4 px-12 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105">
            Bilaaw Bilaashkaaga
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darkGray dark:bg-gray-900 text-white py-12 px-6 md:px-16 text-center border-t border-gray-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h4 className="text-3xl font-bold mb-4">Revlo<span className="text-secondary">.</span></h4>
            <p className="text-mediumGray dark:text-gray-400 leading-relaxed">Maamulka Ganacsigaaga oo Fudud, hufan, oo casri ah.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Links Degdeg ah</h4>
            <ul className="space-y-2 text-mediumGray dark:text-gray-400">
              <li><Link href="#features" className="hover:text-primary transition">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary transition">Sida uu u Shaqeeyo</Link></li>
              <li><Link href="#solutions" className="hover:text-primary transition">Xalka</Link></li> {/* New Link */}
              <li><Link href="#pricing" className="hover:text-primary transition">Qiimaha</Link></li> {/* New Link */}
              <li><Link href="#testimonials" className="hover:text-primary transition">Testimonials</Link></li>
              <li><Link href="/login" className="hover:text-primary transition">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Nala Soo Xiriir</h4>
            <ul className="space-y-2 text-mediumGray dark:text-gray-400">
                <li className="flex items-center justify-center md:justify-start space-x-2">
                    <Mail className="w-5 h-5 text-primary" /><span>info@revlo.com</span>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-2">
                    <Phone className="w-5 h-5 text-primary" /><span>+251 929 475 332</span>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-2">
                    <MapPin className="w-5 h-5 text-primary" /><span>Jigjiga, Somali galbeed</span>
                </li>
            </ul>
          </div>
        </div>
        <div className="text-mediumGray dark:text-gray-500 text-sm mt-12 pt-8 border-t border-gray-700">
          &copy; {new Date().getFullYear()} Revlo. Xuquuqda oo dhan waa ay xifdisan tahay.
        </div>
      </footer>
    </div>
  );
}