// LEC Solar Simulator - Vanilla JavaScript Implementation

class SolarSimulator {
    constructor() {
        this.currentStep = 1;
        this.formData = {
            userType: '',
            region: '',
            roofOrientation: '',
            consumption: 0
        };
        
        this.regions = [
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
            'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
            'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
            'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
            'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
            'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
            'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
            'Wisconsin', 'Wyoming'
        ];

        this.roofOrientations = [
            { value: 'north', label: 'North', efficiency: 'Poor' },
            { value: 'northeast', label: 'Northeast', efficiency: 'Fair' },
            { value: 'east', label: 'East', efficiency: 'Good' },
            { value: 'southeast', label: 'Southeast', efficiency: 'Excellent' },
            { value: 'south', label: 'South', efficiency: 'Optimal' },
            { value: 'southwest', label: 'Southwest', efficiency: 'Excellent' },
            { value: 'west', label: 'West', efficiency: 'Good' },
            { value: 'northwest', label: 'Northwest', efficiency: 'Fair' }
        ];

        this.init();
    }

    init() {
        this.populateRegions();
        this.populateRoofOrientations();
        this.bindEvents();
        this.updateStepIndicator();
    }

    populateRegions() {
        const select = document.getElementById('region-select');
        select.innerHTML = '<option value="">Select your region</option>';
        
        this.regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            select.appendChild(option);
        });
    }

    populateRoofOrientations() {
        const container = document.querySelector('.roof-options');
        container.innerHTML = '';

        this.roofOrientations.forEach(orientation => {
            const button = document.createElement('button');
            button.className = 'roof-option';
            button.dataset.value = orientation.value;
            button.innerHTML = `
                <div class="roof-icon">🏠</div>
                <div class="roof-label">${orientation.label}</div>
                <div class="roof-efficiency">${orientation.efficiency}</div>
            `;
            container.appendChild(button);
        });
    }

    bindEvents() {
        // Radio buttons for user type
        document.querySelectorAll('.radio-button').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.radio-button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.formData.userType = e.target.dataset.value;
                this.validateStep();
            });
        });

        // Region select
        document.getElementById('region-select').addEventListener('change', (e) => {
            this.formData.region = e.target.value;
            this.validateStep();
        });

        // Roof orientation buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.roof-option')) {
                document.querySelectorAll('.roof-option').forEach(b => b.classList.remove('active'));
                e.target.closest('.roof-option').classList.add('active');
                this.formData.roofOrientation = e.target.closest('.roof-option').dataset.value;
                this.validateStep();
            }
        });

        // Consumption input
        document.getElementById('consumption-input').addEventListener('input', (e) => {
            this.formData.consumption = parseInt(e.target.value) || 0;
            this.updateConsumptionDetails();
            this.validateStep();
        });

        // Navigation buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-step')) {
                this.nextStep();
            } else if (e.target.classList.contains('prev-step')) {
                this.prevStep();
            }
        });
    }

    validateStep() {
        const nextButton = document.querySelector(`.form-step[data-step="${this.currentStep}"] .next-step`);
        if (!nextButton) return;

        let isValid = false;

        switch (this.currentStep) {
            case 1:
                isValid = this.formData.userType && this.formData.region;
                break;
            case 2:
                isValid = this.formData.roofOrientation;
                break;
            case 3:
                isValid = this.formData.consumption > 0;
                break;
            default:
                isValid = true;
        }

        nextButton.disabled = !isValid;
        nextButton.classList.toggle('enabled', isValid);
    }

    updateConsumptionDetails() {
        const container = document.querySelector('.consumption-details');
        if (this.formData.consumption > 0) {
            const monthlyConsumption = Math.round(this.formData.consumption / 12);
            const dailyConsumption = Math.round(this.formData.consumption / 365);
            
            container.innerHTML = `
                <div class="consumption-breakdown">
                    <div class="consumption-item">
                        <span class="label">Monthly:</span>
                        <span class="value">${monthlyConsumption.toLocaleString()} kWh</span>
                    </div>
                    <div class="consumption-item">
                        <span class="label">Daily:</span>
                        <span class="value">${dailyConsumption} kWh</span>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = '';
        }
    }

    nextStep() {
        if (this.currentStep < 4) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateStepIndicator();
            
            if (this.currentStep === 4) {
                this.generateResults();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateStepIndicator();
        }
    }

    showStep(step) {
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    }

    updateStepIndicator() {
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.querySelector('.step-icon').innerHTML = '✓';
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.querySelector('.step-icon').innerHTML = stepNumber;
            } else {
                step.querySelector('.step-icon').innerHTML = stepNumber;
            }
        });

        // Update step lines
        document.querySelectorAll('.step-line').forEach((line, index) => {
            const stepNumber = index + 1;
            line.classList.toggle('completed', stepNumber < this.currentStep);
        });
    }

    generateResults() {
        const container = document.querySelector('.results-container');
        
        // Calculate solar system specifications
        const systemSize = Math.ceil(this.formData.consumption / 1200); // kW
        const panelCount = Math.ceil(systemSize / 0.4); // Assuming 400W panels
        const annualProduction = Math.round(systemSize * 1300); // kWh per year
        const monthlySavings = Math.round(this.formData.consumption * 0.12 * 0.8); // Estimated savings
        const systemCost = systemSize * 3000; // $3000 per kW
        const paybackPeriod = Math.round(systemCost / (monthlySavings * 12));

        container.innerHTML = `
            <div class="results-grid">
                <div class="result-card primary">
                    <div class="result-icon">⚡</div>
                    <div class="result-content">
                        <h3>Recommended System Size</h3>
                        <div class="result-value">${systemSize} kW</div>
                        <div class="result-detail">${panelCount} solar panels</div>
                    </div>
                </div>
                
                <div class="result-card">
                    <div class="result-icon">🌞</div>
                    <div class="result-content">
                        <h3>Annual Production</h3>
                        <div class="result-value">${annualProduction.toLocaleString()} kWh</div>
                        <div class="result-detail">Estimated yearly output</div>
                    </div>
                </div>
                
                <div class="result-card">
                    <div class="result-icon">💰</div>
                    <div class="result-content">
                        <h3>Monthly Savings</h3>
                        <div class="result-value">$${monthlySavings}</div>
                        <div class="result-detail">Average monthly savings</div>
                    </div>
                </div>
                
                <div class="result-card">
                    <div class="result-icon">📊</div>
                    <div class="result-content">
                        <h3>System Investment</h3>
                        <div class="result-value">$${systemCost.toLocaleString()}</div>
                        <div class="result-detail">Before incentives</div>
                    </div>
                </div>
                
                <div class="result-card">
                    <div class="result-icon">⏱️</div>
                    <div class="result-content">
                        <h3>Payback Period</h3>
                        <div class="result-value">${paybackPeriod} years</div>
                        <div class="result-detail">Return on investment</div>
                    </div>
                </div>
                
                <div class="result-card">
                    <div class="result-icon">🌱</div>
                    <div class="result-content">
                        <h3>CO₂ Reduction</h3>
                        <div class="result-value">${Math.round(annualProduction * 0.0004)} tons</div>
                        <div class="result-detail">Annual CO₂ savings</div>
                    </div>
                </div>
            </div>
            
            <div class="results-summary">
                <h3>Your Solar Package Summary</h3>
                <div class="summary-details">
                    <p><strong>Location:</strong> ${this.formData.region}</p>
                    <p><strong>Roof Orientation:</strong> ${this.getRoofOrientationLabel()}</p>
                    <p><strong>Annual Consumption:</strong> ${this.formData.consumption.toLocaleString()} kWh</p>
                    <p><strong>System Coverage:</strong> ${Math.round((annualProduction / this.formData.consumption) * 100)}% of your electricity needs</p>
                </div>
            </div>
        `;
    }

    getRoofOrientationLabel() {
        const orientation = this.roofOrientations.find(o => o.value === this.formData.roofOrientation);
        return orientation ? `${orientation.label} (${orientation.efficiency})` : '';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SolarSimulator();
});

