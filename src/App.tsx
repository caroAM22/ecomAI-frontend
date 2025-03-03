import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import DemandPrediction from "./pages/DemandPrediction"
import ProductClassification from "./pages/ProductClassification"
import PersonalizedRecommendation from "./pages/PersonalizedRecommendation"
import Footer from "./components/Footer"
import PrivacyPolicy from "./pages/PrivacyPolicy"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DemandPrediction />} />
            <Route path="/classification" element={<ProductClassification />} />
            <Route path="/recommendation" element={<PersonalizedRecommendation />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  )
}

export default App

