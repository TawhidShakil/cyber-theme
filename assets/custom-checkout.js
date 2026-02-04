// Custom Checkout Multi-Step Navigation
class CheckoutFlow {
  constructor() {
    this.currentStep = 1;
    this.maxSteps = 3;
    this.data = {
      address: null,
      shipping: null,
      payment: null
    };
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.showStep(1);
  }

  attachEventListeners() {
    // Next buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextStep();
      });
    });

    // Back buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.previousStep();
      });
    });

    // Address selection
    document.querySelectorAll('input[name="shipping_address"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.data.address = e.target.id;
      });
    });

    // Shipping method selection
    document.querySelectorAll('input[name="shipping_method"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.data.shipping = e.target.id;
      });
    });

    // Pay button
    const payButton = document.querySelector('.btn-pay');
    if (payButton) {
      payButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.processPayment();
      });
    }
  }

  showStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-container').forEach(container => {
      container.style.display = 'none';
    });

    // Show current step
    const currentContainer = document.querySelector(`.step-${step}`);
    if (currentContainer) {
      currentContainer.style.display = 'flex';
      this.currentStep = step;
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.maxSteps) {
        this.showStep(this.currentStep + 1);
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  }

  validateCurrentStep() {
    switch(this.currentStep) {
      case 1:
        if (!this.data.address) {
          alert('Please select a shipping address');
          return false;
        }
        return true;
      
      case 2:
        if (!this.data.shipping) {
          alert('Please select a shipping method');
          return false;
        }
        return true;
      
      case 3:
        return this.validatePaymentForm();
      
      default:
        return true;
    }
  }

  validatePaymentForm() {
    const cardholderName = document.querySelector('input[placeholder="Enter cardholder name"]');
    const cardNumber = document.querySelector('input[placeholder="Enter card number"]');
    const expDate = document.querySelector('input[placeholder="MM/YY"]');
    const cvv = document.querySelector('input[placeholder="CVV"]');

    if (!cardholderName?.value) {
      alert('Please enter cardholder name');
      return false;
    }

    if (!cardNumber?.value || cardNumber.value.length < 16) {
      alert('Please enter a valid card number');
      return false;
    }

    if (!expDate?.value) {
      alert('Please enter expiration date');
      return false;
    }

    if (!cvv?.value || cvv.value.length < 3) {
      alert('Please enter CVV');
      return false;
    }

    return true;
  }

  processPayment() {
    if (this.validateCurrentStep()) {
      // Here you would integrate with Shopify's checkout API
      // For now, we'll redirect to Shopify's standard checkout
      
      console.log('Processing payment with data:', this.data);
      
      // Redirect to Shopify checkout with collected data
      window.location.href = '/checkout';
    }
  }
}

// Initialize checkout flow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CheckoutFlow();
  
  // Card number formatting
  const cardNumberInput = document.querySelector('input[placeholder="Enter card number"]');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
      
      // Update card display
      const cardDisplay = document.querySelector('.card-number');
      if (cardDisplay) {
        cardDisplay.textContent = formattedValue || '4321 5432 6789 9320';
      }
    });
  }

  // Expiry date formatting
  const expDateInput = document.querySelector('input[placeholder="MM/YY"]');
  if (expDateInput) {
    expDateInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  // CVV validation
  const cvvInput = document.querySelector('input[placeholder="CVV"]');
  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
  }
});