
import React, { useState, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CalculatorCategory } from './types';
import { SEO } from './components/SEO';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import { 
  Calculator, DollarSign, Activity, Menu, Grid, X, MoreVertical, Loader2, Globe
} from 'lucide-react';

// --- Lazy Load Calculators for Performance ---
const StandardCalculator = React.lazy(() => import('./components/StandardCalculator').then(module => ({ default: module.StandardCalculator })));
const CasioCalculator = React.lazy(() => import('./components/CasioCalculator').then(module => ({ default: module.CasioCalculator })));
const CasioScientificCalculator = React.lazy(() => import('./components/CasioScientificCalculator').then(module => ({ default: module.CasioScientificCalculator })));
const CasioBasicScientificCalculator = React.lazy(() => import('./components/CasioBasicScientificCalculator').then(module => ({ default: module.CasioBasicScientificCalculator })));
const MortgageCalculator = React.lazy(() => import('./components/MortgageCalculator').then(module => ({ default: module.MortgageCalculator })));
const BMICalculator = React.lazy(() => import('./components/BMICalculator').then(module => ({ default: module.BMICalculator })));
const CalorieCalculator = React.lazy(() => import('./components/CalorieCalculator').then(module => ({ default: module.CalorieCalculator })));
const LoanCalculator = React.lazy(() => import('./components/LoanCalculator').then(module => ({ default: module.LoanCalculator })));
const AutoLoanCalculator = React.lazy(() => import('./components/AutoLoanCalculator').then(module => ({ default: module.AutoLoanCalculator })));
const DateCalculator = React.lazy(() => import('./components/DateCalculator').then(module => ({ default: module.DateCalculator })));
const RetirementCalculator = React.lazy(() => import('./components/RetirementCalculator').then(module => ({ default: module.RetirementCalculator })));
const InvestmentCalculator = React.lazy(() => import('./components/InvestmentCalculator').then(module => ({ default: module.InvestmentCalculator })));
const SalaryCalculator = React.lazy(() => import('./components/SalaryCalculator').then(module => ({ default: module.SalaryCalculator })));
const SalesTaxCalculator = React.lazy(() => import('./components/SalesTaxCalculator').then(module => ({ default: module.SalesTaxCalculator })));
const PercentageCalculator = React.lazy(() => import('./components/PercentageCalculator').then(module => ({ default: module.PercentageCalculator })));
const RandomNumberGenerator = React.lazy(() => import('./components/RandomNumberGenerator').then(module => ({ default: module.RandomNumberGenerator })));
const FractionCalculator = React.lazy(() => import('./components/FractionCalculator').then(module => ({ default: module.FractionCalculator })));
const GeometryCalculator = React.lazy(() => import('./components/GeometryCalculator').then(module => ({ default: module.GeometryCalculator })));
const UnitConverter = React.lazy(() => import('./components/UnitConverter').then(module => ({ default: module.UnitConverter })));
const GPACalculator = React.lazy(() => import('./components/GPACalculator').then(module => ({ default: module.GPACalculator })));
const PasswordGenerator = React.lazy(() => import('./components/PasswordGenerator').then(module => ({ default: module.PasswordGenerator })));
const PregnancyCalculator = React.lazy(() => import('./components/PregnancyCalculator').then(module => ({ default: module.PregnancyCalculator })));
const BodyFatCalculator = React.lazy(() => import('./components/BodyFatCalculator').then(module => ({ default: module.BodyFatCalculator })));
const BMRCalculator = React.lazy(() => import('./components/BMRCalculator').then(module => ({ default: module.BMRCalculator })));
const InflationCalculator = React.lazy(() => import('./components/InflationCalculator').then(module => ({ default: module.InflationCalculator })));
const PaceCalculator = React.lazy(() => import('./components/PaceCalculator').then(module => ({ default: module.PaceCalculator })));
const ConcreteCalculator = React.lazy(() => import('./components/ConcreteCalculator').then(module => ({ default: module.ConcreteCalculator })));
const SubnetCalculator = React.lazy(() => import('./components/SubnetCalculator').then(module => ({ default: module.SubnetCalculator })));

// Non-lazy components (Critical UI)
import { CalculatorList } from './components/CalculatorList';
import { Sidebar } from './components/Sidebar';
import { NotFound } from './components/NotFound';

