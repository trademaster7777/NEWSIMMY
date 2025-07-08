import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Home, Zap, DollarSign, Sun, ArrowRight, ArrowLeft, Phone, CheckCircle, Building } from 'lucide-react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userType, setUserType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    propertyType: '',
    region: '',
    roofOrientation: '',
    annualBill: 2000,
    inputType: 'dollars'
  })

  const steps = [
    { id: 1, title: 'Your Project', subtitle: 'Tell us about your property', icon: Home },
    { id: 2, title: 'Your Exposure', subtitle: 'How is your roof oriented?', icon: Sun },
    { id: 3, title: 'Your Consumption', subtitle: 'What\'s your energy usage?', icon: Zap },
    { id: 4, title: 'Our Solution', subtitle: 'Your solar potential', icon: CheckCircle }
  ]

  const roofOrientations = [
    { value: 'west', label: 'West', icon: '🏠', description: 'Good for afternoon sun' },
    { value: 'southwest', label: 'Southwest', icon: '🏠', description: 'Excellent production' },
    { value: 'south', label: 'South', icon: '🏠', description: 'Optimal orientation' },
    { value: 'southeast', label: 'Southeast', icon: '🏠', description: 'Excellent production' },
    { value: 'east', label: 'East', icon: '🏠', description: 'Good for morning sun' }
  ]

  const regions = [
    'California', 'Texas', 'Florida', 'New York', 'Arizona', 'Nevada', 
    'North Carolina', 'New Jersey', 'Massachusetts', 'Maryland'
  ]

  const calculateSolarResults = () => {
    const baseConsumption = formData.annualBill / 0.12
    const orientationMultiplier = {
      'south': 1.0,
      'southeast': 0.95,
      'southwest': 0.95,
      'east': 0.85,
      'west': 0.85
    }
    
    const multiplier = orientationMultiplier[formData.roofOrientation] || 0.9
    const systemSize = Math.round((baseConsumption * 1.2) / 1200)
    const annualProduction = Math.round(systemSize * 1200 * multiplier)
    const annualSavings = Math.round(annualProduction * 0.12 * 0.8)
    const numPanels = Math.round(systemSize / 0.4)
    
    return {
      systemSize,
      numPanels,
      annualProduction,
      annualSavings,
      surfaceArea: Math.round(numPanels * 2.2)
    }
  }

  const results = currentStep === 3 ? calculateSolarResults() : null

  const nextStep = async () => {
    if (currentStep < 3) {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
      setCurrentStep(currentStep + 1)
      setIsLoading(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.propertyType && formData.region
      case 1: return formData.roofOrientation
      case 2: return formData.annualBill > 0
      default: return true
    }
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && isStepValid() && currentStep < 3) {
        nextStep()
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        prevStep()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, formData])

  if (!userType) {
    return (
      <div className="hero-section flex flex-col">
        {/* Enhanced Header */}
        <header className="w-full p-4 md:p-6 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-bold text-foreground">LEC</span>
              <div className="text-xs text-muted-foreground hidden md:block">Lighting & Energy Consulting</div>
            </div>
          </div>
          
          <nav className="hidden lg:flex space-x-1">
            {['Products', 'Financing', 'Projects', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="nav-link text-foreground hover:text-primary">
                {item}
              </a>
            ))}
          </nav>
          
          <Button className="lec-gradient text-white font-semibold px-4 md:px-6 py-2 md:py-3">
            <Zap className="w-4 h-4 mr-2" />
            SOLAR SIMULATOR
          </Button>
        </header>

        {/* Enhanced Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6 relative z-10">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-primary/30 text-primary">
            Free Solar Calculator 2025
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-foreground">LEC Solar </span>
            <span className="text-accent">Production</span>
            <br />
            <span className="text-foreground">Simulator</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl leading-relaxed">
            Simulate your <span className="text-accent font-semibold">solar panel production</span> and discover your potential savings with our advanced calculator
          </p>

          <div className="text-lg text-foreground mb-8 font-medium">I am</div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-12 w-full max-w-2xl">
            <Card 
              className="lec-card lec-card-interactive cursor-pointer p-6 md:p-8 flex-1"
              onClick={() => setUserType('residential')}
            >
              <CardContent className="flex flex-col items-center space-y-4 p-0">
                <div className="w-16 h-16 bg-chart-1/20 rounded-full flex items-center justify-center">
                  <Home className="w-8 h-8 text-chart-1" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Residential Customer</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Homeowners looking to reduce energy costs
                </p>
              </CardContent>
            </Card>
            
            <Card 
              className="lec-card lec-card-interactive cursor-pointer p-6 md:p-8 flex-1"
              onClick={() => setUserType('commercial')}
            >
              <CardContent className="flex flex-col items-center space-y-4 p-0">
                <div className="w-16 h-16 bg-chart-2/20 rounded-full flex items-center justify-center">
                  <Building className="w-8 h-8 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Commercial Customer</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Businesses seeking sustainable energy solutions
                </p>
              </CardContent>
            </Card>
          </div>

          <Button variant="outline" className="flex items-center space-x-2 text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground px-6 py-3">
            <Phone className="w-4 h-4" />
            <span>Get Expert Consultation</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl md:text-2xl font-bold text-foreground">LEC</span>
            <div className="text-xs text-muted-foreground hidden md:block">Solar Calculator</div>
          </div>
        </div>
        
        <nav className="hidden lg:flex space-x-1">
          {['Products', 'Financing', 'Projects', 'About', 'Contact'].map((item) => (
            <a key={item} href="#" className="nav-link text-foreground hover:text-primary text-sm">
              {item}
            </a>
          ))}
        </nav>
        
        <Button className="lec-gradient text-white font-semibold px-4 py-2 text-sm">
          SOLAR SIMULATOR
        </Button>
      </header>

      {/* Enhanced Hero Section */}
      <div className="text-center py-8 md:py-16 px-4 md:px-6">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-xs border-primary/30 text-primary">
          {userType === 'residential' ? 'Residential' : 'Commercial'} Solar Calculator
        </Badge>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          <span className="text-foreground">LEC Solar </span>
          <span className="text-accent">Production</span>
          <br />
          <span className="text-foreground">Simulator</span>
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Simulate your <span className="text-accent font-semibold">solar panel production</span> and potential savings
        </p>
      </div>

      {/* Compact Step Indicator - Positioned at Top */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30 py-4">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === index
              const isCompleted = currentStep > index
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`step-indicator ${isActive ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''} step-${step.id} w-8 h-8 md:w-10 md:h-10`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <div className="text-xs text-muted-foreground">{step.id}/4</div>
                      <div className={`font-medium text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-2 md:mx-4">
                      <div className="h-0.5 bg-border relative overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ 
                            width: isCompleted ? '100%' : isActive ? '50%' : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>



      {/* Enhanced Form Content */}
      <div className="form-section">
        {currentStep === 0 && (
          <Card className="lec-card max-w-2xl mx-auto">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl text-foreground flex items-center justify-center space-x-3">
                <Home className="w-8 h-8 text-primary" />
                <span>Your Project</span>
              </CardTitle>
              <p className="text-muted-foreground">Tell us about your property to get started</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <label className="text-lg font-semibold text-foreground mb-6 block">You are</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'owner', label: 'Property Owner', desc: 'I own this property' },
                    { value: 'tenant', label: 'Tenant', desc: 'I rent this property' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={formData.propertyType === option.value ? 'default' : 'outline'}
                      className="h-auto p-6 flex flex-col items-start space-y-2"
                      onClick={() => updateFormData('propertyType', option.value)}
                    >
                      <span className="font-semibold">{option.label}</span>
                      <span className="text-xs opacity-80">{option.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-lg font-semibold text-foreground mb-6 block">Your home is located in</label>
                <Select onValueChange={(value) => updateFormData('region', value)}>
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue placeholder="Choose your region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region} className="py-3">
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <Card className="lec-card max-w-4xl mx-auto">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl text-foreground flex items-center justify-center space-x-3">
                <Sun className="w-8 h-8 text-primary" />
                <span>Your Exposure</span>
              </CardTitle>
              <p className="text-muted-foreground mb-2">How is your roof oriented?</p>
              <Badge variant="outline" className="text-accent border-accent/30">
                Not sure? Choose SOUTH for best results
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {roofOrientations.map(orientation => (
                  <Card
                    key={orientation.value}
                    className={`house-icon cursor-pointer transition-all duration-300 ${
                      formData.roofOrientation === orientation.value 
                        ? 'selected' 
                        : ''
                    }`}
                    onClick={() => updateFormData('roofOrientation', orientation.value)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                      <div className="text-3xl mb-2">{orientation.icon}</div>
                      <div className="text-sm font-semibold text-foreground mb-1">{orientation.label}</div>
                      <div className="text-xs text-muted-foreground text-center">{orientation.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="lec-card max-w-2xl mx-auto">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl text-foreground flex items-center justify-center space-x-3">
                <Zap className="w-8 h-8 text-primary" />
                <span>Your Consumption</span>
              </CardTitle>
              <p className="text-muted-foreground">Help us calculate your solar needs</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'dollars', label: 'Annual bill in dollars ($)', desc: 'Enter your yearly electricity cost' },
                  { value: 'kwh', label: 'Annual bill in kWh', desc: 'Enter your yearly consumption' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={formData.inputType === option.value ? 'default' : 'outline'}
                    className="h-auto p-4 flex flex-col items-start space-y-1"
                    onClick={() => updateFormData('inputType', option.value)}
                  >
                    <span className="font-semibold text-sm">{option.label}</span>
                    <span className="text-xs opacity-80">{option.desc}</span>
                  </Button>
                ))}
              </div>
              
              <div>
                <label className="text-lg font-semibold text-foreground mb-4 block">
                  Annual electricity bill:
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      value={formData.annualBill}
                      onChange={(e) => updateFormData('annualBill', parseInt(e.target.value) || 0)}
                      className="text-lg h-14 text-center pr-16"
                      placeholder="2000"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $ / Year
                    </span>
                  </div>
                </div>
              </div>
              
              <Card className="lec-gradient-subtle border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Estimated Consumption</h3>
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                    {Math.round(formData.annualBill / 0.12).toLocaleString()} kWh
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Calculation based on average rate of $0.12 per kWh
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && results && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center space-x-3">
                <CheckCircle className="w-10 h-10 text-primary" />
                <span>Our Solution</span>
              </h2>
              <p className="text-muted-foreground">Your personalized solar recommendation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: Sun,
                  value: results.numPanels,
                  unit: 'panels',
                  description: `Installation of ${results.systemSize} kWc`,
                  color: 'text-accent'
                },
                {
                  icon: Zap,
                  value: results.annualProduction.toLocaleString(),
                  unit: 'kWh',
                  description: 'Estimated annual production',
                  color: 'text-primary'
                },
                {
                  icon: DollarSign,
                  value: `$${results.annualSavings.toLocaleString()}`,
                  unit: 'savings',
                  description: 'Estimated annual savings',
                  color: 'text-chart-1'
                }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <Card key={index} className="result-card">
                    <CardContent className="p-6">
                      <Icon className={`w-12 h-12 ${item.color} mx-auto mb-4`} />
                      <div className="result-number">{item.value}</div>
                      <div className="text-lg font-semibold text-foreground mb-2">{item.unit}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mb-8">
              <Button className="cta-button text-lg px-8 py-4">
                GET YOUR FREE QUOTE
              </Button>
            </div>

            <Card className="lec-card max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-center text-foreground">
                  Your Solar Package {results.systemSize} kWc
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Based on the information provided, we recommend the following:
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Total installation power', value: `${results.systemSize} kWc` },
                    { label: 'Total solar panel surface', value: `${results.surfaceArea} m²` },
                    { label: 'Available incentives', value: '$15,000' }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-muted/20">
                      <div className="text-2xl md:text-3xl font-bold text-accent mb-1">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4">
                  {[
                    'Premium solar panels from Tier 1 manufacturers',
                    'Monocrystalline panels with black finish',
                    '25-year comprehensive warranty'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 order-2 md:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 px-6 py-3 order-1 md:order-2"
          >
            <Phone className="w-4 h-4" />
            <span>Get Expert Consultation</span>
          </Button>
          
          {currentStep < 3 && (
            <Button
              onClick={nextStep}
              className="flex items-center space-x-2 lec-gradient px-6 py-3 order-3"
              disabled={!isStepValid() || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