// Data Configuration for "All Calculators"
const categories: CalculatorCategory[] = [
  {
    title: 'Financial Tools',
    icon: <DollarSign className="w-6 h-6" />,
    items: [
      { label: 'Mortgage Calculator', path: '/mortgage' },
      { label: 'Loan Calculator', path: '/loan' },
      { label: 'Car Loan Calculator', path: '/car-loan' },
      { label: 'Retirement Planner', path: '/retirement' },
      { label: 'Investment Calculator', path: '/investment' },
      { label: 'Inflation Calculator', path: '/inflation' },
      { label: 'Salary Calculator', path: '/salary' },
      { label: 'Sales Tax Calculator', path: '/sales-tax' },
    ]
  },
  {
    title: 'Health & Fitness',
    icon: <Activity className="w-6 h-6" />,
    items: [
      { label: 'BMI Calculator', path: '/bmi' },
      { label: 'Calorie Calculator', path: '/calorie' },
      { label: 'Body Fat Calculator', path: '/body-fat' }, 
      { label: 'BMR Calculator', path: '/bmr' },
      { label: 'Pace Calculator', path: '/pace' },
      { label: 'Pregnancy Calculator', path: '/pregnancy' },
    ]
  },
  {
    title: 'Math & Others',
    icon: <Calculator className="w-6 h-6" />,
    items: [
      { label: 'Casio Basic (Desk)', path: '/casio' },
      { label: 'Casio Scientific (ES)', path: '/casio-scientific' },
      { label: 'Casio Scientific (MS)', path: '/casio-basic-scientific' },
      { label: 'Percentage Calculator', path: '/percentage' },
      { label: 'Random Number', path: '/random' },
      { label: 'Fraction Calculator', path: '/fraction' },
      { label: 'Geometry Calculator', path: '/geometry' },
      { label: 'Unit Converter', path: '/unit-converter' },
      { label: 'Date Calculator', path: '/date' },
      { label: 'GPA Calculator', path: '/gpa' },
      { label: 'Password Generator', path: '/password' },
      { label: 'Concrete Calculator', path: '/concrete' },
      { label: 'Subnet Calculator', path: '/subnet' },
    ]
  }
];

// Top Navigation Items
const topNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Casio Basic', path: '/casio' },
  { label: 'Casio Scientific', path: '/casio-scientific' },
  { label: 'Casio Scientific (MS)', path: '/casio-basic-scientific' },
];

const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
    <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand-600" />
    <p className="text-sm font-medium">Loading Calculator...</p>
  </div>
);

const CurrencySelector = () => {
  const { currency, setCurrencyByCode, availableCurrencies } = useCurrency();
  
  return (
    <div className="relative group">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer transition text-xs font-bold text-slate-700">
        <Globe size={14} className="text-brand-600"/>
        <span>{currency.code} ({currency.symbol})</span>
      </div>
      <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
        <div className="max-h-64 overflow-y-auto py-1">
          {availableCurrencies.map(c => (
            <button
              key={c.code}
              onClick={() => setCurrencyByCode(c.code)}
              className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition ${currency.code === c.code ? 'text-brand-600 bg-brand-50' : 'text-slate-600'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{
  onMenuClick: () => void;
  onMobileNavClick: () => void;
  isMobileNavOpen: boolean;
}> = ({ onMenuClick, onMobileNavClick, isMobileNavOpen }) => {
  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm h-14 md:h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative z-50 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-600 text-white p-1.5 md:p-2 rounded-lg group-hover:bg-brand-700 transition shadow-sm">
              <Calculator className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </div>
            <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Calc<span className="text-brand-600">Master</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Nav - Visible on MD and up */}
          <nav className="hidden md:flex items-center gap-1">
            {topNavItems.map(item => (
              <Link 
                key={item.label}
                to={item.path}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Currency Selector - Visible Always */}
          <CurrencySelector />

          {/* Mobile Nav Toggle - Hidden on MD and up */}
          <div className="flex items-center md:hidden">
              <button
                onClick={onMobileNavClick}
                className={`p-2 rounded-lg transition-colors ${isMobileNavOpen ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {isMobileNavOpen ? <X size={24}/> : <MoreVertical size={24}/>}
              </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Collapsible Nav - Absolute Position */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300 z-40 origin-top ${isMobileNavOpen ? 'max-h-64 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'}`}>
         <div className="flex flex-col p-2 space-y-1">
            {topNavItems.map(item => (
              <Link 
                key={item.label}
                to={item.path}
                onClick={onMobileNavClick}
                className="px-4 py-3 text-sm font-bold text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
              >
                {item.label}
              </Link>
            ))}
         </div>
      </div>
    </header>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Exclusive Toggling logic
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) setMobileNavOpen(false); // Close top nav if opening sidebar
  };

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
    if (!mobileNavOpen) setSidebarOpen(false); // Close sidebar if opening top nav
  };

  // Determine if we need a wider container for complex dashboards
  const isDashboardPage = [
    '/', 
    '/investment', 
    '/retirement', 
    '/mortgage', 
    '/loan', 
    '/car-loan', 
    '/salary',
    '/sales-tax',
    '/inflation',
    '/bmi',
    '/calorie',
    '/body-fat',
    '/bmr',
    '/pregnancy',
    '/pace',
    '/concrete',
    '/subnet',
    '/geometry',
    '/date',
    '/password',
    '/unit-converter',
    '/random',
    '/fraction',
    '/percentage',
    '/gpa',
    '/casio',
    '/casio-scientific',
    '/casio-basic-scientific'
  ].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onMenuClick={toggleSidebar} 
        onMobileNavClick={toggleMobileNav}
        isMobileNavOpen={mobileNavOpen}
      />
      
      <div className={`flex flex-1 relative w-full mx-auto ${isDashboardPage ? 'max-w-[1920px]' : 'max-w-7xl'}`}>
        <Sidebar 
          categories={categories} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Responsive padding */}
        <main className={`flex-1 w-full p-2 md:p-3 lg:p-4 overflow-x-hidden ${isDashboardPage ? 'xl:px-12' : ''}`}>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 py-4 md:py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CalcMaster. Free online calculators for everyone.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm text-slate-400">
            <span>Privacy Policy</span>
            <a href="/sitemap.xml" className="hover:text-slate-600 transition">Sitemap</a>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <CurrencyProvider>
        <Layout>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={
              <div className="space-y-4 animate-fade-in">
                <SEO 
                  title="Free Online Scientific Calculator | Trigonometry, Fractions & Statistics" 
                  description="World's best free online scientific calculator. Features natural display, fractions, trigonometry, and statistics. No download required. Better than Casio fx-991ES."
                  keywords="casio calculator, scientific calculator, online calculator, trigonometry calculator, free calculator, math solver, casio online, fraction calculator"
                />
                <div className="text-center mb-2 mt-4 md:mt-8">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Scientific <span className="text-brand-600">Calculator</span>
                  </h1>
                </div>

                <div className="max-w-4xl mx-auto">
                  <StandardCalculator />
                </div>
                
                <div className="mt-8 md:mt-16 max-w-7xl mx-auto">
                  <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="h-8 w-1.5 bg-brand-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      Browse All Calculators
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                    {categories.map((cat) => (
                      <CalculatorList key={cat.title} category={cat} />
                    ))}
                  </div>
                </div>
              </div>
            } />

            {/* Calculator Routes */}
            <Route path="/casio" element={<CasioCalculator />} />
            <Route path="/casio-scientific" element={<CasioScientificCalculator />} />
            <Route path="/casio-basic-scientific" element={<CasioBasicScientificCalculator />} />
            
            <Route path="/mortgage" element={<MortgageCalculator />} />
            <Route path="/loan" element={<LoanCalculator />} />
            <Route path="/car-loan" element={<AutoLoanCalculator />} />
            
            <Route path="/bmi" element={<BMICalculator />} />
            <Route path="/calorie" element={<CalorieCalculator />} />
            <Route path="/body-fat" element={<BodyFatCalculator />} />
            <Route path="/bmr" element={<BMRCalculator />} />
            <Route path="/pregnancy" element={<PregnancyCalculator />} />
            <Route path="/pace" element={<PaceCalculator />} />

            <Route path="/salary" element={<SalaryCalculator />} />
            <Route path="/sales-tax" element={<SalesTaxCalculator />} />
            <Route path="/retirement" element={<RetirementCalculator />} />
            <Route path="/investment" element={<InvestmentCalculator />} />
            <Route path="/inflation" element={<InflationCalculator />} />

            <Route path="/percentage" element={<PercentageCalculator />} />
            <Route path="/random" element={<RandomNumberGenerator />} />
            <Route path="/fraction" element={<FractionCalculator />} />
            <Route path="/geometry" element={<GeometryCalculator />} />
            <Route path="/unit-converter" element={<UnitConverter />} />
            <Route path="/date" element={<DateCalculator />} />
            <Route path="/gpa" element={<GPACalculator />} />
            <Route path="/password" element={<PasswordGenerator />} />
            <Route path="/concrete" element={<ConcreteCalculator />} />
            <Route path="/subnet" element={<SubnetCalculator />} />

            {/* Fallback to NotFound instead of Home */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </CurrencyProvider>
    </Router>
  );
};

export default App;
