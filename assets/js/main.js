// =============================================================
// home.js · FarmConnect Marketplace
// clean, modular, production-ready
// =============================================================

(function() {
  'use strict';

  // ----- DOM refs -----
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const searchBtn = document.getElementById('searchBtn');
  const searchProduct = document.getElementById('searchProduct');
  const searchLocation = document.getElementById('searchLocation');
  const searchRole = document.getElementById('searchRole');

  // ----- 1. MOBILE NAVBAR TOGGLE -----
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // close on outside click (optional but polished)
    document.addEventListener('click', function(e) {
      const nav = document.querySelector('.home-navbar');
      if (nav && !nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- 2. SEARCH INTERACTION (log values) -----
  function handleSearch() {
    const product = searchProduct ? searchProduct.value.trim() : '';
    const location = searchLocation ? searchLocation.value.trim() : '';
    const role = searchRole ? searchRole.value : 'buyer';

    console.log('🔍 FarmConnect Search:');
    console.log('  Product:', product || '(empty)');
    console.log('  Location:', location || '(empty)');
    console.log('  Role:', role);

    // optional: lightweight feedback (no alert)
    // you could dispatch a custom event or show a toast later
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleSearch();
    });
  }

  // allow Enter key on any search input
  const searchInputs = [searchProduct, searchLocation].filter(Boolean);
  searchInputs.forEach(input => {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    });
  });

  // ----- 3. SMOOTH SCROLLING (internal anchor links, if any) -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        // close mobile nav after click
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // ----- 4. SCROLL ANIMATIONS (fade-up) -----
  // observe elements with class 'home-fade-up'
  const fadeElements = document.querySelectorAll('.home-fade-up');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // optionally unobserve after reveal
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -20px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // fallback: show all immediately
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // ----- 5. EXTRA POLISH: add fade-up class to some sections (if not already in HTML) -----
  // we can safely add to .home-section, .home-listing-card, .home-category-card etc.
  // but we only apply to elements that don't already have it.
  document.querySelectorAll('.home-section, .home-listing-card, .home-category-card, .home-step-card').forEach(el => {
    if (!el.classList.contains('home-fade-up')) {
      el.classList.add('home-fade-up');
    }
  });

  // re-run observer for newly added classes (just in case)
  if ('IntersectionObserver' in window) {
    const allFade = document.querySelectorAll('.home-fade-up:not(.visible)');
    const observer2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    allFade.forEach(el => observer2.observe(el));
  }

  // ----- 6. CONSOLE WELCOME (optional) -----
  console.log('🌱 FarmConnect Marketplace · home.js loaded');
  console.log('   built with ❤️  for Nigerian agriculture');

})();


// =============================================================
// marketplace.js · FarmConnect Marketplace
// clean, modular, production-ready
// =============================================================

(function() {
  'use strict';

  // ----- DOM refs -----
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const searchInput = document.getElementById('searchProduct');
  const locationFilter = document.getElementById('filterLocation');
  const categoryFilter = document.getElementById('filterCategory');
  const filterBtn = document.getElementById('filterBtn');
  const productGrid = document.getElementById('productGrid');
  const resultCount = document.getElementById('resultCount');
  const emptyState = document.getElementById('emptyState');

  // ----- 1. MOBILE NAVBAR TOGGLE -----
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function(e) {
      const nav = document.querySelector('.marketplace-navbar');
      if (nav && !nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- 2. FILTER FUNCTION -----
  function filterProducts() {
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const location = locationFilter ? locationFilter.value : '';
    const category = categoryFilter ? categoryFilter.value : '';

    console.log('🔍 Marketplace Filter:');
    console.log('  Search:', searchTerm || '(empty)');
    console.log('  Location:', location || '(all)');
    console.log('  Category:', category || '(all)');

    const cards = document.querySelectorAll('.marketplace-card-item');
    let visibleCount = 0;

    cards.forEach(card => {
      const cardName = card.querySelector('.marketplace-card-name')?.textContent?.toLowerCase() || '';
      const cardLocation = card.getAttribute('data-location') || '';
      const cardCategory = card.getAttribute('data-category') || '';
      
      let match = true;
      
      if (searchTerm && !cardName.includes(searchTerm)) {
        match = false;
      }
      
      if (location && cardLocation !== location) {
        match = false;
      }
      
      if (category && cardCategory !== category) {
        match = false;
      }
      
      if (match) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count
    if (resultCount) {
      resultCount.textContent = visibleCount + ' product' + (visibleCount !== 1 ? 's' : '');
    }

    // Show/hide empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('show');
        emptyState.style.display = 'block';
      } else {
        emptyState.classList.remove('show');
        emptyState.style.display = 'none';
      }
    }
  }

  // ----- 3. EVENT LISTENERS -----
  if (filterBtn) {
    filterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      filterProducts();
    });
  }

  // Real-time search on input
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterProducts();
    });
  }

  if (locationFilter) {
    locationFilter.addEventListener('change', function() {
      filterProducts();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      filterProducts();
    });
  }

  // Allow Enter key on search input
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterProducts();
      }
    });
  }

  // ----- 4. SMOOTH SCROLLING (for internal links) -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // ----- 5. INITIAL FILTER (show all) -----
  filterProducts();

  console.log('🌱 FarmConnect Marketplace · marketplace.js loaded');
})();

// =============================================================
// product-detail.js · FarmConnect Product Detail
// clean, modular, production-ready
// =============================================================

(function() {
  'use strict';

  // ----- DOM refs -----
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const reportBtn = document.getElementById('reportBtn');
  const reportModal = document.getElementById('reportModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const reportForm = document.getElementById('reportForm');
  const reportComplaint = document.getElementById('reportComplaint');

  // ----- 1. MOBILE NAVBAR TOGGLE -----
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function(e) {
      const nav = document.querySelector('.detail-navbar');
      if (nav && !nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

   // ----- 2. REPORT MODAL OPEN/CLOSE -----
  function openReportModal() {
    if (reportModal) {
      reportModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (reportComplaint) reportComplaint.value = '';
    }
  }

  function closeReportModal() {
    if (reportModal) {
      reportModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

   // ----- 3. REPORT BUTTON - WITH LOGIN CHECK (LIKE REVIEW) -----
  if (reportBtn) {
    const newReportBtn = reportBtn.cloneNode(true);
    reportBtn.parentNode.replaceChild(newReportBtn, reportBtn);
    
    newReportBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
      
      console.log('🚩 Report button clicked - isLoggedIn:', isLoggedIn);
      
      if (!isLoggedIn) {
        // Force hide report modal completely
        if (reportModal) {
          reportModal.classList.remove('active');
          reportModal.style.display = 'none';
          document.body.style.overflow = '';
        }
        
        // Show login modal
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
          const modalMessage = contactModal.querySelector('p');
          if (modalMessage) {
            modalMessage.textContent = 'You need to login or register to submit a report.';
          }
          contactModal.classList.add('active');
          contactModal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
        localStorage.setItem('pendingAction', 'report');
        localStorage.setItem('pendingRedirect', window.location.href);
        return;
      }
      
      // If logged in, open report modal directly
      openReportModal();
    });
  }

  // ----- 4. REPORT MODAL CLOSE -----
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeReportModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', closeReportModal);
  }

  if (reportModal) {
    reportModal.addEventListener('click', function(e) {
      if (e.target === reportModal) {
        closeReportModal();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && reportModal && reportModal.classList.contains('active')) {
      closeReportModal();
    }
  });

  // ----- 5. REPORT FORM SUBMISSION -----
  if (reportForm) {
    const newForm = reportForm.cloneNode(true);
    reportForm.parentNode.replaceChild(newForm, reportForm);
    
    newForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productName = document.getElementById('reportProductName')?.value || 'Unknown Product';
      const complaint = document.getElementById('reportComplaint')?.value?.trim() || '';

      console.log('📋 Report Submitted:');
      console.log('  Product:', productName);
      console.log('  Complaint:', complaint || '(empty)');

      if (complaint) {
        alert('✅ Your report has been submitted. We will review it shortly.');
        closeReportModal();
        document.getElementById('reportComplaint').value = '';
      } else {
        alert('⚠️ Please describe your complaint before submitting.');
        document.getElementById('reportComplaint')?.focus();
      }
    });
  }

  // ----- 6. WHATSAPP & CALL BUTTONS -----
  const chatBtn = document.getElementById('chatBtn');
  const callBtn = document.getElementById('callBtn');
  const farmerPhone = '2348012345678';

  function handleContactClick(action, phone) {
    const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
    
    if (isLoggedIn) {
      if (action === 'chat') {
        window.open('https://wa.me/' + phone, '_blank');
      } else if (action === 'call') {
        window.location.href = 'tel:' + phone;
      }
    } else {
      localStorage.setItem('pendingAction', action);
      localStorage.setItem('pendingPhone', phone);
      localStorage.setItem('pendingRedirect', window.location.href);
      
      const contactModal = document.getElementById('contactModal');
      if (contactModal) {
        const modalMessage = contactModal.querySelector('p');
        if (modalMessage) {
          modalMessage.textContent = 'You need to login or register to contact this farmer.';
        }
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  if (chatBtn) {
    const newChatBtn = chatBtn.cloneNode(true);
    chatBtn.parentNode.replaceChild(newChatBtn, chatBtn);
    newChatBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleContactClick('chat', farmerPhone);
    });
  }

  if (callBtn) {
    const newCallBtn = callBtn.cloneNode(true);
    callBtn.parentNode.replaceChild(newCallBtn, callBtn);
    newCallBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleContactClick('call', farmerPhone);
    });
  }

  // ----- 7. REVIEW SYSTEM - COMPLETE WORKING -----
  const addReviewBtn = document.getElementById('addReviewBtn');
  const reviewModal = document.getElementById('reviewModal');
  const reviewModalClose = document.getElementById('reviewModalClose');
  const reviewCancelBtn = document.getElementById('reviewCancelBtn');
  const reviewForm = document.getElementById('reviewForm');

  let selectedRating = 0;

  // Star Rating functionality
  function initStarRating() {
    const starRating = document.getElementById('starRating');
    const ratingText = document.getElementById('ratingText');
    const reviewRating = document.getElementById('reviewRating');
    
    if (!starRating) return;
    
    const stars = starRating.querySelectorAll('i');
    
    stars.forEach(star => {
      // Remove existing listeners
      const newStar = star.cloneNode(true);
      star.parentNode.replaceChild(newStar, star);
      
      newStar.addEventListener('mouseenter', function() {
        const value = parseInt(this.dataset.value);
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= value) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });

      newStar.addEventListener('mouseleave', function() {
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= selectedRating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });

      newStar.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.value);
        reviewRating.value = selectedRating;
        
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= selectedRating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });

        const ratings = {
          1: '⭐ Terrible',
          2: '⭐ Poor',
          3: '⭐⭐ Average',
          4: '⭐⭐⭐⭐ Good',
          5: '⭐⭐⭐⭐⭐ Excellent'
        };
        ratingText.textContent = ratings[selectedRating] || 'Select a rating';
      });
    });
  }

  // Show review modal
  function showReviewModal() {
    if (reviewModal) {
      reviewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Reset form
      const form = document.getElementById('reviewForm');
      if (form) form.reset();
      selectedRating = 0;
      document.getElementById('reviewRating').value = 0;
      document.getElementById('ratingText').textContent = 'Select a rating';
      document.querySelectorAll('#starRating i').forEach(s => s.classList.remove('active'));
      
      // Set date
      const reviewDate = document.getElementById('reviewDate');
      if (reviewDate) {
        const now = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        reviewDate.value = months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
      }
      
      // Re-init star rating
      initStarRating();
    }
  }

  function hideReviewModal() {
    if (reviewModal) {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Add Review Button
  if (addReviewBtn) {
    const newReviewBtn = addReviewBtn.cloneNode(true);
    addReviewBtn.parentNode.replaceChild(newReviewBtn, addReviewBtn);
    
    newReviewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('✍️ Add Review button clicked');
      
      const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
      
      if (!isLoggedIn) {
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
          const modalMessage = contactModal.querySelector('p');
          if (modalMessage) {
            modalMessage.textContent = 'You need to login or register to submit a review.';
          }
          contactModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
        localStorage.setItem('pendingAction', 'review');
        localStorage.setItem('pendingRedirect', window.location.href);
        return;
      }
      
      showReviewModal();
    });
  }

  // Close review modal
  if (reviewModalClose) {
    reviewModalClose.addEventListener('click', hideReviewModal);
  }

  if (reviewCancelBtn) {
    reviewCancelBtn.addEventListener('click', hideReviewModal);
  }

  if (reviewModal) {
    reviewModal.addEventListener('click', function(e) {
      if (e.target === reviewModal) {
        hideReviewModal();
      }
    });
  }

  // Submit Review
  if (reviewForm) {
    const newReviewForm = reviewForm.cloneNode(true);
    reviewForm.parentNode.replaceChild(newReviewForm, reviewForm);
    
    newReviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const name = document.getElementById('reviewerName')?.value?.trim() || '';
      const text = document.getElementById('reviewText')?.value?.trim() || '';
      const rating = parseInt(document.getElementById('reviewRating')?.value || 0);
      const date = document.getElementById('reviewDate')?.value || '';

      console.log('⭐ Review Submitted:', { name, rating, text, date });

      if (!name) {
        alert('⚠️ Please enter your name.');
        document.getElementById('reviewerName')?.focus();
        return;
      }

      if (rating === 0) {
        alert('⚠️ Please select a rating.');
        return;
      }

      if (!text) {
        alert('⚠️ Please write your review.');
        document.getElementById('reviewText')?.focus();
        return;
      }

      // Create new review element
      const reviewsList = document.querySelector('.detail-reviews-list');
      if (reviewsList) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
          if (i <= rating) {
            starsHtml += '<i class="fas fa-star"></i>';
          } else {
            starsHtml += '<i class="far fa-star"></i>';
          }
        }

        const newReview = document.createElement('div');
        newReview.className = 'detail-review-item';
        newReview.style.animation = 'reviewSlideIn 0.5s ease';
        newReview.innerHTML = `
          <div class="detail-review-avatar" style="background-image: url('https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2D7D3A&color=fff&size=100');"></div>
          <div class="detail-review-content">
            <div class="detail-review-header">
              <h4 class="detail-review-name">${name}</h4>
              <div class="detail-review-stars">${starsHtml}</div>
            </div>
            <p class="detail-review-text">"${text}"</p>
            <span class="detail-review-date">${date}</span>
          </div>
        `;

        reviewsList.insertBefore(newReview, reviewsList.firstChild);

        // Update rating count
        const ratingSpan = document.querySelector('.detail-product-rating span');
        if (ratingSpan) {
          const currentText = ratingSpan.textContent;
          const match = currentText.match(/\((\d+)\s*reviews?\)/);
          if (match) {
            const count = parseInt(match[1]) + 1;
            const avgMatch = currentText.match(/([\d.]+)/);
            const avg = avgMatch ? parseFloat(avgMatch[1]) : 4.8;
            const newAvg = ((avg * parseInt(match[1])) + rating) / count;
            const ratingDisplay = document.querySelector('.detail-product-rating');
            if (ratingDisplay) {
              ratingDisplay.innerHTML = `
                ${starsHtml}
                <span>${newAvg.toFixed(1)} (${count} reviews)</span>
              `;
            }
          }
        }

        // Update seller rating
        const sellerRating = document.querySelector('.detail-seller-rating');
        if (sellerRating) {
          const sellerSpan = sellerRating.querySelector('span');
          if (sellerSpan) {
            const match = sellerSpan.textContent.match(/\((\d+)\s*reviews?\)/);
            if (match) {
              const count = parseInt(match[1]) + 1;
              const avgMatch = sellerSpan.textContent.match(/([\d.]+)/);
              const avg = avgMatch ? parseFloat(avgMatch[1]) : 4.8;
              const newAvg = ((avg * parseInt(match[1])) + rating) / count;
              sellerSpan.textContent = `${newAvg.toFixed(1)} (${count} reviews)`;
            }
          }
        }

        console.log('✅ Review added successfully!');
        alert('✅ Your review has been submitted successfully!');
        hideReviewModal();
      }
    });
  }

  // ----- 8. CONTACT MODAL CLOSE (for login modal) -----
  const contactModalClose = document.getElementById('contactModalClose');
  const contactModal = document.getElementById('contactModal');

  if (contactModalClose) {
    contactModalClose.addEventListener('click', function() {
      if (contactModal) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (contactModal) {
    contactModal.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (contactModal && contactModal.classList.contains('active')) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (reviewModal && reviewModal.classList.contains('active')) {
        hideReviewModal();
      }
    }
  });

  // ----- 9. SMOOTH SCROLLING -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // ----- 10. PENDING ACTION HANDLER -----
  document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
    const pendingAction = localStorage.getItem('pendingAction');
    const pendingRedirect = localStorage.getItem('pendingRedirect');

    console.log('📋 Checking for pending action:', pendingAction);

    if (pendingAction && isLoggedIn) {
      localStorage.removeItem('pendingAction');
      localStorage.removeItem('pendingRedirect');
      
      console.log('✅ Pending action found:', pendingAction);
      
      if (pendingAction === 'review') {
        console.log('✍️ Showing review form after login');
        setTimeout(function() {
          showReviewModal();
        }, 400);
      } else if (pendingAction === 'report') {
        console.log('🚩 Showing report modal after login');
        setTimeout(function() {
          openReportModal();
        }, 300);
      } else if (pendingAction === 'chat' || pendingAction === 'call') {
        const pendingPhone = localStorage.getItem('pendingPhone');
        if (pendingPhone) {
          localStorage.removeItem('pendingPhone');
          if (pendingAction === 'chat') {
            window.open('https://wa.me/' + pendingPhone, '_blank');
          } else {
            window.location.href = 'tel:' + pendingPhone;
          }
        }
      }
    }
  });

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes reviewSlideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  console.log('🌱 FarmConnect Product Detail · product-detail.js loaded');
  console.log('🔒 Login required for: Add Review, Report Product, Chat, Call');

})();

// ============================================================
// FORCE FIX - ALL BUTTONS WORK WITHOUT REFRESH (PRODUCT DETAIL)
// ============================================================

(function() {
    'use strict';
    
    const contactModal = document.getElementById('contactModal');
    
    function showLoginModal(message) {
        if (contactModal) {
            const modalMessage = contactModal.querySelector('p');
            if (modalMessage && message) {
                modalMessage.textContent = message;
            }
            contactModal.classList.add('active');
            contactModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('🔒 Login modal shown');
        }
    }
    
    // Fix Chat Button
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        const newChat = chatBtn.cloneNode(true);
        chatBtn.parentNode.replaceChild(newChat, chatBtn);
        newChat.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('💬 Chat button clicked');
            const isLoggedIn = false;
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to chat with this farmer.');
                localStorage.setItem('pendingAction', 'chat');
                localStorage.setItem('pendingPhone', '2348012345678');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                window.open('https://wa.me/2348012345678', '_blank');
            }
        });
    }
    
    // Fix Call Button
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        const newCall = callBtn.cloneNode(true);
        callBtn.parentNode.replaceChild(newCall, callBtn);
        newCall.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📞 Call button clicked');
            const isLoggedIn = false;
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to call this farmer.');
                localStorage.setItem('pendingAction', 'call');
                localStorage.setItem('pendingPhone', '2348012345678');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                window.location.href = 'tel:2348012345678';
            }
        });
    }
    
    // Fix Review Button
    const reviewBtn = document.getElementById('addReviewBtn');
    if (reviewBtn) {
        const newReview = reviewBtn.cloneNode(true);
        reviewBtn.parentNode.replaceChild(newReview, reviewBtn);
        newReview.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✍️ Review button clicked');
            const isLoggedIn = false;
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to submit a review.');
                localStorage.setItem('pendingAction', 'review');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                const reviewModal = document.getElementById('reviewModal');
                if (reviewModal) {
                    reviewModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    const form = document.getElementById('reviewForm');
                    if (form) form.reset();
                    document.getElementById('reviewRating').value = 0;
                    document.getElementById('ratingText').textContent = 'Select a rating';
                    document.querySelectorAll('#starRating i').forEach(s => s.classList.remove('active'));
                    const reviewDate = document.getElementById('reviewDate');
                    if (reviewDate) {
                        const now = new Date();
                        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        reviewDate.value = months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
                    }
                }
            }
        });
    }
    
    // Fix Report Button
    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        const newReport = reportBtn.cloneNode(true);
        reportBtn.parentNode.replaceChild(newReport, reportBtn);
        newReport.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚩 Report button clicked');
            const isLoggedIn = false;
            if (!isLoggedIn) {
                const reportModal = document.getElementById('reportModal');
                if (reportModal) {
                    reportModal.classList.remove('active');
                    reportModal.style.display = 'none';
                }
                showLoginModal('You need to login or register to submit a report.');
                localStorage.setItem('pendingAction', 'report');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                const reportModal = document.getElementById('reportModal');
                if (reportModal) {
                    reportModal.classList.add('active');
                    reportModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    document.getElementById('reportComplaint').value = '';
                }
            }
        });
    }
    
    console.log('✅ All buttons fixed for Product Detail!');
})();


// =============================================================
// farmer-detail.js · FarmConnect Farmer Detail
// clean, modular, production-ready
// =============================================================

(function() {
  'use strict';

  // ----- DOM refs -----
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const reportBtn = document.getElementById('reportBtn');
  const reportModal = document.getElementById('reportModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const reportForm = document.getElementById('reportForm');
  const reportComplaint = document.getElementById('reportComplaint');

  // ----- 1. MOBILE NAVBAR TOGGLE -----
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function(e) {
      const nav = document.querySelector('.detail-navbar');
      if (nav && !nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- 2. REPORT MODAL OPEN/CLOSE -----
  function openReportModal() {
    if (reportModal) {
      reportModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (reportComplaint) reportComplaint.value = '';
    }
  }

  function closeReportModal() {
    if (reportModal) {
      reportModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

    // ----- 3. REPORT BUTTON - WITH LOGIN CHECK -----
  if (reportBtn) {
    const newReportBtn = reportBtn.cloneNode(true);
    reportBtn.parentNode.replaceChild(newReportBtn, reportBtn);
    
    newReportBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
      
      console.log('🚩 Report button clicked - isLoggedIn:', isLoggedIn);
      
      if (!isLoggedIn) {
        // FORCE CLOSE REPORT MODAL FIRST
        if (reportModal) {
          reportModal.classList.remove('active');
          reportModal.style.display = 'none';
          document.body.style.overflow = '';
        }
        
        // Show login modal
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
          const modalMessage = contactModal.querySelector('p');
          if (modalMessage) {
            modalMessage.textContent = 'You need to login or register to submit a report.';
          }
          contactModal.classList.add('active');
          contactModal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
        localStorage.setItem('pendingAction', 'report');
        localStorage.setItem('pendingRedirect', window.location.href);
        return;
      }
      
      openReportModal();
    });
  }

  // ----- 4. REPORT MODAL CLOSE -----
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeReportModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', closeReportModal);
  }

  if (reportModal) {
    reportModal.addEventListener('click', function(e) {
      if (e.target === reportModal) {
        closeReportModal();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && reportModal && reportModal.classList.contains('active')) {
      closeReportModal();
    }
  });

  // ----- 5. REPORT FORM SUBMISSION -----
  if (reportForm) {
    const newForm = reportForm.cloneNode(true);
    reportForm.parentNode.replaceChild(newForm, reportForm);
    
    newForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const farmerName = document.getElementById('reportFarmerName')?.value || 'Unknown Farmer';
      const complaint = document.getElementById('reportComplaint')?.value?.trim() || '';

      console.log('📋 Report Submitted:');
      console.log('  Farmer:', farmerName);
      console.log('  Complaint:', complaint || '(empty)');

      if (complaint) {
        alert('✅ Your report has been submitted. We will review it shortly.');
        closeReportModal();
        document.getElementById('reportComplaint').value = '';
      } else {
        alert('⚠️ Please describe your complaint before submitting.');
        document.getElementById('reportComplaint')?.focus();
      }
    });
  }

  // ----- 6. WHATSAPP & CALL BUTTONS -----
  const chatBtn = document.getElementById('chatBtn');
  const callBtn = document.getElementById('callBtn');
  const farmerPhone = '2348012345678';

  function handleContactClick(action, phone) {
    const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
    
    if (isLoggedIn) {
      if (action === 'chat') {
        window.open('https://wa.me/' + phone, '_blank');
      } else if (action === 'call') {
        window.location.href = 'tel:' + phone;
      }
    } else {
      localStorage.setItem('pendingAction', action);
      localStorage.setItem('pendingPhone', phone);
      localStorage.setItem('pendingRedirect', window.location.href);
      
      const contactModal = document.getElementById('contactModal');
      if (contactModal) {
        const modalMessage = contactModal.querySelector('p');
        if (modalMessage) {
          modalMessage.textContent = 'You need to login or register to contact this farmer.';
        }
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  if (chatBtn) {
    const newChatBtn = chatBtn.cloneNode(true);
    chatBtn.parentNode.replaceChild(newChatBtn, chatBtn);
    newChatBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleContactClick('chat', farmerPhone);
    });
  }

  if (callBtn) {
    const newCallBtn = callBtn.cloneNode(true);
    callBtn.parentNode.replaceChild(newCallBtn, callBtn);
    newCallBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleContactClick('call', farmerPhone);
    });
  }

    // ----- 7. VIEW PRODUCTS BUTTON - Scroll to produce section -----
  const viewProductsBtn = document.getElementById('viewProductsBtn');
  if (viewProductsBtn) {
    viewProductsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('👁️ View Products clicked - scrolling to produce section');
      
      const productsSection = document.getElementById('produce-section');
      if (productsSection) {
        const offsetTop = productsSection.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }
  // ----- 8. REVIEW SYSTEM - COMPLETE WORKING -----
  const addReviewBtn = document.getElementById('addReviewBtn');
  const reviewModal = document.getElementById('reviewModal');
  const reviewModalClose = document.getElementById('reviewModalClose');
  const reviewCancelBtn = document.getElementById('reviewCancelBtn');
  const reviewForm = document.getElementById('reviewForm');

  let selectedRating = 0;

  // Star Rating functionality
  function initStarRating() {
    const starRating = document.getElementById('starRating');
    const ratingText = document.getElementById('ratingText');
    const reviewRating = document.getElementById('reviewRating');
    
    if (!starRating) return;
    
    const stars = starRating.querySelectorAll('i');
    
    stars.forEach(star => {
      const newStar = star.cloneNode(true);
      star.parentNode.replaceChild(newStar, star);
      
      newStar.addEventListener('mouseenter', function() {
        const value = parseInt(this.dataset.value);
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= value) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });

      newStar.addEventListener('mouseleave', function() {
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= selectedRating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });

      newStar.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.value);
        reviewRating.value = selectedRating;
        
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= selectedRating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });

        const ratings = {
          1: '⭐ Terrible',
          2: '⭐ Poor',
          3: '⭐⭐ Average',
          4: '⭐⭐⭐⭐ Good',
          5: '⭐⭐⭐⭐⭐ Excellent'
        };
        ratingText.textContent = ratings[selectedRating] || 'Select a rating';
      });
    });
  }

  // Show review modal
  function showReviewModal() {
    if (reviewModal) {
      reviewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      const form = document.getElementById('reviewForm');
      if (form) form.reset();
      selectedRating = 0;
      document.getElementById('reviewRating').value = 0;
      document.getElementById('ratingText').textContent = 'Select a rating';
      document.querySelectorAll('#starRating i').forEach(s => s.classList.remove('active'));
      
      const reviewDate = document.getElementById('reviewDate');
      if (reviewDate) {
        const now = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        reviewDate.value = months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
      }
      
      initStarRating();
    }
  }

  function hideReviewModal() {
    if (reviewModal) {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Add Review Button
  if (addReviewBtn) {
    const newReviewBtn = addReviewBtn.cloneNode(true);
    addReviewBtn.parentNode.replaceChild(newReviewBtn, addReviewBtn);
    
    newReviewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('✍️ Add Review button clicked');
      
      const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
      
      if (!isLoggedIn) {
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
          const modalMessage = contactModal.querySelector('p');
          if (modalMessage) {
            modalMessage.textContent = 'You need to login or register to submit a review.';
          }
          contactModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
        localStorage.setItem('pendingAction', 'review');
        localStorage.setItem('pendingRedirect', window.location.href);
        return;
      }
      
      showReviewModal();
    });
  }

  // Close review modal
  if (reviewModalClose) {
    reviewModalClose.addEventListener('click', hideReviewModal);
  }

  if (reviewCancelBtn) {
    reviewCancelBtn.addEventListener('click', hideReviewModal);
  }

  if (reviewModal) {
    reviewModal.addEventListener('click', function(e) {
      if (e.target === reviewModal) {
        hideReviewModal();
      }
    });
  }

  // Submit Review
  if (reviewForm) {
    const newReviewForm = reviewForm.cloneNode(true);
    reviewForm.parentNode.replaceChild(newReviewForm, reviewForm);
    
    newReviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const name = document.getElementById('reviewerName')?.value?.trim() || '';
      const text = document.getElementById('reviewText')?.value?.trim() || '';
      const rating = parseInt(document.getElementById('reviewRating')?.value || 0);
      const date = document.getElementById('reviewDate')?.value || '';

      console.log('⭐ Review Submitted:', { name, rating, text, date });

      if (!name) {
        alert('⚠️ Please enter your name.');
        document.getElementById('reviewerName')?.focus();
        return;
      }

      if (rating === 0) {
        alert('⚠️ Please select a rating.');
        return;
      }

      if (!text) {
        alert('⚠️ Please write your review.');
        document.getElementById('reviewText')?.focus();
        return;
      }

      const reviewsList = document.querySelector('.detail-reviews-list');
      if (reviewsList) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
          if (i <= rating) {
            starsHtml += '<i class="fas fa-star"></i>';
          } else {
            starsHtml += '<i class="far fa-star"></i>';
          }
        }

        const newReview = document.createElement('div');
        newReview.className = 'detail-review-item';
        newReview.style.animation = 'reviewSlideIn 0.5s ease';
        newReview.innerHTML = `
          <div class="detail-review-avatar" style="background-image: url('https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2D7D3A&color=fff&size=100');"></div>
          <div class="detail-review-content">
            <div class="detail-review-header">
              <h4 class="detail-review-name">${name}</h4>
              <div class="detail-review-stars">${starsHtml}</div>
            </div>
            <p class="detail-review-text">"${text}"</p>
            <span class="detail-review-date">${date}</span>
          </div>
        `;

        reviewsList.insertBefore(newReview, reviewsList.firstChild);

        // Update rating count in farmer profile
        const ratingSpan = document.querySelector('.detail-profile-rating');
        if (ratingSpan) {
          const currentText = ratingSpan.textContent;
          const match = currentText.match(/\((\d+)\s*reviews?\)/);
          if (match) {
            const count = parseInt(match[1]) + 1;
            const avgMatch = currentText.match(/([\d.]+)/);
            const avg = avgMatch ? parseFloat(avgMatch[1]) : 4.8;
            const newAvg = ((avg * parseInt(match[1])) + rating) / count;
            ratingSpan.innerHTML = `
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
              ${newAvg.toFixed(1)} (${count} reviews)
            `;
          }
        }

        console.log('✅ Review added successfully!');
        alert('✅ Your review has been submitted successfully!');
        hideReviewModal();
      }
    });
  }

   // ----- 9. CONTACT MODAL CLOSE -----
  const contactModalClose = document.getElementById('contactModalClose');
  const contactModal = document.getElementById('contactModal');

  if (contactModalClose) {
    contactModalClose.addEventListener('click', function() {
      if (contactModal) {
        contactModal.classList.remove('active');
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
        // DO NOT reopen report modal here
      }
    });
  }

  if (contactModal) {
    contactModal.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        contactModal.classList.remove('active');
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
        // DO NOT reopen report modal here
      }
    });
  }

  // ----- 10. VIEW PRODUCT BUTTONS -----
  const viewProductBtns = document.querySelectorAll('.marketplace-btn-view');
  viewProductBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const productName = this.closest('.marketplace-card-body')?.querySelector('.marketplace-card-name')?.textContent || 'product';
      console.log(`👁️ View Product: ${productName}`);
    });
  });

  // ----- 11. SMOOTH SCROLLING -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // ----- 12. SCROLL ANIMATIONS (fade-in cards) -----
  const cards = document.querySelectorAll('.marketplace-card');
  if (cards.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px'
    });

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
    });
  } else {
    cards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  // ----- 13. PENDING ACTION HANDLER -----
  document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
    const pendingAction = localStorage.getItem('pendingAction');
    const pendingRedirect = localStorage.getItem('pendingRedirect');

    console.log('📋 Checking for pending action:', pendingAction);

    if (pendingAction && isLoggedIn) {
      localStorage.removeItem('pendingAction');
      localStorage.removeItem('pendingRedirect');
      
      console.log('✅ Pending action found:', pendingAction);
      
      if (pendingAction === 'review') {
        console.log('✍️ Showing review form after login');
        setTimeout(function() {
          showReviewModal();
        }, 400);
      } else if (pendingAction === 'report') {
        console.log('🚩 Showing report modal after login');
        closeReportModal();
        setTimeout(function() {
          openReportModal();
        }, 300);
      } else if (pendingAction === 'chat' || pendingAction === 'call') {
        const pendingPhone = localStorage.getItem('pendingPhone');
        if (pendingPhone) {
          localStorage.removeItem('pendingPhone');
          if (pendingAction === 'chat') {
            window.open('https://wa.me/' + pendingPhone, '_blank');
          } else {
            window.location.href = 'tel:' + pendingPhone;
          }
        }
      }
    }
  });

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes reviewSlideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  console.log('🌱 FarmConnect Farmer Detail · farmer-detail.js loaded');
  console.log('🔒 Login required for: Add Review, Report Farmer, Chat, Call');

})();

// ============================================================
// FORCE FIX - ALL BUTTONS WORK WITHOUT REFRESH
// ============================================================

(function() {
    'use strict';
    
    const contactModal = document.getElementById('contactModal');
    
    function showLoginModal(message) {
        if (contactModal) {
            const modalMessage = contactModal.querySelector('p');
            if (modalMessage && message) {
                modalMessage.textContent = message;
            }
            contactModal.classList.add('active');
            contactModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('🔒 Login modal shown');
        }
    }
    
    // Fix Chat Button
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        const newChat = chatBtn.cloneNode(true);
        chatBtn.parentNode.replaceChild(newChat, chatBtn);
        newChat.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('💬 Chat button clicked');
            const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to chat with this farmer.');
                localStorage.setItem('pendingAction', 'chat');
                localStorage.setItem('pendingPhone', '2348012345678');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                window.open('https://wa.me/2348012345678', '_blank');
            }
        });
    }
    
    // Fix Call Button
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        const newCall = callBtn.cloneNode(true);
        callBtn.parentNode.replaceChild(newCall, callBtn);
        newCall.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📞 Call button clicked');
            const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to call this farmer.');
                localStorage.setItem('pendingAction', 'call');
                localStorage.setItem('pendingPhone', '2348012345678');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                window.location.href = 'tel:2348012345678';
            }
        });
    }
    
    // Fix Review Button
    const reviewBtn = document.getElementById('addReviewBtn');
    if (reviewBtn) {
        const newReview = reviewBtn.cloneNode(true);
        reviewBtn.parentNode.replaceChild(newReview, reviewBtn);
        newReview.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✍️ Review button clicked');
            const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to submit a review.');
                localStorage.setItem('pendingAction', 'review');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                // Show review modal
                const reviewModal = document.getElementById('reviewModal');
                if (reviewModal) {
                    reviewModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    // Reset form
                    const form = document.getElementById('reviewForm');
                    if (form) form.reset();
                    document.getElementById('reviewRating').value = 0;
                    document.getElementById('ratingText').textContent = 'Select a rating';
                    document.querySelectorAll('#starRating i').forEach(s => s.classList.remove('active'));
                    // Set date
                    const reviewDate = document.getElementById('reviewDate');
                    if (reviewDate) {
                        const now = new Date();
                        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        reviewDate.value = months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
                    }
                }
            }
        });
    }
    
    // Fix Report Button
    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        const newReport = reportBtn.cloneNode(true);
        reportBtn.parentNode.replaceChild(newReport, reportBtn);
        newReport.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚩 Report button clicked');
            const isLoggedIn = false; // Change to {{ user.is_authenticated|yesno:'true,false' }} in Django
            if (!isLoggedIn) {
                // Close report modal first
                const reportModal = document.getElementById('reportModal');
                if (reportModal) {
                    reportModal.classList.remove('active');
                    reportModal.style.display = 'none';
                }
                showLoginModal('You need to login or register to submit a report.');
                localStorage.setItem('pendingAction', 'report');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                // Open report modal
                const reportModal = document.getElementById('reportModal');
                if (reportModal) {
                    reportModal.classList.add('active');
                    reportModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    document.getElementById('reportComplaint').value = '';
                }
            }
        });
    }
    
    // Fix View Products Button (scroll to section)
    const viewProductsBtn = document.getElementById('viewProductsBtn');
    if (viewProductsBtn) {
        const newView = viewProductsBtn.cloneNode(true);
        viewProductsBtn.parentNode.replaceChild(newView, viewProductsBtn);
        newView.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('👁️ View Products clicked');
            const productsSection = document.getElementById('produce-section');
            if (productsSection) {
                const offsetTop = productsSection.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    console.log('✅ All buttons fixed! Click any button to see the login modal.');
})();


// ============================================================
// FIX: LOGISTICS EMPTY STATE
// ============================================================

(function() {
    'use strict';
    
    // Wait for page to load
    document.addEventListener('DOMContentLoaded', function() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
            emptyState.classList.remove('show');
            console.log('✅ Logistics empty state hidden');
        }
    });
    
    // Also hide immediately if DOM is already loaded
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = 'none';
        emptyState.classList.remove('show');
    }
})();
// =============================================================
// logistics-detail.js · FarmConnect Logistics Detail
// clean, modular, production-ready
// =============================================================

(function() {
  'use strict';

  // ----- DOM refs -----
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const reportBtn = document.getElementById('reportBtn');
  const reportModal = document.getElementById('reportModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const reportForm = document.getElementById('reportForm');
  const reportComplaint = document.getElementById('reportComplaint');

  // ----- 1. MOBILE NAVBAR TOGGLE -----
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function(e) {
      const nav = document.querySelector('.detail-navbar');
      if (nav && !nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- 2. REPORT MODAL OPEN/CLOSE -----
  function openReportModal() {
    if (reportModal) {
      reportModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (reportComplaint) reportComplaint.value = '';
    }
  }

  function closeReportModal() {
    if (reportModal) {
      reportModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ----- 3. REPORT BUTTON - WITH LOGIN CHECK -----
  if (reportBtn) {
    const newReportBtn = reportBtn.cloneNode(true);
    reportBtn.parentNode.replaceChild(newReportBtn, reportBtn);
    
    newReportBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isLoggedIn = false;
      
      console.log('🚩 Report button clicked - isLoggedIn:', isLoggedIn);
      
      if (!isLoggedIn) {
        if (reportModal) {
          reportModal.classList.remove('active');
          reportModal.style.display = 'none';
        }
        
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
          const modalMessage = contactModal.querySelector('p');
          if (modalMessage) {
            modalMessage.textContent = 'You need to login or register to submit a report.';
          }
          contactModal.classList.add('active');
          contactModal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
        localStorage.setItem('pendingAction', 'report');
        localStorage.setItem('pendingRedirect', window.location.href);
        return;
      }
      
      openReportModal();
    });
  }

  // ----- 4. REPORT MODAL CLOSE -----
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeReportModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', closeReportModal);
  }

  if (reportModal) {
    reportModal.addEventListener('click', function(e) {
      if (e.target === reportModal) {
        closeReportModal();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && reportModal && reportModal.classList.contains('active')) {
      closeReportModal();
    }
  });

  // ----- 5. REPORT FORM SUBMISSION -----
  if (reportForm) {
    const newForm = reportForm.cloneNode(true);
    reportForm.parentNode.replaceChild(newForm, reportForm);
    
    newForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const companyName = document.getElementById('reportCompanyName')?.value || 'Unknown Company';
      const complaint = document.getElementById('reportComplaint')?.value?.trim() || '';

      console.log('📋 Report Submitted:');
      console.log('  Company:', companyName);
      console.log('  Complaint:', complaint || '(empty)');

      if (complaint) {
        alert('✅ Your report has been submitted. We will review it shortly.');
        closeReportModal();
        document.getElementById('reportComplaint').value = '';
      } else {
        alert('⚠️ Please describe your complaint before submitting.');
        document.getElementById('reportComplaint')?.focus();
      }
    });
  }

  // ----- 6. WHATSAPP & CALL BUTTONS -----
  const chatBtn = document.getElementById('chatBtn');
  const callBtn = document.getElementById('callBtn');
  const providerPhone = '2348012345678';

  function handleContactClick(action, phone) {
    const isLoggedIn = false;
    
    if (isLoggedIn) {
      if (action === 'chat') {
        window.open('https://wa.me/' + phone, '_blank');
      } else if (action === 'call') {
        window.location.href = 'tel:' + phone;
      }
    } else {
      localStorage.setItem('pendingAction', action);
      localStorage.setItem('pendingPhone', phone);
      localStorage.setItem('pendingRedirect', window.location.href);
      
      const contactModal = document.getElementById('contactModal');
      if (contactModal) {
        const modalMessage = contactModal.querySelector('p');
        if (modalMessage) {
          modalMessage.textContent = 'You need to login or register to contact this provider.';
        }
        contactModal.classList.add('active');
        contactModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }
  }

  if (chatBtn) {
    const newChatBtn = chatBtn.cloneNode(true);
    chatBtn.parentNode.replaceChild(newChatBtn, chatBtn);
    newChatBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleContactClick('chat', providerPhone);
    });
  }

  if (callBtn) {
    const newCallBtn = callBtn.cloneNode(true);
    callBtn.parentNode.replaceChild(newCallBtn, callBtn);
    newCallBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleContactClick('call', providerPhone);
    });
  }

  // ----- 7. REVIEW SYSTEM -----
  const addReviewBtn = document.getElementById('addReviewBtn');
  const reviewModal = document.getElementById('reviewModal');
  const reviewModalClose = document.getElementById('reviewModalClose');
  const reviewCancelBtn = document.getElementById('reviewCancelBtn');
  const reviewForm = document.getElementById('reviewForm');

  let selectedRating = 0;

  function initStarRating() {
    const starRating = document.getElementById('starRating');
    const ratingText = document.getElementById('ratingText');
    const reviewRating = document.getElementById('reviewRating');
    
    if (!starRating) return;
    
    const stars = starRating.querySelectorAll('i');
    
    stars.forEach(star => {
      const newStar = star.cloneNode(true);
      star.parentNode.replaceChild(newStar, star);
      
      newStar.addEventListener('mouseenter', function() {
        const value = parseInt(this.dataset.value);
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= value) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });

      newStar.addEventListener('mouseleave', function() {
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= selectedRating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });

      newStar.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.value);
        reviewRating.value = selectedRating;
        
        stars.forEach(s => {
          const val = parseInt(s.dataset.value);
          if (val <= selectedRating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });

        const ratings = {
          1: '⭐ Terrible',
          2: '⭐ Poor',
          3: '⭐⭐ Average',
          4: '⭐⭐⭐⭐ Good',
          5: '⭐⭐⭐⭐⭐ Excellent'
        };
        ratingText.textContent = ratings[selectedRating] || 'Select a rating';
      });
    });
  }

  function showReviewModal() {
    if (reviewModal) {
      reviewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      const form = document.getElementById('reviewForm');
      if (form) form.reset();
      selectedRating = 0;
      document.getElementById('reviewRating').value = 0;
      document.getElementById('ratingText').textContent = 'Select a rating';
      document.querySelectorAll('#starRating i').forEach(s => s.classList.remove('active'));
      
      const reviewDate = document.getElementById('reviewDate');
      if (reviewDate) {
        const now = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        reviewDate.value = months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
      }
      
      initStarRating();
    }
  }

  function hideReviewModal() {
    if (reviewModal) {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (addReviewBtn) {
    const newReviewBtn = addReviewBtn.cloneNode(true);
    addReviewBtn.parentNode.replaceChild(newReviewBtn, addReviewBtn);
    
    newReviewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('✍️ Add Review button clicked');
      
      const isLoggedIn = false;
      
      if (!isLoggedIn) {
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
          const modalMessage = contactModal.querySelector('p');
          if (modalMessage) {
            modalMessage.textContent = 'You need to login or register to submit a review.';
          }
          contactModal.classList.add('active');
          contactModal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
        localStorage.setItem('pendingAction', 'review');
        localStorage.setItem('pendingRedirect', window.location.href);
        return;
      }
      
      showReviewModal();
    });
  }

  if (reviewModalClose) {
    reviewModalClose.addEventListener('click', hideReviewModal);
  }

  if (reviewCancelBtn) {
    reviewCancelBtn.addEventListener('click', hideReviewModal);
  }

  if (reviewModal) {
    reviewModal.addEventListener('click', function(e) {
      if (e.target === reviewModal) {
        hideReviewModal();
      }
    });
  }

  if (reviewForm) {
    const newReviewForm = reviewForm.cloneNode(true);
    reviewForm.parentNode.replaceChild(newReviewForm, reviewForm);
    
    newReviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const name = document.getElementById('reviewerName')?.value?.trim() || '';
      const text = document.getElementById('reviewText')?.value?.trim() || '';
      const rating = parseInt(document.getElementById('reviewRating')?.value || 0);
      const date = document.getElementById('reviewDate')?.value || '';

      console.log('⭐ Review Submitted:', { name, rating, text, date });

      if (!name) {
        alert('⚠️ Please enter your name.');
        document.getElementById('reviewerName')?.focus();
        return;
      }

      if (rating === 0) {
        alert('⚠️ Please select a rating.');
        return;
      }

      if (!text) {
        alert('⚠️ Please write your review.');
        document.getElementById('reviewText')?.focus();
        return;
      }

      const reviewsList = document.querySelector('.detail-reviews-list');
      if (reviewsList) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
          if (i <= rating) {
            starsHtml += '<i class="fas fa-star"></i>';
          } else {
            starsHtml += '<i class="far fa-star"></i>';
          }
        }

        const newReview = document.createElement('div');
        newReview.className = 'detail-review-item';
        newReview.style.animation = 'reviewSlideIn 0.5s ease';
        newReview.innerHTML = `
          <div class="detail-review-avatar" style="background-image: url('https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2D7D3A&color=fff&size=100');"></div>
          <div class="detail-review-content">
            <div class="detail-review-header">
              <h4 class="detail-review-name">${name}</h4>
              <div class="detail-review-stars">${starsHtml}</div>
            </div>
            <p class="detail-review-text">"${text}"</p>
            <span class="detail-review-date">${date}</span>
          </div>
        `;

        reviewsList.insertBefore(newReview, reviewsList.firstChild);

        const ratingSpan = document.querySelector('.detail-profile-rating');
        if (ratingSpan) {
          const currentText = ratingSpan.textContent;
          const match = currentText.match(/\((\d+)\s*reviews?\)/);
          if (match) {
            const count = parseInt(match[1]) + 1;
            const avgMatch = currentText.match(/([\d.]+)/);
            const avg = avgMatch ? parseFloat(avgMatch[1]) : 5.0;
            const newAvg = ((avg * parseInt(match[1])) + rating) / count;
            ratingSpan.innerHTML = `
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
              ${newAvg.toFixed(1)} (${count} reviews)
            `;
          }
        }

        console.log('✅ Review added successfully!');
        alert('✅ Your review has been submitted successfully!');
        hideReviewModal();
      }
    });
  }

  // ----- 8. CONTACT MODAL CLOSE -----
  const contactModalClose = document.getElementById('contactModalClose');
  const contactModal = document.getElementById('contactModal');

  if (contactModalClose) {
    contactModalClose.addEventListener('click', function() {
      if (contactModal) {
        contactModal.classList.remove('active');
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  if (contactModal) {
    contactModal.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        contactModal.classList.remove('active');
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (contactModal && contactModal.classList.contains('active')) {
        contactModal.classList.remove('active');
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
      }
      if (reviewModal && reviewModal.classList.contains('active')) {
        hideReviewModal();
      }
      if (reportModal && reportModal.classList.contains('active')) {
        closeReportModal();
      }
    }
  });

  // ----- 9. SMOOTH SCROLLING -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // ----- 10. SCROLL ANIMATIONS -----
  const cards = document.querySelectorAll('.detail-shipment-card, .detail-review-item, .detail-vehicle-card, .detail-coverage-card');
  if (cards.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px'
    });

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
      observer.observe(card);
    });
  } else {
    cards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  // ----- 11. PENDING ACTION HANDLER -----
  document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = false;
    const pendingAction = localStorage.getItem('pendingAction');
    const pendingRedirect = localStorage.getItem('pendingRedirect');

    console.log('📋 Checking for pending action:', pendingAction);

    if (pendingAction && isLoggedIn) {
      localStorage.removeItem('pendingAction');
      localStorage.removeItem('pendingRedirect');
      
      console.log('✅ Pending action found:', pendingAction);
      
      if (pendingAction === 'review') {
        console.log('✍️ Showing review form after login');
        setTimeout(function() {
          showReviewModal();
        }, 400);
      } else if (pendingAction === 'report') {
        console.log('🚩 Showing report modal after login');
        closeReportModal();
        setTimeout(function() {
          openReportModal();
        }, 300);
      } else if (pendingAction === 'chat' || pendingAction === 'call') {
        const pendingPhone = localStorage.getItem('pendingPhone');
        if (pendingPhone) {
          localStorage.removeItem('pendingPhone');
          if (pendingAction === 'chat') {
            window.open('https://wa.me/' + pendingPhone, '_blank');
          } else {
            window.location.href = 'tel:' + pendingPhone;
          }
        }
      }
    }
  });

  // ----- 12. FORCE FIX - ALL BUTTONS WORK WITHOUT REFRESH -----
  (function() {
    'use strict';
    
    function showLoginModal(message) {
        if (contactModal) {
            const modalMessage = contactModal.querySelector('p');
            if (modalMessage && message) {
                modalMessage.textContent = message;
            }
            contactModal.classList.add('active');
            contactModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('🔒 Login modal shown');
        }
    }
    
    // Fix Chat Button
    const chatBtnFix = document.getElementById('chatBtn');
    if (chatBtnFix) {
        const newChat = chatBtnFix.cloneNode(true);
        chatBtnFix.parentNode.replaceChild(newChat, chatBtnFix);
        newChat.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('💬 Chat button clicked');
            const isLoggedIn = false;
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to contact this provider.');
                localStorage.setItem('pendingAction', 'chat');
                localStorage.setItem('pendingPhone', '2348012345678');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                window.open('https://wa.me/2348012345678', '_blank');
            }
        });
    }
    
    // Fix Call Button
    const callBtnFix = document.getElementById('callBtn');
    if (callBtnFix) {
        const newCall = callBtnFix.cloneNode(true);
        callBtnFix.parentNode.replaceChild(newCall, callBtnFix);
        newCall.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📞 Call button clicked');
            const isLoggedIn = false;
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to call this provider.');
                localStorage.setItem('pendingAction', 'call');
                localStorage.setItem('pendingPhone', '2348012345678');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                window.location.href = 'tel:2348012345678';
            }
        });
    }
    
    // Fix Review Button
    const reviewBtnFix = document.getElementById('addReviewBtn');
    if (reviewBtnFix) {
        const newReview = reviewBtnFix.cloneNode(true);
        reviewBtnFix.parentNode.replaceChild(newReview, reviewBtnFix);
        newReview.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✍️ Review button clicked');
            const isLoggedIn = false;
            if (!isLoggedIn) {
                showLoginModal('You need to login or register to submit a review.');
                localStorage.setItem('pendingAction', 'review');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                showReviewModal();
            }
        });
    }
    
    // Fix Report Button
    const reportBtnFix = document.getElementById('reportBtn');
    if (reportBtnFix) {
        const newReport = reportBtnFix.cloneNode(true);
        reportBtnFix.parentNode.replaceChild(newReport, reportBtnFix);
        newReport.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚩 Report button clicked');
            const isLoggedIn = false;
            if (!isLoggedIn) {
                if (reportModal) {
                    reportModal.classList.remove('active');
                    reportModal.style.display = 'none';
                }
                showLoginModal('You need to login or register to submit a report.');
                localStorage.setItem('pendingAction', 'report');
                localStorage.setItem('pendingRedirect', window.location.href);
            } else {
                openReportModal();
            }
        });
    }
    
    console.log('✅ All buttons fixed for Logistics Detail!');
  })();

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes reviewSlideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  console.log('🌱 FarmConnect Logistics Detail · logistics-detail.js loaded');
  console.log('🔒 Login required for: Add Review, Report Provider, Chat, Call');

})();


// login.js
// FarmConnect - Login Page Functionality
// Prefix: login-

(function() {
    'use strict';

    // ========== DOM ELEMENTS ==========
    const menuToggle = document.getElementById('loginMenuToggle');
    const navLinks = document.getElementById('loginNavLinks');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const togglePasswordBtn = document.getElementById('loginTogglePassword');

    // ========== NAVBAR TOGGLE ==========
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    document.querySelectorAll('.login-nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = menuToggle?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // ========== PASSWORD VISIBILITY TOGGLE ==========
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // ========== FORM VALIDATION ==========
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(inputElement, message) {
        const parentGroup = inputElement.closest('.login-input-group');
        if (!parentGroup) return;
        
        const existingError = parentGroup.querySelector('.login-error');
        if (existingError) existingError.remove();
        
        const errorSpan = document.createElement('span');
        errorSpan.className = 'login-error';
        errorSpan.style.color = '#EF4444';
        errorSpan.style.fontSize = '0.75rem';
        errorSpan.style.marginTop = '0.25rem';
        errorSpan.textContent = message;
        
        parentGroup.appendChild(errorSpan);
        const iconDiv = parentGroup.querySelector('.login-input-icon');
        if (iconDiv) iconDiv.style.borderColor = '#EF4444';
    }

    function clearError(inputElement) {
        const parentGroup = inputElement.closest('.login-input-group');
        if (!parentGroup) return;
        
        const errorSpan = parentGroup.querySelector('.login-error');
        if (errorSpan) errorSpan.remove();
        
        const iconDiv = parentGroup.querySelector('.login-input-icon');
        if (iconDiv) iconDiv.style.borderColor = '#E5E7EB';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            
            let isValid = true;
            
            if (!email) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            if (!password) {
                showError(passwordInput, 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                clearError(passwordInput);
            }
            
            if (isValid) {
                console.log('[Login Attempt]', {
                    email: email,
                    password: '[HIDDEN]',
                    timestamp: new Date().toISOString()
                });
                
                // Use global toast if available
                if (typeof showToast === 'function') {
                    showToast('Login successful! Redirecting to dashboard...', 'success');
                } else {
                    alert('Login successful! Redirecting to dashboard...');
                }
            }
        });
    }
    
    // Real-time clear errors
    if (emailInput) {
        emailInput.addEventListener('input', function() { clearError(emailInput); });
    }
    if (passwordInput) {
        passwordInput.addEventListener('input', function() { clearError(passwordInput); });
    }

    // ========== FORGOT PASSWORD ==========
    const forgotLink = document.querySelector('.login-forgot');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('[Forgot Password] Requested');
            if (typeof showToast === 'function') {
                showToast('Password reset link sent to your email.', 'info');
            } else {
                alert('Password reset link would be sent to your email.');
            }
        });
    }

    // ========== RESIZE HANDLER ==========
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuToggle?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    console.log('FarmConnect Login page initialized');
})();


// register.js
// FarmConnect - Register Page Functionality
// Prefix: register-

(function() {
    'use strict';

    // ========== DOM ELEMENTS ==========
    const menuToggle = document.getElementById('registerMenuToggle');
    const navLinks = document.getElementById('registerNavLinks');
    const farmerBtn = document.getElementById('registerFarmerBtn');
    const buyerBtn = document.getElementById('registerBuyerBtn');
    const logisticsBtn = document.getElementById('registerLogisticsBtn');
    const farmerFields = document.getElementById('farmerFields');
    const buyerFields = document.getElementById('buyerFields');
    const logisticsFields = document.getElementById('logisticsFields');
    const registerForm = document.getElementById('registerForm');
    const togglePasswordBtn = document.getElementById('registerTogglePassword');

    // Common fields
    const fullNameInput = document.getElementById('registerFullName');
    const emailInput = document.getElementById('registerEmail');
    const phoneInput = document.getElementById('registerPhone');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');

    // Farmer fields
    const farmNameInput = document.getElementById('registerFarmName');
    const locationSelect = document.getElementById('registerLocation');

    // Buyer fields
    const buyerLocationSelect = document.getElementById('registerBuyerLocation');

    // Logistics fields
    const companyNameInput = document.getElementById('registerCompanyName');
    const serviceTypeSelect = document.getElementById('registerServiceType');
    const coverageAreaSelect = document.getElementById('registerCoverageArea');

    let currentUserType = 'farmer';

    // ========== NAVBAR TOGGLE ==========
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    document.querySelectorAll('.register-nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = menuToggle?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // ========== PASSWORD VISIBILITY TOGGLE ==========
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // ========== USER TYPE TOGGLE ==========
    function setUserType(type) {
        currentUserType = type;
        
        // Update active button
        [farmerBtn, buyerBtn, logisticsBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (type === 'farmer') {
            farmerBtn.classList.add('active');
            farmerFields.style.display = 'block';
            buyerFields.style.display = 'none';
            logisticsFields.style.display = 'none';
            // Make farmer fields required
            if (locationSelect) locationSelect.required = true;
            if (buyerLocationSelect) buyerLocationSelect.required = false;
            if (serviceTypeSelect) serviceTypeSelect.required = false;
            if (coverageAreaSelect) coverageAreaSelect.required = false;
            if (companyNameInput) companyNameInput.required = false;
        } else if (type === 'buyer') {
            buyerBtn.classList.add('active');
            farmerFields.style.display = 'none';
            buyerFields.style.display = 'block';
            logisticsFields.style.display = 'none';
            if (locationSelect) locationSelect.required = false;
            if (buyerLocationSelect) buyerLocationSelect.required = true;
            if (serviceTypeSelect) serviceTypeSelect.required = false;
            if (coverageAreaSelect) coverageAreaSelect.required = false;
            if (companyNameInput) companyNameInput.required = false;
        } else if (type === 'logistics') {
            logisticsBtn.classList.add('active');
            farmerFields.style.display = 'none';
            buyerFields.style.display = 'none';
            logisticsFields.style.display = 'block';
            if (locationSelect) locationSelect.required = false;
            if (buyerLocationSelect) buyerLocationSelect.required = false;
            if (serviceTypeSelect) serviceTypeSelect.required = true;
            if (coverageAreaSelect) coverageAreaSelect.required = true;
            if (companyNameInput) companyNameInput.required = true;
        }
        
        console.log('[Register] User type changed to:', type);
    }

    if (farmerBtn) farmerBtn.addEventListener('click', () => setUserType('farmer'));
    if (buyerBtn) buyerBtn.addEventListener('click', () => setUserType('buyer'));
    if (logisticsBtn) logisticsBtn.addEventListener('click', () => setUserType('logistics'));

    // ========== FORM VALIDATION ==========
    function showError(inputElement, message) {
        const parentGroup = inputElement.closest('.register-input-group');
        if (!parentGroup) return;
        
        const existingError = parentGroup.querySelector('.register-error');
        if (existingError) existingError.remove();
        
        const errorSpan = document.createElement('span');
        errorSpan.className = 'register-error';
        errorSpan.textContent = message;
        
        parentGroup.appendChild(errorSpan);
        const iconDiv = parentGroup.querySelector('.register-input-icon');
        if (iconDiv) iconDiv.style.borderColor = '#EF4444';
    }

    function clearError(inputElement) {
        const parentGroup = inputElement.closest('.register-input-group');
        if (!parentGroup) return;
        
        const errorSpan = parentGroup.querySelector('.register-error');
        if (errorSpan) errorSpan.remove();
        
        const iconDiv = parentGroup.querySelector('.register-input-icon');
        if (iconDiv) iconDiv.style.borderColor = '#E5E7EB';
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    // ========== FORM SUBMISSION ==========
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = fullNameInput ? fullNameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
            
            let isValid = true;
            
            // Validate Full Name
            if (!fullName) {
                showError(fullNameInput, 'Full name is required');
                isValid = false;
            } else {
                clearError(fullNameInput);
            }
            
            // Validate Email
            if (!email) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            // Validate Phone
            if (!phone) {
                showError(phoneInput, 'Phone number is required');
                isValid = false;
            } else {
                clearError(phoneInput);
            }
            
            // Validate Password
            if (!password) {
                showError(passwordInput, 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                clearError(passwordInput);
            }
            
            // Validate Confirm Password
            if (!confirmPassword) {
                showError(confirmPasswordInput, 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError(confirmPasswordInput, 'Passwords do not match');
                isValid = false;
            } else {
                clearError(confirmPasswordInput);
            }
            
            // Role-specific validation
            if (currentUserType === 'farmer') {
                const location = locationSelect ? locationSelect.value : '';
                if (!location) {
                    showError(locationSelect, 'Please select your location');
                    isValid = false;
                } else {
                    clearError(locationSelect);
                }
            } else if (currentUserType === 'buyer') {
                const location = buyerLocationSelect ? buyerLocationSelect.value : '';
                if (!location) {
                    showError(buyerLocationSelect, 'Please select your location');
                    isValid = false;
                } else {
                    clearError(buyerLocationSelect);
                }
            } else if (currentUserType === 'logistics') {
                const companyName = companyNameInput ? companyNameInput.value.trim() : '';
                const serviceType = serviceTypeSelect ? serviceTypeSelect.value : '';
                const coverageArea = coverageAreaSelect ? coverageAreaSelect.value : '';
                
                if (!companyName) {
                    showError(companyNameInput, 'Company name is required');
                    isValid = false;
                } else {
                    clearError(companyNameInput);
                }
                
                if (!serviceType) {
                    showError(serviceTypeSelect, 'Please select service type');
                    isValid = false;
                } else {
                    clearError(serviceTypeSelect);
                }
                
                if (!coverageArea) {
                    showError(coverageAreaSelect, 'Please select coverage area');
                    isValid = false;
                } else {
                    clearError(coverageAreaSelect);
                }
            }
            
            if (isValid) {
                const registrationData = {
                    userType: currentUserType,
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    timestamp: new Date().toISOString()
                };
                
                if (currentUserType === 'farmer') {
                    registrationData.farmName = farmNameInput ? farmNameInput.value.trim() : '';
                    registrationData.location = locationSelect ? locationSelect.value : '';
                } else if (currentUserType === 'buyer') {
                    registrationData.location = buyerLocationSelect ? buyerLocationSelect.value : '';
                } else if (currentUserType === 'logistics') {
                    registrationData.companyName = companyNameInput ? companyNameInput.value.trim() : '';
                    registrationData.serviceType = serviceTypeSelect ? serviceTypeSelect.value : '';
                    registrationData.coverageArea = coverageAreaSelect ? coverageAreaSelect.value : '';
                }
                
                console.log('[Registration Success]', registrationData);
                
                if (typeof showToast === 'function') {
                    showToast(`Registration successful! Welcome to FarmConnect, ${fullName}!`, 'success');
                } else {
                    alert(`Registration successful! Welcome to FarmConnect, ${fullName}!`);
                }
            }
        });
    }

    // ========== REAL-TIME CLEAR ERRORS ==========
    const clearOnInput = (input) => {
        if (input) {
            input.addEventListener('input', () => clearError(input));
        }
    };
    
    clearOnInput(fullNameInput);
    clearOnInput(emailInput);
    clearOnInput(phoneInput);
    clearOnInput(passwordInput);
    clearOnInput(confirmPasswordInput);
    clearOnInput(locationSelect);
    clearOnInput(buyerLocationSelect);
    clearOnInput(companyNameInput);
    clearOnInput(serviceTypeSelect);
    clearOnInput(coverageAreaSelect);

    // ========== RESIZE HANDLER ==========
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuToggle?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    console.log('FarmConnect Register page initialized');
})();


// ========== UNIFIED HAMBURGER TOGGLE ==========
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
            const expanded = navLinks.classList.contains('active');
            hamburgerBtn.setAttribute('aria-expanded', expanded);
        });
        
        // Close menu when clicking a link
        const navMenuLinks = document.querySelectorAll('.home-nav-link');
        navMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
    
    // Close menu on resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (hamburgerBtn) {
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});


// =============================================================
// about.js · FarmConnect About Page
// clean, modular, production-ready
// =============================================================

(function() {
  'use strict';

  // ----- DOM refs (navbar removed per instruction) -----

  // ----- 1. SMOOTH SCROLLING -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----- 2. SCROLL REVEAL ANIMATIONS (fade-up) -----
  const revealElements = document.querySelectorAll('.about-problem-card, .about-solution-card, .about-trust-card');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  } else {
    revealElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  console.log('🌱 FarmConnect About Page · about.js loaded');
})();


// =============================================================
// contact.js · FarmConnect Contact Page
// clean, modular, production-ready
// =============================================================

(function() {
  'use strict';

  // ----- DOM refs (navbar removed per instruction) -----

  // ----- 1. FAQ ACCORDION -----
  const faqQuestions = document.querySelectorAll('.contact-faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQ items
      document.querySelectorAll('.contact-faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
        }
      });

      // Toggle current FAQ
      if (isActive) {
        faqItem.classList.remove('active');
      } else {
        faqItem.classList.add('active');
      }
    });
  });

  // ----- 2. CONTACT FORM SUBMISSION -----
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value?.trim() || '';
      const email = document.getElementById('contactEmail')?.value?.trim() || '';
      const subject = document.getElementById('contactSubject')?.value?.trim() || '';
      const message = document.getElementById('contactMessage')?.value?.trim() || '';

      console.log('📧 Contact Form Submission:');
      console.log('  Name:', name || '(empty)');
      console.log('  Email:', email || '(empty)');
      console.log('  Subject:', subject || '(empty)');
      console.log('  Message:', message || '(empty)');

      if (name && email && subject && message) {
        alert('✅ Your message has been sent! We\'ll respond within 24 hours.');
        contactForm.reset();
      } else {
        alert('⚠️ Please fill in all required fields.');
      }
    });
  }

  // ----- 3. SMOOTH SCROLLING -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----- 4. SCROLL REVEAL ANIMATIONS (fade-up) -----
  const revealElements = document.querySelectorAll('.contact-info-card, .contact-faq-item');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  } else {
    revealElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  console.log('🌱 FarmConnect Contact Page · contact.js loaded');
})();







// ============================================================
// FIX: HOME PAGE SEARCH - REDIRECT WITH PARAMETERS
// ============================================================

// Override the existing handleSearch function
(function() {
  // Get the original search elements
  const searchBtn = document.getElementById('searchBtn');
  const searchProduct = document.getElementById('searchProduct');
  const searchLocation = document.getElementById('searchLocation');
  const searchRole = document.getElementById('searchRole');

  // New search function that redirects
  function handleSearchRedirect(e) {
    if (e) e.preventDefault();

    const product = searchProduct ? searchProduct.value.trim() : '';
    const location = searchLocation ? searchLocation.value.trim() : '';
    const role = searchRole ? searchRole.value : 'buyer';

    console.log('🔍 FarmConnect Search:');
    console.log('  Product:', product || '(empty)');
    console.log('  Location:', location || '(empty)');
    console.log('  Role:', role);

    // Build search parameters
    const params = new URLSearchParams();
    if (product) params.append('search', product);
    if (location) params.append('location', location);
    if (role) params.append('role', role);

    // Redirect based on role
    let redirectUrl = '';
    switch(role) {
      case 'farmer':
        redirectUrl = 'farmers.html';
        break;
      case 'logistics':
        redirectUrl = 'logistics.html';
        break;
      case 'buyer':
      default:
        redirectUrl = 'marketplace.html';
        break;
    }

    if (params.toString()) {
      redirectUrl += '?' + params.toString();
    }

    console.log('🔀 Redirecting to:', redirectUrl);
    window.location.href = redirectUrl;
  }

  // Replace the existing event listeners
  if (searchBtn) {
    // Remove all existing listeners by cloning
    const newBtn = searchBtn.cloneNode(true);
    searchBtn.parentNode.replaceChild(newBtn, searchBtn);
    newBtn.addEventListener('click', handleSearchRedirect);
  }

  // Handle Enter key on inputs
  const searchInputs = [searchProduct, searchLocation].filter(Boolean);
  searchInputs.forEach(input => {
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    newInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchRedirect(e);
      }
    });
  });

  console.log('✅ Home search redirect fixed!');

})();

// ============================================================
// AUTO FILTER FROM URL PARAMETERS
// ============================================================

(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search') || '';
  const location = urlParams.get('location') || '';

  if (!searchTerm && !location) {
    console.log('ℹ️ No search parameters found');
    return;
  }

  console.log('🔍 Auto-filter from URL:', { searchTerm, location });

  setTimeout(function() {
    // Check which page we're on
    const marketplaceSearch = document.getElementById('searchProduct');
    const farmersSearch = document.getElementById('searchFarmer');
    const logisticsSearch = document.getElementById('searchLogistics');

    if (marketplaceSearch) {
      // MARKETPLACE PAGE
      console.log('📍 On Marketplace page');
      
      if (searchTerm) {
        marketplaceSearch.value = searchTerm;
        marketplaceSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      const locFilter = document.getElementById('filterLocation');
      if (locFilter && location) {
        for (let i = 0; i < locFilter.options.length; i++) {
          if (locFilter.options[i].value.toLowerCase() === location.toLowerCase()) {
            locFilter.value = locFilter.options[i].value;
            locFilter.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      }
      
      setTimeout(function() {
        const filterBtn = document.getElementById('filterBtn');
        if (filterBtn) filterBtn.click();
        console.log('✅ Marketplace filtered');
      }, 300);
      
    } else if (farmersSearch) {
      // FARMERS PAGE
      console.log('📍 On Farmers page');
      
      if (searchTerm) {
        farmersSearch.value = searchTerm;
        farmersSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      const locFilter = document.getElementById('filterLocation');
      if (locFilter && location) {
        for (let i = 0; i < locFilter.options.length; i++) {
          if (locFilter.options[i].value.toLowerCase() === location.toLowerCase()) {
            locFilter.value = locFilter.options[i].value;
            locFilter.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      }
      
      setTimeout(function() {
        const filterBtn = document.getElementById('filterBtn');
        if (filterBtn) filterBtn.click();
        console.log('✅ Farmers filtered');
      }, 300);
      
    } else if (logisticsSearch) {
      // LOGISTICS PAGE
      console.log('📍 On Logistics page');
      
      if (searchTerm) {
        logisticsSearch.value = searchTerm;
        logisticsSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      const locFilter = document.getElementById('filterLocation');
      if (locFilter && location) {
        for (let i = 0; i < locFilter.options.length; i++) {
          if (locFilter.options[i].value.toLowerCase() === location.toLowerCase()) {
            locFilter.value = locFilter.options[i].value;
            locFilter.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      }
      
      setTimeout(function() {
        const filterBtn = document.getElementById('filterBtn');
        if (filterBtn) filterBtn.click();
        console.log('✅ Logistics filtered');
      }, 300);
    }
  }, 600);

})();

console.log('🌱 FarmConnect Search System Fixed');
console.log('📌 Search for: Products (Buyer) | Farmers | Logistics');

// ============================================================
// FEATURED LISTINGS - SHOW MORE / SHOW LESS
// ============================================================

(function() {
    'use strict';

    const showMoreBtn = document.getElementById('showMoreBtn');
    const featuredItems = document.querySelectorAll('.home-featured-item');
    const itemsToShow = 4; // Show 4 items initially
    let isExpanded = false;

    // Hide items beyond the initial limit
    function initFeaturedItems() {
        featuredItems.forEach((item, index) => {
            if (index >= itemsToShow) {
                item.style.display = 'none';
            } else {
                item.style.display = '';
            }
        });
    }

    // Toggle show more/less
    function toggleFeaturedItems() {
        isExpanded = !isExpanded;

        featuredItems.forEach((item, index) => {
            if (index >= itemsToShow) {
                item.style.display = isExpanded ? '' : 'none';
            }
        });

        if (showMoreBtn) {
            if (isExpanded) {
                showMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
            } else {
                showMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show More';
            }
        }
    }

    // Initialize
    if (featuredItems.length > 0) {
        initFeaturedItems();

        if (showMoreBtn) {
            // Only show the button if there are more items than the initial limit
            if (featuredItems.length <= itemsToShow) {
                showMoreBtn.style.display = 'none';
            } else {
                showMoreBtn.addEventListener('click', toggleFeaturedItems);
            }
        }
    }

    console.log('⭐ Featured listings initialized');
    console.log(`📦 Showing ${itemsToShow} of ${featuredItems.length} featured items`);

})();






// =============================================================
// FARMER DASHBOARD - NAMESPACED
// =============================================================
(function() {
    'use strict';
    
    // Only run on farmer dashboard
    if (!document.getElementById('farmerSidebar')) {
        return;
    }
    
    // ... all farmer dashboard code here ...

    // =============================================================
// farmer-dashboard.js · FarmConnect Farmer Dashboard
// Complete, production-quality, no alerts
// =============================================================

(function() {
    'use strict';

    // =============================================================
    // STATE
    // =============================================================
    let currentSection = 'overview';
    let isSidebarCollapsed = false;
    let isDarkMode = false;
    let products = [];
    let enquiries = [];
    let reviews = [];
    let notifications = [];
    let isEditingProduct = false;
    let editingProductId = null;

    // =============================================================
    // DOM REFS
    // =============================================================
    const sidebar = document.getElementById('farmerSidebar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const navbarToggle = document.getElementById('navbarToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const modal = document.getElementById('farmerModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalMessage = document.getElementById('modalMessage');
    const modalFields = document.getElementById('modalFields');
    const modalFooter = document.getElementById('modalFooter');
    const toastContainer = document.getElementById('toastContainer');

    // Profile
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImageUpload = document.getElementById('profileImageUpload');
    const profileImagePreview = document.getElementById('profileImagePreview');
    const farmNameInput = document.getElementById('farmName');
    const specializationInput = document.getElementById('specialization');
    const locationInput = document.getElementById('location');
    const experienceInput = document.getElementById('experience');
    const whatsappInput = document.getElementById('whatsapp');
    const phoneInput = document.getElementById('phone');
    const bioInput = document.getElementById('bio');
    const previewName = document.getElementById('previewName');
    const previewSpecialization = document.getElementById('previewSpecialization');
    const previewLocation = document.getElementById('previewLocation');
    const previewExperience = document.getElementById('previewExperience');
    const previewBio = document.getElementById('previewBio');
    const previewAvatar = document.getElementById('previewAvatar');
    const previewAvatarText = document.getElementById('previewAvatarText');
    const profileForm = document.getElementById('profileForm');

    // Products
    const productsGrid = document.getElementById('productsGrid');
    const productSearch = document.getElementById('productSearch');
    const productCategoryFilter = document.getElementById('productCategoryFilter');

    // Add Product
    const productImageInput = document.getElementById('productImageInput');
    const productImageUpload = document.getElementById('productImageUpload');
    const productImagePreview = document.getElementById('productImagePreview');
    const productNameInput = document.getElementById('productName');
    const productCategoryInput = document.getElementById('productCategory');
    const productTypeInput = document.getElementById('productType');
    const productDescriptionInput = document.getElementById('productDescription');
    const productPriceInput = document.getElementById('productPrice');
    const productQuantityInput = document.getElementById('productQuantity');
    const productPackagingInput = document.getElementById('productPackaging');
    const productMinOrderInput = document.getElementById('productMinOrder');
    const productStatusInput = document.getElementById('productStatus');
    const addProductForm = document.getElementById('addProductForm');

    // Product Preview
    const previewProductImage = document.getElementById('previewProductImage');
    const previewProductName = document.getElementById('previewProductName');
    const previewProductPrice = document.getElementById('previewProductPrice');
    const previewProductStatus = document.getElementById('previewProductStatus');
    const previewProductCategory = document.getElementById('previewProductCategory');
    const previewProductDesc = document.getElementById('previewProductDesc');
    const previewProductType = document.getElementById('previewProductType');
    const previewProductQty = document.getElementById('previewProductQty');
    const previewProductPackaging = document.getElementById('previewProductPackaging');
    const previewProductMinOrder = document.getElementById('previewProductMinOrder');

    // Enquiries
    const enquiriesList = document.getElementById('enquiriesList');
    const enquirySearch = document.getElementById('enquirySearch');
    const enquiryStatusFilter = document.getElementById('enquiryStatusFilter');

    // Reviews
    const reviewsList = document.getElementById('reviewsList');
    const reviewAvg = document.getElementById('reviewAvg');
    const reviewCount = document.getElementById('reviewCount');

    // Notifications
    const notificationsList = document.getElementById('notificationsList');
    const notificationDot = document.getElementById('notificationDot');
    const notificationIcon = document.getElementById('notificationIcon');

    // Settings
    const settingsDarkMode = document.getElementById('settingsDarkMode');
    const changePasswordBtn = document.getElementById('changePasswordBtn');

    // Welcome
    const welcomeName = document.getElementById('welcomeName');
    const totalProducts = document.getElementById('totalProducts');
    const totalEnquiries = document.getElementById('totalEnquiries');
    const avgRating = document.getElementById('avgRating');
    const totalReviews = document.getElementById('totalReviews');
    const completionFill = document.getElementById('completionFill');
    const completionPercent = document.getElementById('completionPercent');

    // =============================================================
    // INITIAL DATA
    // =============================================================
    function initData() {
        // Sample products
        products = [
            {
                id: 1,
                name: '50kg Bag of Rice',
                category: 'Grains',
                type: 'Rice',
                description: 'Premium quality rice sourced directly from our farm.',
                price: 45000,
                quantity: 200,
                packaging: '50kg Bag',
                minOrder: '1 Bag',
                status: 'In Stock',
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop',
                rating: 4.8,
                dateAdded: '2026-01-15'
            },
            {
                id: 2,
                name: 'Organic Maize (100kg)',
                category: 'Grains',
                type: 'Maize',
                description: 'Fresh organic maize harvested from our farm.',
                price: 28000,
                quantity: 45,
                packaging: '100kg Bag',
                minOrder: '1 Bag',
                status: 'Limited',
                image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=250&fit=crop',
                rating: 4.2,
                dateAdded: '2026-02-20'
            },
            {
                id: 3,
                name: 'Cassava Chips (ton)',
                category: 'Crops',
                type: 'Cassava',
                description: 'Premium cassava chips for industrial use.',
                price: 62000,
                quantity: 20,
                packaging: 'Ton',
                minOrder: '1 Ton',
                status: 'In Stock',
                image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&h=250&fit=crop',
                rating: 4.7,
                dateAdded: '2026-03-01'
            }
        ];

        // Sample enquiries
        enquiries = [
            {
                id: 1,
                buyer: 'Chioma Okafor',
                contactMethod: 'WhatsApp',
                product: '50kg Bag of Rice',
                date: '2026-03-20',
                status: 'New'
            },
            {
                id: 2,
                buyer: 'Emeka Nwachukwu',
                contactMethod: 'Phone',
                product: 'Organic Maize (100kg)',
                date: '2026-03-18',
                status: 'Contacted'
            },
            {
                id: 3,
                buyer: 'Aisha Mohammed',
                contactMethod: 'WhatsApp',
                product: 'Cassava Chips (ton)',
                date: '2026-03-15',
                status: 'Closed'
            }
        ];

        // Sample reviews
        reviews = [
            {
                id: 1,
                buyer: 'Chioma Okafor',
                rating: 5,
                text: 'Excellent quality rice! The grains are long and fluffy. Will definitely order again.',
                date: 'March 15, 2026',
                response: ''
            },
            {
                id: 2,
                buyer: 'Emeka Nwachukwu',
                rating: 4,
                text: 'Great produce and fast delivery. The farmer was very responsive.',
                date: 'February 28, 2026',
                response: 'Thank you for your kind words, Emeka! We appreciate your support.'
            },
            {
                id: 3,
                buyer: 'Aisha Mohammed',
                rating: 5,
                text: 'Best farmer I\'ve worked with in Ibadan. The quality is consistently excellent.',
                date: 'February 10, 2026',
                response: ''
            }
        ];

        // Sample notifications
        notifications = [
            {
                id: 1,
                title: 'New Review Received',
                message: 'Chioma Okafor left a 5-star review on your 50kg Bag of Rice.',
                time: '2 hours ago',
                read: false,
                link: 'reviews'
            },
            {
                id: 2,
                title: 'New Enquiry Received',
                message: 'Emeka Nwachukwu is interested in your Organic Maize (100kg).',
                time: '5 hours ago',
                read: false,
                link: 'enquiries'
            },
            {
                id: 3,
                title: 'Product Updated',
                message: 'Your product Cassava Chips (ton) has been updated successfully.',
                time: '1 day ago',
                read: true,
                link: 'products'
            }
        ];
    }

    // =============================================================
    // TOAST SYSTEM
    // =============================================================
    function showToast(title, message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `farmer-toast farmer-toast-${type}`;
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        toast.innerHTML = `
            <div class="farmer-toast-icon"><i class="fas ${icons[type] || icons.success}"></i></div>
            <div class="farmer-toast-content">
                <div class="farmer-toast-title">${title}</div>
                <div class="farmer-toast-message">${message}</div>
            </div>
            <button class="farmer-toast-close">&times;</button>
        `;
        toast.querySelector('.farmer-toast-close').addEventListener('click', () => {
            toast.remove();
        });
        toastContainer.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 5000);
    }

    // =============================================================
    // MODAL SYSTEM
    // =============================================================
    function openModal(title, message, fields = '', confirmText = 'Confirm', cancelText = 'Cancel', confirmCallback = null) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalFields.innerHTML = fields || '';
        modalConfirm.textContent = confirmText;
        modalCancel.textContent = cancelText;
        modalFooter.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Store callback
        modal._confirmCallback = confirmCallback || null;
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalFields.innerHTML = '';
        modal._confirmCallback = null;
    }

    // Modal event listeners
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    modalConfirm.addEventListener('click', function() {
        if (modal._confirmCallback) {
            modal._confirmCallback();
        } else {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // =============================================================
    // NAVIGATION
    // =============================================================
    function navigateTo(section) {
        document.querySelectorAll('.farmer-sidebar-link[data-section]').forEach(l => {
            l.classList.toggle('active', l.dataset.section === section);
        });
        document.querySelectorAll('.farmer-section').forEach(s => {
            s.classList.toggle('active', s.id === 'section-' + section);
        });
        const titles = {
            overview: 'Overview',
            profile: 'My Profile',
            products: 'My Products',
            'add-product': 'Add Product',
            enquiries: 'Enquiries',
            reviews: 'Reviews',
            notifications: 'Notifications',
            settings: 'Settings'
        };
        document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
        currentSection = section;
        if (section === 'overview') updateOverview();
        if (section === 'products') renderProducts();
        if (section === 'enquiries') renderEnquiries();
        if (section === 'reviews') renderReviews();
        if (section === 'notifications') renderNotifications();
    }

    // Sidebar links
    document.querySelectorAll('.farmer-sidebar-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            navigateTo(section);
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });

    // =============================================================
    // SIDEBAR COLLAPSE
    // =============================================================
    sidebarCollapse.addEventListener('click', function() {
        isSidebarCollapsed = !isSidebarCollapsed;
        sidebar.classList.toggle('collapsed', isSidebarCollapsed);
        localStorage.setItem('farmerSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    });

    const savedCollapse = localStorage.getItem('farmerSidebarCollapsed');
    if (savedCollapse === 'true') {
        isSidebarCollapsed = true;
        sidebar.classList.add('collapsed');
    }

    // =============================================================
    // MOBILE MENU
    // =============================================================
    navbarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('mobile-open');
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('mobile-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !navbarToggle.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
                const icon = navbarToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // =============================================================
    // DARK MODE
    // =============================================================
    darkModeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('farmer-dark-mode', isDarkMode);
        const icon = this.querySelector('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('farmerDarkMode', JSON.stringify(isDarkMode));
        if (settingsDarkMode) settingsDarkMode.checked = isDarkMode;
    });

    const savedDarkMode = localStorage.getItem('farmerDarkMode');
    if (savedDarkMode === 'true') {
        isDarkMode = true;
        document.body.classList.add('farmer-dark-mode');
        darkModeToggle.querySelector('i').className = 'fas fa-sun';
        if (settingsDarkMode) settingsDarkMode.checked = true;
    }

    settingsDarkMode.addEventListener('change', function() {
        darkModeToggle.click();
    });

    // =============================================================
    // PROFILE PREVIEW - LIVE UPDATE
    // =============================================================
    function updateProfilePreview() {
        const name = farmNameInput.value || 'Farm Name';
        const specialization = specializationInput.value || 'Specialization';
        const location = locationInput.value || 'Location';
        const experience = experienceInput.value || '0';
        const bio = bioInput.value || 'No bio provided.';

        previewName.textContent = name;
        previewSpecialization.innerHTML = `<i class="fas fa-tractor"></i> ${specialization}`;
        previewLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${location}`;
        previewExperience.innerHTML = `<i class="fas fa-clock"></i> ${experience} years experience`;
        previewBio.textContent = bio;

        // Update initials
        const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        previewAvatarText.textContent = initials;

        // Update welcome name
        welcomeName.textContent = name.split(' ')[0] || 'Farmer';

        // Update profile completion
        updateCompletion();
    }

    function updateCompletion() {
        const fields = [
            farmNameInput.value,
            specializationInput.value,
            locationInput.value,
            experienceInput.value,
            whatsappInput.value,
            phoneInput.value,
            bioInput.value
        ];
        const filled = fields.filter(f => f && f.trim() !== '').length;
        const total = fields.length;
        const percent = Math.round((filled / total) * 100);
        completionFill.style.width = percent + '%';
        completionPercent.textContent = percent + '%';
    }

    // Profile form listeners
    [farmNameInput, specializationInput, locationInput, experienceInput, whatsappInput, phoneInput, bioInput].forEach(input => {
        input.addEventListener('input', updateProfilePreview);
    });

    // Profile image upload
    profileImageUpload.addEventListener('click', () => profileImageInput.click());
    profileImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            profileImagePreview.innerHTML = `<img src="${event.target.result}" alt="Profile">`;
            previewAvatar.innerHTML = `<img src="${event.target.result}" alt="Profile">`;
            previewAvatar.style.background = 'transparent';
        };
        reader.readAsDataURL(file);
    });

    // Profile form submit
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Success', 'Profile updated successfully!', 'success');
        updateProfilePreview();
    });

    // =============================================================
    // PRODUCTS
    // =============================================================
    function renderProducts() {
        const search = productSearch.value.toLowerCase();
        const category = productCategoryFilter.value;

        let filtered = products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(search);
            const matchCategory = !category || p.category === category;
            return matchSearch && matchCategory;
        });

        if (filtered.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--farmer-text-secondary);">
                    <i class="fas fa-box" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i>
                    <p>No products found. <a href="#" onclick="document.querySelector('[data-section=\\'add-product\\']').click();return false;" style="color:#2D7D3A;">Add your first product</a></p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = filtered.map(p => `
            <div class="farmer-product-card">
                <div class="farmer-product-image" style="background-image: url('${p.image || 'https://via.placeholder.com/400x250/E5E7EB/6B7280?text=No+Image'}');"></div>
                <div class="farmer-product-body">
                    <div class="farmer-product-name">${p.name}</div>
                    <div class="farmer-product-meta">
                        <span>${p.category}</span>
                        <span class="farmer-product-price">₦${p.price.toLocaleString()}</span>
                    </div>
                    <div class="farmer-product-meta">
                        <span>Qty: ${p.quantity}</span>
                        <span class="farmer-product-status farmer-status-${p.status === 'In Stock' ? 'available' : p.status === 'Limited' ? 'low' : 'sold'}">${p.status}</span>
                    </div>
                    <div class="farmer-product-meta">
                        <span>⭐ ${p.rating}</span>
                        <span>${p.dateAdded}</span>
                    </div>
                    <div class="farmer-product-actions">
                        <button class="farmer-btn farmer-btn-outline farmer-btn-sm" data-action="view-product" data-id="${p.id}">View</button>
                        <button class="farmer-btn farmer-btn-outline farmer-btn-sm" data-action="edit-product" data-id="${p.id}">Edit</button>
                        <button class="farmer-btn farmer-btn-outline farmer-btn-sm" data-action="delete-product" data-id="${p.id}" style="color:#EF4444;border-color:#EF4444;">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Product actions
        document.querySelectorAll('[data-action="view-product"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const product = products.find(p => p.id === id);
                if (product) {
                    openModal(
                        product.name,
                        '',
                        `
                            <div style="display:flex;gap:1rem;margin-bottom:1rem;">
                                <div style="width:100px;height:100px;border-radius:12px;background:url('${product.image || 'https://via.placeholder.com/100x100/E5E7EB/6B7280?text=No+Image'}') center/cover;flex-shrink:0;"></div>
                                <div>
                                    <p><strong>Category:</strong> ${product.category}</p>
                                    <p><strong>Price:</strong> ₦${product.price.toLocaleString()}</p>
                                    <p><strong>Quantity:</strong> ${product.quantity}</p>
                                    <p><strong>Status:</strong> ${product.status}</p>
                                </div>
                            </div>
                            <p><strong>Description:</strong> ${product.description}</p>
                            <p><strong>Packaging:</strong> ${product.packaging}</p>
                            <p><strong>Min Order:</strong> ${product.minOrder}</p>
                            <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
                            <p><strong>Date Added:</strong> ${product.dateAdded}</p>
                        `,
                        'Close'
                    );
                    modalCancel.style.display = 'none';
                    modalConfirm.textContent = 'Close';
                    modal._confirmCallback = closeModal;
                    setTimeout(() => { modalCancel.style.display = ''; modalConfirm.textContent = 'Confirm'; }, 100);
                }
            });
        });

        document.querySelectorAll('[data-action="edit-product"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const product = products.find(p => p.id === id);
                if (product) {
                    // Navigate to add product with edit mode
                    isEditingProduct = true;
                    editingProductId = id;
                    navigateTo('add-product');
                    // Fill form
                    productNameInput.value = product.name;
                    productCategoryInput.value = product.category;
                    productTypeInput.value = product.type || '';
                    productDescriptionInput.value = product.description;
                    productPriceInput.value = product.price;
                    productQuantityInput.value = product.quantity;
                    productPackagingInput.value = product.packaging || '';
                    productMinOrderInput.value = product.minOrder || '';
                    productStatusInput.value = product.status;
                    if (product.image) {
                        productImagePreview.innerHTML = `<img src="${product.image}" alt="Product">`;
                    }
                    document.querySelector('#section-add-product h2').textContent = 'Edit Product';
                    document.querySelector('#saveProductBtn').textContent = 'Update Product';
                    showToast('Info', 'Editing product. Update and save.', 'info');
                }
            });
        });

        document.querySelectorAll('[data-action="delete-product"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const product = products.find(p => p.id === id);
                if (product) {
                    openModal(
                        'Delete Product',
                        `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
                        '',
                        'Delete',
                        'Cancel',
                        function() {
                            products = products.filter(p => p.id !== id);
                            renderProducts();
                            updateOverview();
                            closeModal();
                            showToast('Deleted', `"${product.name}" has been deleted.`, 'success');
                        }
                    );
                }
            });
        });

        // Update total products
        totalProducts.textContent = products.length;
    }

    // Product search/filter
    productSearch.addEventListener('input', renderProducts);
    productCategoryFilter.addEventListener('change', renderProducts);

    // =============================================================
    // ADD PRODUCT - LIVE PREVIEW
    // =============================================================
    function updateProductPreview() {
        const name = productNameInput.value || 'Product Name';
        const price = productPriceInput.value || '0';
        const status = productStatusInput.value || 'In Stock';
        const category = productCategoryInput.value || 'Category';
        const desc = productDescriptionInput.value || 'Description goes here...';
        const type = productTypeInput.value || '-';
        const qty = productQuantityInput.value || '-';
        const packaging = productPackagingInput.value || '-';
        const minOrder = productMinOrderInput.value || '-';

        previewProductName.textContent = name;
        previewProductPrice.textContent = `₦${parseInt(price).toLocaleString()}`;
        previewProductStatus.textContent = status;
        previewProductStatus.className = `farmer-preview-product-status farmer-status-${status === 'In Stock' ? 'available' : status === 'Limited' ? 'low' : 'sold'}`;
        previewProductCategory.innerHTML = `<i class="fas fa-tag"></i> ${category}`;
        previewProductDesc.textContent = desc;
        previewProductType.textContent = type;
        previewProductQty.textContent = qty;
        previewProductPackaging.textContent = packaging;
        previewProductMinOrder.textContent = minOrder;
    }

    // Product form listeners
    [productNameInput, productCategoryInput, productTypeInput, productDescriptionInput, productPriceInput, productQuantityInput, productPackagingInput, productMinOrderInput, productStatusInput].forEach(input => {
        input.addEventListener('input', updateProductPreview);
        input.addEventListener('change', updateProductPreview);
    });

    // Product image upload
    productImageUpload.addEventListener('click', () => productImageInput.click());
    productImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            productImagePreview.innerHTML = `<img src="${event.target.result}" alt="Product">`;
            previewProductImage.innerHTML = '';
            previewProductImage.style.backgroundImage = `url('${event.target.result}')`;
        };
        reader.readAsDataURL(file);
    });

    // Add/Update product
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = productNameInput.value.trim();
        const category = productCategoryInput.value;
        const type = productTypeInput.value.trim();
        const description = productDescriptionInput.value.trim();
        const price = parseFloat(productPriceInput.value) || 0;
        const quantity = parseInt(productQuantityInput.value) || 0;
        const packaging = productPackagingInput.value.trim();
        const minOrder = productMinOrderInput.value.trim();
        const status = productStatusInput.value;

        if (!name) {
            showToast('Error', 'Please enter a product name.', 'error');
            return;
        }
        if (!category) {
            showToast('Error', 'Please select a category.', 'error');
            return;
        }
        if (price <= 0) {
            showToast('Error', 'Please enter a valid price.', 'error');
            return;
        }

        if (isEditingProduct && editingProductId) {
            // Update existing product
            const index = products.findIndex(p => p.id === editingProductId);
            if (index !== -1) {
                const imgSrc = productImagePreview.querySelector('img')?.src || products[index].image || '';
                products[index] = {
                    ...products[index],
                    name,
                    category,
                    type,
                    description,
                    price,
                    quantity,
                    packaging,
                    minOrder,
                    status,
                    image: imgSrc
                };
                showToast('Success', `"${name}" has been updated successfully!`, 'success');
            }
            isEditingProduct = false;
            editingProductId = null;
        } else {
            // Add new product
            const imgSrc = productImagePreview.querySelector('img')?.src || '';
            const newProduct = {
                id: Date.now(),
                name,
                category,
                type,
                description,
                price,
                quantity,
                packaging,
                minOrder,
                status,
                image: imgSrc,
                rating: 0,
                dateAdded: new Date().toISOString().split('T')[0]
            };
            products.push(newProduct);
            showToast('Success', `"${name}" has been added successfully!`, 'success');
        }

        // Reset form
        addProductForm.reset();
        productImagePreview.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>`;
        previewProductImage.innerHTML = `<div class="farmer-preview-product-placeholder"><i class="fas fa-image"></i> No Image</div>`;
        previewProductImage.style.backgroundImage = '';
        document.querySelector('#section-add-product h2').textContent = 'Add New Product';
        document.querySelector('#saveProductBtn').textContent = 'Save Product';
        updateProductPreview();
        renderProducts();
        updateOverview();
        navigateTo('products');
    });

    // Cancel add product
    document.getElementById('cancelProductBtn').addEventListener('click', function() {
        if (isEditingProduct) {
            isEditingProduct = false;
            editingProductId = null;
            document.querySelector('#section-add-product h2').textContent = 'Add New Product';
            document.querySelector('#saveProductBtn').textContent = 'Save Product';
        }
        addProductForm.reset();
        productImagePreview.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>`;
        previewProductImage.innerHTML = `<div class="farmer-preview-product-placeholder"><i class="fas fa-image"></i> No Image</div>`;
        previewProductImage.style.backgroundImage = '';
        updateProductPreview();
        showToast('Info', 'Product creation cancelled.', 'info');
        navigateTo('products');
    });

    // =============================================================
    // ENQUIRIES
    // =============================================================
    function renderEnquiries() {
        const search = enquirySearch.value.toLowerCase();
        const status = enquiryStatusFilter.value;

        let filtered = enquiries.filter(e => {
            const matchSearch = e.buyer.toLowerCase().includes(search) || e.product.toLowerCase().includes(search);
            const matchStatus = !status || e.status === status;
            return matchSearch && matchStatus;
        });

        if (filtered.length === 0) {
            enquiriesList.innerHTML = `
                <div style="text-align:center;padding:3rem 0;color:var(--farmer-text-secondary);">
                    <i class="fas fa-envelope" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i>
                    <p>No enquiries found.</p>
                </div>
            `;
            return;
        }

        enquiriesList.innerHTML = filtered.map(e => `
            <div class="farmer-enquiry-item">
                <div class="farmer-enquiry-info">
                    <h4>${e.buyer}</h4>
                    <p>${e.contactMethod} · Interested in: ${e.product}</p>
                    <p style="font-size:0.75rem;color:var(--farmer-text-secondary);">${e.date}</p>
                </div>
                <span class="farmer-enquiry-status farmer-enquiry-status-${e.status.toLowerCase()}">${e.status}</span>
                <div class="farmer-enquiry-actions">
                    <button class="farmer-btn farmer-btn-sm farmer-btn-outline" data-action="view-enquiry" data-id="${e.id}">View</button>
                    ${e.status === 'New' ? `<button class="farmer-btn farmer-btn-sm farmer-btn-primary" data-action="mark-contacted" data-id="${e.id}">Mark Contacted</button>` : ''}
                    ${e.status !== 'Closed' ? `<button class="farmer-btn farmer-btn-sm farmer-btn-outline" data-action="mark-closed" data-id="${e.id}">Mark Closed</button>` : ''}
                </div>
            </div>
        `).join('');

        // Enquiry actions
        document.querySelectorAll('[data-action="view-enquiry"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const enquiry = enquiries.find(e => e.id === id);
                if (enquiry) {
                    openModal(
                        'Enquiry Details',
                        '',
                        `
                            <p><strong>Buyer:</strong> ${enquiry.buyer}</p>
                            <p><strong>Contact Method:</strong> ${enquiry.contactMethod}</p>
                            <p><strong>Product:</strong> ${enquiry.product}</p>
                            <p><strong>Date:</strong> ${enquiry.date}</p>
                            <p><strong>Status:</strong> ${enquiry.status}</p>
                        `,
                        'Close'
                    );
                    modalCancel.style.display = 'none';
                    modalConfirm.textContent = 'Close';
                    modal._confirmCallback = closeModal;
                    setTimeout(() => { modalCancel.style.display = ''; modalConfirm.textContent = 'Confirm'; }, 100);
                }
            });
        });

        document.querySelectorAll('[data-action="mark-contacted"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const enquiry = enquiries.find(e => e.id === id);
                if (enquiry) {
                    openModal(
                        'Mark as Contacted',
                        `Mark "${enquiry.buyer}" enquiry as contacted?`,
                        '',
                        'Yes, Mark Contacted',
                        'Cancel',
                        function() {
                            enquiry.status = 'Contacted';
                            renderEnquiries();
                            closeModal();
                            showToast('Updated', 'Enquiry marked as contacted.', 'success');
                        }
                    );
                }
            });
        });

        document.querySelectorAll('[data-action="mark-closed"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const enquiry = enquiries.find(e => e.id === id);
                if (enquiry) {
                    openModal(
                        'Mark as Closed',
                        `Mark "${enquiry.buyer}" enquiry as closed?`,
                        '',
                        'Yes, Mark Closed',
                        'Cancel',
                        function() {
                            enquiry.status = 'Closed';
                            renderEnquiries();
                            closeModal();
                            showToast('Updated', 'Enquiry marked as closed.', 'success');
                        }
                    );
                }
            });
        });

        totalEnquiries.textContent = enquiries.length;
    }

    enquirySearch.addEventListener('input', renderEnquiries);
    enquiryStatusFilter.addEventListener('change', renderEnquiries);

    // =============================================================
    // REVIEWS
    // =============================================================
    function renderReviews() {
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div style="text-align:center;padding:3rem 0;color:var(--farmer-text-secondary);">
                    <i class="fas fa-star" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i>
                    <p>No reviews yet.</p>
                </div>
            `;
            return;
        }

        // Calculate stats
        const total = reviews.length;
        const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / total);
        reviewAvg.textContent = avg.toFixed(1);
        reviewCount.textContent = total;

        reviewsList.innerHTML = reviews.map(r => `
            <div class="farmer-review-card">
                <div class="farmer-review-header">
                    <span class="farmer-review-name">${r.buyer}</span>
                    <span class="farmer-review-stars">${'⭐'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p class="farmer-review-text">"${r.text}"</p>
                <span class="farmer-review-date">${r.date}</span>
                ${r.response ? `
                    <div class="farmer-review-response">
                        <div class="farmer-review-response-label">Your Response</div>
                        <p class="farmer-review-response-text">${r.response}</p>
                    </div>
                ` : `
                    <div style="margin-top:0.5rem;">
                        <button class="farmer-btn farmer-btn-sm farmer-btn-primary" data-action="respond-review" data-id="${r.id}">Respond</button>
                    </div>
                `}
            </div>
        `).join('');

        document.querySelectorAll('[data-action="respond-review"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const review = reviews.find(r => r.id === id);
                if (review) {
                    openModal(
                        'Respond to Review',
                        `Write your response to ${review.buyer}:`,
                        `
                            <div class="farmer-form-group">
                                <label>Your Response</label>
                                <textarea id="reviewResponseInput" class="farmer-form-textarea" rows="4" placeholder="Thank you for your review..."></textarea>
                            </div>
                        `,
                        'Send Response',
                        'Cancel',
                        function() {
                            const response = document.getElementById('reviewResponseInput').value.trim();
                            if (!response) {
                                showToast('Error', 'Please write a response.', 'error');
                                return;
                            }
                            review.response = response;
                            renderReviews();
                            closeModal();
                            showToast('Success', 'Response sent successfully!', 'success');
                        }
                    );
                }
            });
        });
    }

    // =============================================================
    // NOTIFICATIONS
    // =============================================================
    function renderNotifications() {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationDot.style.display = unreadCount > 0 ? 'block' : 'none';

        if (notifications.length === 0) {
            notificationsList.innerHTML = `
                <div style="text-align:center;padding:3rem 0;color:var(--farmer-text-secondary);">
                    <i class="fas fa-bell-slash" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i>
                    <p>No notifications</p>
                </div>
            `;
            return;
        }

        notificationsList.innerHTML = notifications.map(n => `
            <div class="farmer-notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}" data-link="${n.link}">
                <div class="farmer-notification-content">
                    <div class="farmer-notification-title">${n.title}</div>
                    <div class="farmer-notification-message">${n.message}</div>
                    <span class="farmer-notification-time">${n.time}</span>
                </div>
                <div class="farmer-notification-actions">
                    <button class="farmer-btn farmer-btn-sm farmer-btn-outline" data-action="mark-read" data-id="${n.id}">${n.read ? 'Read' : 'Mark Read'}</button>
                    <button class="farmer-btn farmer-btn-sm farmer-btn-outline" data-action="delete-notification" data-id="${n.id}" style="color:#EF4444;border-color:#EF4444;">Delete</button>
                </div>
            </div>
        `).join('');

        // Click on notification to navigate
        document.querySelectorAll('.farmer-notification-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.closest('.farmer-notification-actions')) return;
                const link = this.dataset.link;
                const id = parseInt(this.dataset.id);
                const notif = notifications.find(n => n.id === id);
                if (notif && !notif.read) {
                    notif.read = true;
                    renderNotifications();
                }
                if (link) {
                    navigateTo(link);
                }
            });
        });

        document.querySelectorAll('[data-action="mark-read"]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                const notif = notifications.find(n => n.id === id);
                if (notif) {
                    notif.read = true;
                    renderNotifications();
                }
            });
        });

        document.querySelectorAll('[data-action="delete-notification"]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                openModal(
                    'Delete Notification',
                    'Are you sure you want to delete this notification?',
                    '',
                    'Delete',
                    'Cancel',
                    function() {
                        notifications = notifications.filter(n => n.id !== id);
                        renderNotifications();
                        closeModal();
                        showToast('Deleted', 'Notification deleted.', 'success');
                    }
                );
            });
        });
    }

    // Mark all read
    document.getElementById('markAllReadBtn').addEventListener('click', function() {
        notifications.forEach(n => n.read = true);
        renderNotifications();
        showToast('Updated', 'All notifications marked as read.', 'success');
    });

    // Notification icon click
    notificationIcon.addEventListener('click', function() {
        navigateTo('notifications');
    });

    // =============================================================
    // OVERVIEW
    // =============================================================
    function updateOverview() {
        totalProducts.textContent = products.length;
        totalEnquiries.textContent = enquiries.length;
        if (reviews.length > 0) {
            const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            avgRating.textContent = avg.toFixed(1);
        }
        totalReviews.textContent = reviews.length;
        updateCompletion();
    }

    // =============================================================
    // SETTINGS
    // =============================================================
    changePasswordBtn.addEventListener('click', function() {
        const newPass = document.getElementById('settingsNewPassword').value;
        const confirmPass = document.getElementById('settingsConfirmPassword').value;

        if (!newPass || !confirmPass) {
            showToast('Error', 'Please fill in both password fields.', 'error');
            return;
        }
        if (newPass !== confirmPass) {
            showToast('Error', 'Passwords do not match.', 'error');
            return;
        }
        if (newPass.length < 6) {
            showToast('Error', 'Password must be at least 6 characters.', 'error');
            return;
        }

        showToast('Success', 'Password updated successfully!', 'success');
        document.getElementById('settingsNewPassword').value = '';
        document.getElementById('settingsConfirmPassword').value = '';
    });

    // =============================================================
    // QUICK ACTION BUTTONS
    // =============================================================
    document.querySelectorAll('[data-action="add-product"]').forEach(btn => {
        btn.addEventListener('click', function() {
            isEditingProduct = false;
            editingProductId = null;
            document.querySelector('#section-add-product h2').textContent = 'Add New Product';
            document.querySelector('#saveProductBtn').textContent = 'Save Product';
            addProductForm.reset();
            productImagePreview.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>`;
            previewProductImage.innerHTML = `<div class="farmer-preview-product-placeholder"><i class="fas fa-image"></i> No Image</div>`;
            previewProductImage.style.backgroundImage = '';
            updateProductPreview();
            navigateTo('add-product');
        });
    });

    document.querySelectorAll('[data-action="view-products"]').forEach(btn => {
        btn.addEventListener('click', function() {
            navigateTo('products');
        });
    });

    document.querySelectorAll('[data-action="complete-profile"]').forEach(btn => {
        btn.addEventListener('click', function() {
            navigateTo('profile');
        });
    });

    // Add product from products page
    document.getElementById('addProductFromProducts').addEventListener('click', function() {
        isEditingProduct = false;
        editingProductId = null;
        document.querySelector('#section-add-product h2').textContent = 'Add New Product';
        document.querySelector('#saveProductBtn').textContent = 'Save Product';
        addProductForm.reset();
        productImagePreview.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>`;
        previewProductImage.innerHTML = `<div class="farmer-preview-product-placeholder"><i class="fas fa-image"></i> No Image</div>`;
        previewProductImage.style.backgroundImage = '';
        updateProductPreview();
        navigateTo('add-product');
    });

    // =============================================================
    // PROFILE DROPDOWN
    // =============================================================
    const profileDropdown = document.getElementById('farmerProfileDropdown');
    const profileTrigger = document.querySelector('.farmer-profile-trigger');

    profileTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    document.querySelectorAll('.farmer-profile-menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.dataset.action;
            profileDropdown.classList.remove('active');
            if (action === 'profile') navigateTo('profile');
            else if (action === 'settings') navigateTo('settings');
            else if (action === 'logout') {
                openModal('Logout', 'Are you sure you want to logout?', '', 'Logout', 'Cancel', function() {
                    closeModal();
                    showToast('Info', 'Logging out...', 'info');
                    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
                });
            }
        });
    });

    // =============================================================
    // LOGOUT
    // =============================================================
    document.querySelector('.farmer-sidebar-logout').addEventListener('click', function(e) {
        e.preventDefault();
        openModal('Logout', 'Are you sure you want to logout?', '', 'Logout', 'Cancel', function() {
            closeModal();
            showToast('Info', 'Logging out...', 'info');
            setTimeout(() => { window.location.href = 'login.html'; }, 1000);
        });
    });

    // =============================================================
    // GLOBAL SEARCH
    // =============================================================
    const globalSearch = document.getElementById('globalSearch');
    globalSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const term = this.value.toLowerCase();
            const sections = ['products', 'enquiries', 'reviews'];
            let found = false;
            for (const section of sections) {
                const el = document.getElementById(`section-${section}`);
                if (el) {
                    const text = el.textContent.toLowerCase();
                    if (text.includes(term)) {
                        navigateTo(section);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                showToast('Info', `No results found for "${this.value}"`, 'info');
            }
        }
    });

    // =============================================================
    // INITIALIZE
    // =============================================================
    initData();
    updateProfilePreview();
    renderProducts();
    renderEnquiries();
    renderReviews();
    renderNotifications();
    updateOverview();
    updateProductPreview();

    // Show welcome toast
    setTimeout(() => {
        showToast('Welcome back!', 'John, your farm is thriving. 🌱', 'success');
    }, 800);

    console.log('🌱 FarmConnect Farmer Dashboard loaded');
    console.log('📊 Dashboard ready for farmer management');

})();
    
})();


// =============================================================
// BUYER DASHBOARD - NAMESPACED
// =============================================================
(function() {
    'use strict';
    
    // Only run on buyer dashboard
    if (!document.getElementById('buyerSidebar')) {
        return;
    }
    
    // ... all buyer dashboard code here ...
    // =============================================================
// buyer-dashboard.js · FarmConnect Buyer Dashboard
// Production-quality, fully functional, no errors
// =============================================================

(function() {
    'use strict';

    // =============================================================
    // PAGE-SAFE INITIALIZATION
    // Only runs on buyer dashboard page
    // =============================================================
    if (!document.getElementById('buyerSidebar')) {
        console.log('⏭️ Not on buyer dashboard page, skipping initialization.');
        return;
    }

    console.log('🛒 Buyer Dashboard initializing...');

    // =============================================================
    // DOM REFS - SAFE ELEMENT RETRIEVAL
    // =============================================================
    function getEl(id) {
        var el = document.getElementById(id);
        if (!el) {
            console.warn('⚠️ Element not found:', id);
        }
        return el;
    }

    var sidebar = getEl('buyerSidebar');
    var overlay = getEl('buyerOverlay');
    var sidebarCollapse = getEl('sidebarCollapse');
    var navbarToggle = getEl('navbarToggle');
    var darkModeToggle = getEl('darkModeToggle');
    var modal = getEl('buyerModal');
    var modalClose = getEl('modalClose');
    var modalCancel = getEl('modalCancel');
    var modalConfirm = getEl('modalConfirm');
    var modalTitle = getEl('modalTitle');
    var modalMessage = getEl('modalMessage');
    var modalFields = getEl('modalFields');
    var toastContainer = getEl('toastContainer');

    // Profile
    var profileImageInput = getEl('profileImageInput');
    var profileImageUpload = getEl('profileImageUpload');
    var profileImagePreview = getEl('profileImagePreview');
    var fullNameInput = getEl('fullName');
    var locationInput = getEl('location');
    var bioInput = getEl('bio');
    var whatsappInput = getEl('whatsapp');
    var phoneInput = getEl('phone');
    var deliveryAddressInput = getEl('deliveryAddress');
    var previewName = getEl('previewName');
    var previewLocation = getEl('previewLocation');
    var previewBio = getEl('previewBio');
    var previewWhatsApp = getEl('previewWhatsApp');
    var previewPhone = getEl('previewPhone');
    var previewAddress = getEl('previewAddress');
    var previewAvatar = getEl('previewAvatar');
    var previewAvatarText = getEl('previewAvatarText');
    var profileForm = getEl('profileForm');

    // Saved Products
    var savedGrid = getEl('savedGrid');
    var savedSearch = getEl('savedSearch');
    var savedCategoryFilter = getEl('savedCategoryFilter');

    // Contacts
    var contactsList = getEl('contactsList');
    var contactSearch = getEl('contactSearch');
    var contactStatusFilter = getEl('contactStatusFilter');

    // Reviews
    var myReviewsList = getEl('myReviewsList');

    // Notifications
    var notificationsList = getEl('notificationsList');
    var notificationDot = getEl('notificationDot');
    var notificationIcon = getEl('notificationIcon');

    // Settings
    var settingsDarkMode = getEl('settingsDarkMode');
    var changePasswordBtn = getEl('changePasswordBtn');

    // Stats
    var welcomeName = getEl('welcomeName');
    var savedCount = getEl('savedCount');
    var farmersCount = getEl('farmersCount');
    var logisticsCount = getEl('logisticsCount');
    var reviewsCount = getEl('reviewsCount');
    var markAllReadBtn = getEl('markAllReadBtn');

    // If critical elements are missing, exit
    if (!sidebar) {
        console.error('❌ Critical: Sidebar not found, aborting.');
        return;
    }

    // =============================================================
    // STATE
    // =============================================================
    var currentSection = 'overview';
    var isSidebarCollapsed = false;
    var isDarkMode = false;
    var savedProducts = [];
    var contacts = [];
    var reviews = [];
    var notifications = [];

    // =============================================================
    // INITIAL DATA
    // =============================================================
    function initData() {
        // Load from localStorage or use defaults
        var savedData = localStorage.getItem('buyerSavedProducts');
        if (savedData) {
            try {
                savedProducts = JSON.parse(savedData);
            } catch(e) {
                savedProducts = getDefaultSavedProducts();
            }
        } else {
            savedProducts = getDefaultSavedProducts();
        }

        var contactsData = localStorage.getItem('buyerContacts');
        if (contactsData) {
            try {
                contacts = JSON.parse(contactsData);
            } catch(e) {
                contacts = getDefaultContacts();
            }
        } else {
            contacts = getDefaultContacts();
        }

        var reviewsData = localStorage.getItem('buyerReviews');
        if (reviewsData) {
            try {
                reviews = JSON.parse(reviewsData);
            } catch(e) {
                reviews = getDefaultReviews();
            }
        } else {
            reviews = getDefaultReviews();
        }

        var notifsData = localStorage.getItem('buyerNotifications');
        if (notifsData) {
            try {
                notifications = JSON.parse(notifsData);
            } catch(e) {
                notifications = getDefaultNotifications();
            }
        } else {
            notifications = getDefaultNotifications();
        }
    }

    function getDefaultSavedProducts() {
        return [
            {
                id: 1,
                name: '50kg Bag of Rice',
                category: 'Grains',
                farmer: 'Ade Farms',
                location: 'Ibadan, Oyo',
                price: 45000,
                status: 'In Stock',
                rating: 4.8,
                dateAdded: '2026-01-15',
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop'
            },
            {
                id: 2,
                name: 'Organic Maize (100kg)',
                category: 'Grains',
                farmer: 'Zaria Grains',
                location: 'Kaduna',
                price: 28000,
                status: 'Limited',
                rating: 4.2,
                dateAdded: '2026-02-20',
                image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=250&fit=crop'
            },
            {
                id: 3,
                name: 'Fresh Tomatoes (crate)',
                category: 'Vegetables',
                farmer: 'GreenHarvest',
                location: 'Lagos',
                price: 12000,
                status: 'In Stock',
                rating: 5.0,
                dateAdded: '2026-03-01',
                image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=400&h=250&fit=crop'
            },
            {
                id: 4,
                name: 'Cassava Chips (ton)',
                category: 'Crops',
                farmer: 'Benue Roots',
                location: 'Benin City',
                price: 62000,
                status: 'In Stock',
                rating: 4.7,
                dateAdded: '2026-03-10',
                image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&h=250&fit=crop'
            }
        ];
    }

    function getDefaultContacts() {
        return [
            {
                id: 1,
                name: 'Ade Farms',
                type: 'Farmer',
                product: '50kg Bag of Rice',
                method: 'WhatsApp',
                date: '2026-03-20',
                status: 'Ongoing'
            },
            {
                id: 2,
                name: 'FarmExpress Logistics',
                type: 'Logistics',
                product: 'Delivery Service',
                method: 'Phone',
                date: '2026-03-18',
                status: 'Contacted'
            },
            {
                id: 3,
                name: 'Zaria Grains',
                type: 'Farmer',
                product: 'Organic Maize',
                method: 'WhatsApp',
                date: '2026-03-15',
                status: 'Closed'
            }
        ];
    }

    function getDefaultReviews() {
        return [
            {
                id: 1,
                recipient: 'Ade Farms',
                type: 'Farmer',
                rating: 5,
                text: 'Excellent quality rice! The grains are long and fluffy. Will definitely order again.',
                date: 'March 15, 2026'
            },
            {
                id: 2,
                recipient: 'FarmExpress Logistics',
                type: 'Logistics',
                rating: 5,
                text: 'Very reliable logistics provider. My produce arrived fresh and on time.',
                date: 'March 10, 2026'
            },
            {
                id: 3,
                recipient: 'Zaria Grains',
                type: 'Farmer',
                rating: 4,
                text: 'Good quality maize, but delivery was a bit delayed.',
                date: 'February 28, 2026'
            }
        ];
    }

    function getDefaultNotifications() {
        return [
            {
                id: 1,
                title: 'Farmer Replied to Your Review',
                message: 'Ade Farms responded to your review on their 50kg Bag of Rice.',
                time: '2 hours ago',
                read: false,
                link: 'reviews'
            },
            {
                id: 2,
                title: 'New Product from Saved Farmer',
                message: 'Ade Farms listed a new product: Organic Cassava.',
                time: '5 hours ago',
                read: false,
                link: 'saved'
            },
            {
                id: 3,
                title: 'Product Updated',
                message: 'The product 50kg Bag of Rice has been updated.',
                time: '1 day ago',
                read: true,
                link: 'saved'
            },
            {
                id: 4,
                title: 'Account Updated',
                message: 'Your profile has been successfully updated.',
                time: '2 days ago',
                read: true,
                link: 'profile'
            }
        ];
    }

    // =============================================================
    // SAVE TO LOCALSTORAGE
    // =============================================================
    function saveData() {
        try {
            localStorage.setItem('buyerSavedProducts', JSON.stringify(savedProducts));
            localStorage.setItem('buyerContacts', JSON.stringify(contacts));
            localStorage.setItem('buyerReviews', JSON.stringify(reviews));
            localStorage.setItem('buyerNotifications', JSON.stringify(notifications));
        } catch(e) {}
    }

    // =============================================================
    // TOAST SYSTEM
    // =============================================================
    function showToast(title, message, type) {
        type = type || 'success';
        if (!toastContainer) return;

        var toast = document.createElement('div');
        toast.className = 'buyer-toast buyer-toast-' + type;
        var icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        toast.innerHTML = '<div class="buyer-toast-icon"><i class="fas ' + (icons[type] || icons.success) + '"></i></div><div class="buyer-toast-content"><div class="buyer-toast-title">' + title + '</div><div class="buyer-toast-message">' + message + '</div></div><button class="buyer-toast-close">&times;</button>';
        var closeBtn = toast.querySelector('.buyer-toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() { toast.remove(); });
        }
        toastContainer.appendChild(toast);
        setTimeout(function() {
            if (toast.parentNode) toast.remove();
        }, 5000);
    }

    // =============================================================
    // MODAL SYSTEM
    // =============================================================
    function openModal(title, message, fields, confirmText, cancelText, confirmCallback) {
        fields = fields || '';
        confirmText = confirmText || 'Confirm';
        cancelText = cancelText || 'Cancel';
        if (!modal) return;

        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        if (modalFields) modalFields.innerHTML = fields;
        if (modalConfirm) modalConfirm.textContent = confirmText;
        if (modalCancel) modalCancel.textContent = cancelText;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal._confirmCallback = confirmCallback || null;
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalFields) modalFields.innerHTML = '';
        modal._confirmCallback = null;
    }

    // =============================================================
    // NAVIGATION
    // =============================================================
    function navigateTo(section) {
        var links = document.querySelectorAll('.buyer-sidebar-link[data-section]');
        for (var i = 0; i < links.length; i++) {
            var l = links[i];
            if (l.dataset.section === section) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        }

        var sections = document.querySelectorAll('.buyer-section');
        for (var j = 0; j < sections.length; j++) {
            var s = sections[j];
            if (s.id === 'section-' + section) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        }

        var titles = {
            overview: 'Overview',
            profile: 'My Profile',
            saved: 'Saved Products',
            contacts: 'Contact History',
            reviews: 'My Reviews',
            notifications: 'Notifications',
            settings: 'Settings'
        };
        var titleEl = document.getElementById('pageTitle');
        if (titleEl) titleEl.textContent = titles[section] || 'Dashboard';

        currentSection = section;

        if (section === 'overview') updateOverview();
        if (section === 'saved') renderSaved();
        if (section === 'contacts') renderContacts();
        if (section === 'reviews') renderReviews();
        if (section === 'notifications') renderNotifications();
    }

    // =============================================================
    // PROFILE PREVIEW
    // =============================================================
    function updateProfilePreview() {
        var name = fullNameInput ? fullNameInput.value || 'Your Name' : 'Your Name';
        var location = locationInput ? locationInput.value || 'Your Location' : 'Your Location';
        var bio = bioInput ? bioInput.value || 'No bio provided.' : 'No bio provided.';
        var whatsapp = whatsappInput ? whatsappInput.value || 'Not provided' : 'Not provided';
        var phone = phoneInput ? phoneInput.value || 'Not provided' : 'Not provided';
        var address = deliveryAddressInput ? deliveryAddressInput.value || 'Not provided' : 'Not provided';

        if (previewName) previewName.textContent = name;
        if (previewLocation) previewLocation.innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + location;
        if (previewBio) previewBio.textContent = bio;
        if (previewWhatsApp) previewWhatsApp.textContent = whatsapp;
        if (previewPhone) previewPhone.textContent = phone;
        if (previewAddress) previewAddress.textContent = address;

        var initials = name.split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
        if (previewAvatarText) previewAvatarText.textContent = initials;

        if (welcomeName) welcomeName.textContent = name.split(' ')[0] || 'Buyer';
    }

    // =============================================================
    // PROFILE IMAGE
    // =============================================================
    if (profileImageUpload && profileImageInput) {
        profileImageUpload.addEventListener('click', function() {
            profileImageInput.click();
        });
        profileImageInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(event) {
                if (profileImagePreview) {
                    profileImagePreview.innerHTML = '<img src="' + event.target.result + '" alt="Profile">';
                }
                if (previewAvatar) {
                    previewAvatar.innerHTML = '<img src="' + event.target.result + '" alt="Profile">';
                    previewAvatar.style.background = 'transparent';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Profile form
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Success', 'Profile updated successfully!', 'success');
            updateProfilePreview();
        });
    }

    // Profile inputs live preview
    var profileInputs = [fullNameInput, locationInput, bioInput, whatsappInput, phoneInput, deliveryAddressInput];
    for (var j = 0; j < profileInputs.length; j++) {
        (function(input) {
            if (input) {
                input.addEventListener('input', updateProfilePreview);
            }
        })(profileInputs[j]);
    }

    // =============================================================
    // SAVED PRODUCTS
    // =============================================================
    function renderSaved() {
        if (!savedGrid) return;

        var search = savedSearch ? savedSearch.value.toLowerCase() : '';
        var category = savedCategoryFilter ? savedCategoryFilter.value : '';

        var filtered = [];
        for (var i = 0; i < savedProducts.length; i++) {
            var p = savedProducts[i];
            var matchSearch = p.name.toLowerCase().indexOf(search) !== -1 || p.farmer.toLowerCase().indexOf(search) !== -1;
            var matchCategory = !category || p.category === category;
            if (matchSearch && matchCategory) {
                filtered.push(p);
            }
        }

        if (filtered.length === 0) {
            savedGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--buyer-text-secondary);"><i class="fas fa-heart" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No saved products. <a href="marketplace.html" style="color:#2D7D3A;">Browse products to save</a></p></div>';
            return;
        }

        var html = '';
        for (var j = 0; j < filtered.length; j++) {
            var p = filtered[j];
            var statusClass = 'buyer-status-' + (p.status === 'In Stock' ? 'available' : p.status === 'Limited' ? 'low' : 'sold');
            var imageUrl = p.image || 'https://via.placeholder.com/400x250/E5E7EB/6B7280?text=No+Image';
            html += '<div class="buyer-saved-item"><div class="buyer-saved-image" style="background-image: url(\'' + imageUrl + '\');"></div><div class="buyer-saved-body"><div class="buyer-saved-name">' + p.name + '</div><div class="buyer-saved-meta"><span>' + p.category + '</span><span>' + p.farmer + '</span></div><div class="buyer-saved-meta"><span><i class="fas fa-map-marker-alt"></i> ' + p.location + '</span><span>⭐ ' + p.rating + '</span></div><div class="buyer-saved-meta"><span class="buyer-saved-price">₦' + p.price.toLocaleString() + '</span><span class="buyer-saved-status ' + statusClass + '">' + p.status + '</span></div><div class="buyer-saved-meta" style="font-size:0.7rem;color:var(--buyer-text-secondary);"><span>Saved: ' + p.dateAdded + '</span></div><div class="buyer-saved-actions"><button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="view-saved" data-id="' + p.id + '">View</button><button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="contact-saved" data-id="' + p.id + '">Contact</button><button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="remove-saved" data-id="' + p.id + '" style="color:#EF4444;border-color:#EF4444;">Remove</button></div></div></div>';
        }
        savedGrid.innerHTML = html;

        // Event delegation for saved product actions
        savedGrid.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            if (action === 'view-saved') {
                var product = null;
                for (var m = 0; m < savedProducts.length; m++) {
                    if (savedProducts[m].id === id) { product = savedProducts[m]; break; }
                }
                if (product) {
                    var imageUrl = product.image || 'https://via.placeholder.com/100x100/E5E7EB/6B7280?text=No+Image';
                    var fields = '<div style="display:flex;gap:1rem;margin-bottom:1rem;"><div style="width:100px;height:100px;border-radius:12px;background:url(\'' + imageUrl + '\') center/cover;flex-shrink:0;"></div><div><p><strong>Farmer:</strong> ' + product.farmer + '</p><p><strong>Category:</strong> ' + product.category + '</p><p><strong>Price:</strong> ₦' + product.price.toLocaleString() + '</p><p><strong>Status:</strong> ' + product.status + '</p></div></div><p><strong>Location:</strong> ' + product.location + '</p><p><strong>Rating:</strong> ⭐ ' + product.rating + '</p><p><strong>Saved:</strong> ' + product.dateAdded + '</p>';
                    openModal(product.name, '', fields, 'Close', '');
                    if (modalCancel) modalCancel.style.display = 'none';
                    if (modalConfirm) modalConfirm.textContent = 'Close';
                    modal._confirmCallback = closeModal;
                    setTimeout(function() {
                        if (modalCancel) modalCancel.style.display = '';
                        if (modalConfirm) modalConfirm.textContent = 'Confirm';
                    }, 100);
                }
            } else if (action === 'contact-saved') {
                var product = null;
                for (var m = 0; m < savedProducts.length; m++) {
                    if (savedProducts[m].id === id) { product = savedProducts[m]; break; }
                }
                if (product) {
                    var fields = '<div class="buyer-form-group"><label>Message</label><textarea id="contactMessageInput" class="buyer-form-textarea" rows="4" placeholder="Hi, I\'m interested in your ' + product.name + '..."></textarea></div><div class="buyer-form-group"><label>Contact Method</label><select id="contactMethodInput" class="buyer-form-input"><option value="WhatsApp">WhatsApp</option><option value="Phone">Phone</option></select></div>';
                    openModal('Contact Farmer', 'Send a message to ' + product.farmer + ' about ' + product.name + ':', fields, 'Send', 'Cancel', function() {
                        var messageInput = document.getElementById('contactMessageInput');
                        var methodInput = document.getElementById('contactMethodInput');
                        var message = messageInput ? messageInput.value.trim() : '';
                        var method = methodInput ? methodInput.value : 'WhatsApp';
                        if (!message) {
                            showToast('Error', 'Please write a message.', 'error');
                            return;
                        }
                        var newContact = {
                            id: Date.now(),
                            name: product.farmer,
                            type: 'Farmer',
                            product: product.name,
                            method: method,
                            date: new Date().toISOString().split('T')[0],
                            status: 'Ongoing'
                        };
                        contacts.push(newContact);
                        saveData();
                        showToast('Success', 'Message sent to ' + product.farmer + '!', 'success');
                        closeModal();
                        renderContacts();
                        updateOverview();
                    });
                }
            } else if (action === 'remove-saved') {
                var product = null;
                for (var m = 0; m < savedProducts.length; m++) {
                    if (savedProducts[m].id === id) { product = savedProducts[m]; break; }
                }
                if (product) {
                    openModal('Remove Saved Product', 'Are you sure you want to remove "' + product.name + '" from your saved products?', '', 'Remove', 'Cancel', function() {
                        var newSaved = [];
                        for (var m = 0; m < savedProducts.length; m++) {
                            if (savedProducts[m].id !== id) newSaved.push(savedProducts[m]);
                        }
                        savedProducts = newSaved;
                        saveData();
                        renderSaved();
                        updateOverview();
                        closeModal();
                        showToast('Removed', '"' + product.name + '" removed from saved.', 'success');
                    });
                }
            }
        });

        if (savedCount) savedCount.textContent = savedProducts.length;
    }

    // =============================================================
    // CONTACTS
    // =============================================================
    function renderContacts() {
        if (!contactsList) return;

        var search = contactSearch ? contactSearch.value.toLowerCase() : '';
        var status = contactStatusFilter ? contactStatusFilter.value : '';

        var filtered = [];
        for (var i = 0; i < contacts.length; i++) {
            var c = contacts[i];
            var matchSearch = c.name.toLowerCase().indexOf(search) !== -1 || c.product.toLowerCase().indexOf(search) !== -1;
            var matchStatus = !status || c.status === status;
            if (matchSearch && matchStatus) {
                filtered.push(c);
            }
        }

        if (filtered.length === 0) {
            contactsList.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--buyer-text-secondary);"><i class="fas fa-phone" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No contact history found.</p></div>';
            return;
        }

        var html = '';
        for (var j = 0; j < filtered.length; j++) {
            var c = filtered[j];
            var statusClass = 'buyer-contact-status-' + c.status.toLowerCase();
            html += '<div class="buyer-contact-item"><div class="buyer-contact-info"><h4>' + c.name + '</h4><p>' + c.type + ' · ' + c.product + ' · ' + c.method + '</p><p style="font-size:0.75rem;color:var(--buyer-text-secondary);">' + c.date + '</p></div><span class="buyer-contact-status ' + statusClass + '">' + c.status + '</span><div class="buyer-contact-actions"><button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="view-contact" data-id="' + c.id + '">View</button>' + (c.status !== 'Closed' ? '<button class="buyer-btn buyer-btn-sm buyer-btn-primary" data-action="continue-contact" data-id="' + c.id + '">Continue</button>' : '') + '<button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="delete-contact" data-id="' + c.id + '" style="color:#EF4444;border-color:#EF4444;">Delete</button></div></div>';
        }
        contactsList.innerHTML = html;

        contactsList.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            if (action === 'view-contact') {
                var contact = null;
                for (var m = 0; m < contacts.length; m++) {
                    if (contacts[m].id === id) { contact = contacts[m]; break; }
                }
                if (contact) {
                    var fields = '<p><strong>Name:</strong> ' + contact.name + '</p><p><strong>Type:</strong> ' + contact.type + '</p><p><strong>Product/Service:</strong> ' + contact.product + '</p><p><strong>Contact Method:</strong> ' + contact.method + '</p><p><strong>Date:</strong> ' + contact.date + '</p><p><strong>Status:</strong> ' + contact.status + '</p>';
                    openModal('Contact Details', '', fields, 'Close', '');
                    if (modalCancel) modalCancel.style.display = 'none';
                    if (modalConfirm) modalConfirm.textContent = 'Close';
                    modal._confirmCallback = closeModal;
                    setTimeout(function() {
                        if (modalCancel) modalCancel.style.display = '';
                        if (modalConfirm) modalConfirm.textContent = 'Confirm';
                    }, 100);
                }
            } else if (action === 'continue-contact') {
                var contact = null;
                for (var m = 0; m < contacts.length; m++) {
                    if (contacts[m].id === id) { contact = contacts[m]; break; }
                }
                if (contact) {
                    var fields = '<div class="buyer-form-group"><label>Your Message</label><textarea id="continueMessageInput" class="buyer-form-textarea" rows="4" placeholder="Hi, I\'d like to follow up on..."></textarea></div>';
                    openModal('Continue Conversation', 'Continue your conversation with ' + contact.name + ':', fields, 'Send', 'Cancel', function() {
                        var msgInput = document.getElementById('continueMessageInput');
                        var message = msgInput ? msgInput.value.trim() : '';
                        if (!message) {
                            showToast('Error', 'Please write a message.', 'error');
                            return;
                        }
                        contact.status = 'Ongoing';
                        saveData();
                        showToast('Success', 'Message sent to ' + contact.name + '!', 'success');
                        closeModal();
                        renderContacts();
                    });
                }
            } else if (action === 'delete-contact') {
                var contact = null;
                for (var m = 0; m < contacts.length; m++) {
                    if (contacts[m].id === id) { contact = contacts[m]; break; }
                }
                if (contact) {
                    openModal('Delete Contact History', 'Are you sure you want to delete contact with ' + contact.name + '?', '', 'Delete', 'Cancel', function() {
                        var newContacts = [];
                        for (var m = 0; m < contacts.length; m++) {
                            if (contacts[m].id !== id) newContacts.push(contacts[m]);
                        }
                        contacts = newContacts;
                        saveData();
                        renderContacts();
                        updateOverview();
                        closeModal();
                        showToast('Deleted', 'Contact history removed.', 'success');
                    });
                }
            }
        });

        var farmerContacts = 0;
        var logisticsContacts = 0;
        for (var m = 0; m < contacts.length; m++) {
            if (contacts[m].type === 'Farmer') farmerContacts++;
            else if (contacts[m].type === 'Logistics') logisticsContacts++;
        }
        if (farmersCount) farmersCount.textContent = farmerContacts;
        if (logisticsCount) logisticsCount.textContent = logisticsContacts;
    }

    // =============================================================
    // REVIEWS
    // =============================================================
    function renderReviews() {
        if (!myReviewsList) return;

        if (reviews.length === 0) {
            myReviewsList.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--buyer-text-secondary);"><i class="fas fa-star" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No reviews submitted yet.</p></div>';
            return;
        }

        var html = '';
        for (var i = 0; i < reviews.length; i++) {
            var r = reviews[i];
            var stars = '';
            for (var s = 0; s < r.rating; s++) stars += '⭐';
            for (var s = r.rating; s < 5; s++) stars += '☆';
            html += '<div class="buyer-review-item"><div class="buyer-review-header"><div><span class="buyer-review-recipient">' + r.recipient + '</span><span class="buyer-review-type">' + r.type + '</span></div><span class="buyer-review-stars">' + stars + '</span></div><p class="buyer-review-text">"' + r.text + '"</p><span class="buyer-review-date">' + r.date + '</span><div class="buyer-review-actions"><button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="edit-review" data-id="' + r.id + '">Edit</button><button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="delete-review" data-id="' + r.id + '" style="color:#EF4444;border-color:#EF4444;">Delete</button></div></div>';
        }
        myReviewsList.innerHTML = html;

        myReviewsList.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            if (action === 'edit-review') {
                var review = null;
                for (var m = 0; m < reviews.length; m++) {
                    if (reviews[m].id === id) { review = reviews[m]; break; }
                }
                if (review) {
                    var starsOptions = '';
                    for (var s = 1; s <= 5; s++) {
                        starsOptions += '<option value="' + s + '" ' + (s === review.rating ? 'selected' : '') + '>' + '⭐'.repeat(s) + '</option>';
                    }
                    var fields = '<div class="buyer-form-group"><label>Recipient</label><input type="text" id="editRecipient" class="buyer-form-input" value="' + review.recipient + '"></div><div class="buyer-form-group"><label>Type</label><select id="editType" class="buyer-form-input"><option value="Farmer" ' + (review.type === 'Farmer' ? 'selected' : '') + '>Farmer</option><option value="Logistics" ' + (review.type === 'Logistics' ? 'selected' : '') + '>Logistics</option></select></div><div class="buyer-form-group"><label>Rating</label><select id="editRating" class="buyer-form-input">' + starsOptions + '</select></div><div class="buyer-form-group"><label>Review Text</label><textarea id="editReviewText" class="buyer-form-textarea" rows="4">' + review.text + '</textarea></div>';
                    openModal('Edit Review', '', fields, 'Update', 'Cancel', function() {
                        var recipientInput = document.getElementById('editRecipient');
                        var typeInput = document.getElementById('editType');
                        var ratingInput = document.getElementById('editRating');
                        var textInput = document.getElementById('editReviewText');
                        var recipient = recipientInput ? recipientInput.value.trim() : '';
                        var type = typeInput ? typeInput.value : 'Farmer';
                        var rating = parseInt(ratingInput ? ratingInput.value : 5);
                        var text = textInput ? textInput.value.trim() : '';
                        if (!recipient || !text) {
                            showToast('Error', 'Please fill in all fields.', 'error');
                            return;
                        }
                        review.recipient = recipient;
                        review.type = type;
                        review.rating = rating;
                        review.text = text;
                        saveData();
                        renderReviews();
                        closeModal();
                        showToast('Updated', 'Review updated successfully!', 'success');
                    });
                }
            } else if (action === 'delete-review') {
                var review = null;
                for (var m = 0; m < reviews.length; m++) {
                    if (reviews[m].id === id) { review = reviews[m]; break; }
                }
                if (review) {
                    openModal('Delete Review', 'Are you sure you want to delete your review for ' + review.recipient + '?', '', 'Delete', 'Cancel', function() {
                        var newReviews = [];
                        for (var m = 0; m < reviews.length; m++) {
                            if (reviews[m].id !== id) newReviews.push(reviews[m]);
                        }
                        reviews = newReviews;
                        saveData();
                        renderReviews();
                        updateOverview();
                        closeModal();
                        showToast('Deleted', 'Review deleted successfully.', 'success');
                    });
                }
            }
        });

        if (reviewsCount) reviewsCount.textContent = reviews.length;
    }

    // =============================================================
    // NOTIFICATIONS
    // =============================================================
    function renderNotifications() {
        if (!notificationsList) return;

        var unreadCount = 0;
        for (var i = 0; i < notifications.length; i++) {
            if (!notifications[i].read) unreadCount++;
        }
        if (notificationDot) {
            notificationDot.style.display = unreadCount > 0 ? 'block' : 'none';
        }

        if (notifications.length === 0) {
            notificationsList.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--buyer-text-secondary);"><i class="fas fa-bell-slash" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No notifications</p></div>';
            return;
        }

        var html = '';
        for (var j = 0; j < notifications.length; j++) {
            var n = notifications[j];
            html += '<div class="buyer-notification-item ' + (n.read ? '' : 'unread') + '" data-id="' + n.id + '" data-link="' + n.link + '"><div class="buyer-notification-content"><div class="buyer-notification-title">' + n.title + '</div><div class="buyer-notification-message">' + n.message + '</div><span class="buyer-notification-time">' + n.time + '</span></div><div class="buyer-notification-actions"><button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="mark-read" data-id="' + n.id + '">' + (n.read ? 'Read' : 'Mark Read') + '</button><button class="buyer-btn buyer-btn-sm buyer-btn-outline" data-action="delete-notification" data-id="' + n.id + '" style="color:#EF4444;border-color:#EF4444;">Delete</button></div></div>';
        }
        notificationsList.innerHTML = html;

        notificationsList.addEventListener('click', function(e) {
            var target = e.target;
            var item = target.closest('.buyer-notification-item');
            if (!item) return;

            var btn = target.closest('button');
            if (btn) {
                var action = btn.dataset.action;
                var id = parseInt(btn.dataset.id);
                if (action === 'mark-read') {
                    var notif = null;
                    for (var m = 0; m < notifications.length; m++) {
                        if (notifications[m].id === id) { notif = notifications[m]; break; }
                    }
                    if (notif) {
                        notif.read = true;
                        saveData();
                        renderNotifications();
                    }
                    return;
                } else if (action === 'delete-notification') {
                    var notif = null;
                    for (var m = 0; m < notifications.length; m++) {
                        if (notifications[m].id === id) { notif = notifications[m]; break; }
                    }
                    if (notif) {
                        openModal('Delete Notification', 'Are you sure you want to delete this notification?', '', 'Delete', 'Cancel', function() {
                            var newNotifs = [];
                            for (var m = 0; m < notifications.length; m++) {
                                if (notifications[m].id !== id) newNotifs.push(notifications[m]);
                            }
                            notifications = newNotifs;
                            saveData();
                            renderNotifications();
                            closeModal();
                            showToast('Deleted', 'Notification deleted.', 'success');
                        });
                    }
                    return;
                }
            }

            // Click on notification body to navigate
            var link = item.dataset.link;
            var id = parseInt(item.dataset.id);
            var notif = null;
            for (var m = 0; m < notifications.length; m++) {
                if (notifications[m].id === id) { notif = notifications[m]; break; }
            }
            if (notif && !notif.read) {
                notif.read = true;
                saveData();
                renderNotifications();
            }
            if (link) {
                navigateTo(link);
            }
        });
    }

    // =============================================================
    // OVERVIEW
    // =============================================================
    function updateOverview() {
        if (savedCount) savedCount.textContent = savedProducts.length;

        var farmerContacts = 0;
        var logisticsContacts = 0;
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].type === 'Farmer') farmerContacts++;
            else if (contacts[i].type === 'Logistics') logisticsContacts++;
        }
        if (farmersCount) farmersCount.textContent = farmerContacts;
        if (logisticsCount) logisticsCount.textContent = logisticsContacts;
        if (reviewsCount) reviewsCount.textContent = reviews.length;
    }

    // =============================================================
    // SETTINGS
    // =============================================================
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            var newPass = document.getElementById('settingsNewPassword') ? document.getElementById('settingsNewPassword').value : '';
            var confirmPass = document.getElementById('settingsConfirmPassword') ? document.getElementById('settingsConfirmPassword').value : '';

            if (!newPass || !confirmPass) {
                showToast('Error', 'Please fill in both password fields.', 'error');
                return;
            }
            if (newPass !== confirmPass) {
                showToast('Error', 'Passwords do not match.', 'error');
                return;
            }
            if (newPass.length < 6) {
                showToast('Error', 'Password must be at least 6 characters.', 'error');
                return;
            }

            showToast('Success', 'Password updated successfully!', 'success');
            if (document.getElementById('settingsNewPassword')) document.getElementById('settingsNewPassword').value = '';
            if (document.getElementById('settingsConfirmPassword')) document.getElementById('settingsConfirmPassword').value = '';
        });
    }

    // =============================================================
    // SETUP EVENT LISTENERS
    // =============================================================
    function setupEventListeners() {
        // Sidebar collapse
        if (sidebarCollapse) {
            sidebarCollapse.addEventListener('click', function() {
                isSidebarCollapsed = !isSidebarCollapsed;
                if (sidebar) sidebar.classList.toggle('collapsed', isSidebarCollapsed);
                try {
                    localStorage.setItem('buyerSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
                } catch(e) {}
            });
        }

        try {
            var savedCollapse = localStorage.getItem('buyerSidebarCollapsed');
            if (savedCollapse === 'true') {
                isSidebarCollapsed = true;
                if (sidebar) sidebar.classList.add('collapsed');
            }
        } catch(e) {}

        // Mobile menu with overlay
        if (navbarToggle && sidebar) {
            navbarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
                if (overlay) overlay.classList.toggle('active');
                var icon = this.querySelector('i');
                if (icon) {
                    if (sidebar.classList.contains('mobile-open')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', function() {
                if (sidebar) sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                var icon = navbarToggle ? navbarToggle.querySelector('i') : null;
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }

        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                if (sidebar && navbarToggle && !sidebar.contains(e.target) && !navbarToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                    if (overlay) overlay.classList.remove('active');
                    var icon = navbarToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });

        // Sidebar links
        var sidebarLinks = document.querySelectorAll('.buyer-sidebar-link[data-section]');
        for (var i = 0; i < sidebarLinks.length; i++) {
            (function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    var section = this.dataset.section;
                    navigateTo(section);
                    if (window.innerWidth <= 992) {
                        if (sidebar) sidebar.classList.remove('mobile-open');
                        if (overlay) overlay.classList.remove('active');
                        var icon = navbarToggle ? navbarToggle.querySelector('i') : null;
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                });
            })(sidebarLinks[i]);
        }

        // Dark mode
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                isDarkMode = !isDarkMode;
                document.body.classList.toggle('buyer-dark-mode', isDarkMode);
                var icon = this.querySelector('i');
                if (icon) {
                    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
                }
                try {
                    localStorage.setItem('buyerDarkMode', JSON.stringify(isDarkMode));
                } catch(e) {}
                if (settingsDarkMode) settingsDarkMode.checked = isDarkMode;
            });
        }

        try {
            var savedDarkMode = localStorage.getItem('buyerDarkMode');
            if (savedDarkMode === 'true') {
                isDarkMode = true;
                document.body.classList.add('buyer-dark-mode');
                if (darkModeToggle) {
                    var icon = darkModeToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-sun';
                }
                if (settingsDarkMode) settingsDarkMode.checked = true;
            }
        } catch(e) {}

        if (settingsDarkMode) {
            settingsDarkMode.addEventListener('change', function() {
                if (darkModeToggle) darkModeToggle.click();
            });
        }

        // Modal close
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        if (modalCancel) {
            modalCancel.addEventListener('click', closeModal);
        }
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeModal();
            });
        }
        if (modalConfirm) {
            modalConfirm.addEventListener('click', function() {
                if (modal._confirmCallback) {
                    modal._confirmCallback();
                } else {
                    closeModal();
                }
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Search and filter
        if (savedSearch) {
            savedSearch.addEventListener('input', renderSaved);
        }
        if (savedCategoryFilter) {
            savedCategoryFilter.addEventListener('change', renderSaved);
        }
        if (contactSearch) {
            contactSearch.addEventListener('input', renderContacts);
        }
        if (contactStatusFilter) {
            contactStatusFilter.addEventListener('change', renderContacts);
        }

        // Mark all read
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                for (var k = 0; k < notifications.length; k++) {
                    notifications[k].read = true;
                }
                saveData();
                renderNotifications();
                showToast('Updated', 'All notifications marked as read.', 'success');
            });
        }

        // Notification icon click
        if (notificationIcon) {
            notificationIcon.addEventListener('click', function() {
                navigateTo('notifications');
            });
        }

        // Quick actions
        var actionBtns = document.querySelectorAll('[data-action="browse"], [data-action="saved"], [data-action="profile"]');
        for (var m = 0; m < actionBtns.length; m++) {
            (function(btn) {
                btn.addEventListener('click', function() {
                    var action = this.dataset.action;
                    if (action === 'browse') {
                        window.location.href = 'marketplace.html';
                    } else if (action === 'saved') {
                        navigateTo('saved');
                    } else if (action === 'profile') {
                        navigateTo('profile');
                    }
                });
            })(actionBtns[m]);
        }

        // Profile dropdown
        var profileDropdown = document.getElementById('buyerProfileDropdown');
        var profileTrigger = document.querySelector('.buyer-profile-trigger');

        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            document.addEventListener('click', function(e) {
                if (profileDropdown && !profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }

        var profileMenuItems = document.querySelectorAll('.buyer-profile-menu-item');
        for (var n = 0; n < profileMenuItems.length; n++) {
            (function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    var action = this.dataset.action;
                    if (profileDropdown) profileDropdown.classList.remove('active');
                    if (action === 'profile') navigateTo('profile');
                    else if (action === 'settings') navigateTo('settings');
                    else if (action === 'logout') {
                        openModal('Logout', 'Are you sure you want to logout?', '', 'Logout', 'Cancel', function() {
                            closeModal();
                            showToast('Info', 'Logging out...', 'info');
                            setTimeout(function() { window.location.href = 'login.html'; }, 1000);
                        });
                    }
                });
            })(profileMenuItems[n]);
        }

        // Logout
        var logoutLink = document.querySelector('.buyer-sidebar-logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('Logout', 'Are you sure you want to logout?', '', 'Logout', 'Cancel', function() {
                    closeModal();
                    showToast('Info', 'Logging out...', 'info');
                    setTimeout(function() { window.location.href = 'login.html'; }, 1000);
                });
            });
        }

        // Global search
        var globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    var term = this.value.toLowerCase();
                    var sections = ['saved', 'contacts', 'reviews'];
                    var found = false;
                    for (var p = 0; p < sections.length; p++) {
                        var el = document.getElementById('section-' + sections[p]);
                        if (el) {
                            var text = el.textContent.toLowerCase();
                            if (text.indexOf(term) !== -1) {
                                navigateTo(sections[p]);
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        showToast('Info', 'No results found for "' + this.value + '"', 'info');
                    }
                }
            });
        }
    }

    // =============================================================
    // INITIALIZE
    // =============================================================
    function init() {
        console.log('🛒 Initializing Buyer Dashboard...');

        initData();
        setupEventListeners();
        updateProfilePreview();

        // Initial render
        renderSaved();
        renderContacts();
        renderReviews();
        renderNotifications();
        updateOverview();

        // Set default active section
        navigateTo('overview');

        setTimeout(function() {
            showToast('Welcome back!', 'Chioma, fresh farm produce awaits you. 🌾', 'success');
        }, 800);

        console.log('✅ Buyer Dashboard initialized successfully');
        console.log('📊 Stats:', {
            saved: savedProducts.length,
            contacts: contacts.length,
            reviews: reviews.length,
            notifications: notifications.length
        });
    }

    // =============================================================
    // START
    // =============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
    
})();


// =============================================================
// LOGISTICS DASHBOARD · FarmConnect Logistics Dashboard
// Namespaced, conflict-free, production-ready
// =============================================================

(function() {
    'use strict';

    // =============================================================
    // PAGE-SAFE INITIALIZATION
    // Only runs on logistics dashboard page
    // =============================================================
    if (!document.getElementById('logisticsSidebar')) {
        console.log('⏭️ Not on logistics dashboard page, skipping initialization.');
        return;
    }

    console.log('🚚 Logistics Dashboard initializing...');

    // =============================================================
    // DOM REFS - SAFE ELEMENT RETRIEVAL
    // =============================================================
    function getLogisticsEl(id) {
        var el = document.getElementById(id);
        if (!el) {
            console.warn('⚠️ Element not found:', id);
        }
        return el;
    }

    var sidebar = getLogisticsEl('logisticsSidebar');
    var overlay = getLogisticsEl('logisticsOverlay');
    var sidebarCollapse = getLogisticsEl('logisticsSidebarCollapse');
    var navbarToggle = getLogisticsEl('logisticsNavbarToggle');
    var darkModeToggle = getLogisticsEl('logisticsDarkModeToggle');
    var modal = getLogisticsEl('logisticsModal');
    var modalClose = getLogisticsEl('logisticsModalClose');
    var modalCancel = getLogisticsEl('logisticsModalCancel');
    var modalConfirm = getLogisticsEl('logisticsModalConfirm');
    var modalTitle = getLogisticsEl('logisticsModalTitle');
    var modalMessage = getLogisticsEl('logisticsModalMessage');
    var modalFields = getLogisticsEl('logisticsModalFields');
    var toastContainer = getLogisticsEl('logisticsToastContainer');

    // Add Service Modal
    var addServiceModal = getLogisticsEl('logisticsAddServiceModal');
    var addServiceModalClose = getLogisticsEl('logisticsAddServiceModalClose');
    var addServiceCancel = getLogisticsEl('logisticsAddServiceCancel');
    var addServiceForm = getLogisticsEl('logisticsAddServiceForm');

    // Profile
    var profileImageInput = getLogisticsEl('logisticsProfileImageInput');
    var profileImageUpload = getLogisticsEl('logisticsProfileImageUpload');
    var profileImagePreview = getLogisticsEl('logisticsProfileImagePreview');
    var companyNameInput = getLogisticsEl('logisticsCompanyName');
    var serviceTypeInput = getLogisticsEl('logisticsServiceType');
    var locationInput = getLogisticsEl('logisticsLocation');
    var descriptionInput = getLogisticsEl('logisticsDescription');
    var whatsappInput = getLogisticsEl('logisticsWhatsApp');
    var phoneInput = getLogisticsEl('logisticsPhone');
    var coverageInput = getLogisticsEl('logisticsCoverage');
    var previewName = getLogisticsEl('logisticsPreviewName');
    var previewService = getLogisticsEl('logisticsPreviewService');
    var previewLocation = getLogisticsEl('logisticsPreviewLocation');
    var previewBio = getLogisticsEl('logisticsPreviewBio');
    var previewWhatsApp = getLogisticsEl('logisticsPreviewWhatsApp');
    var previewPhone = getLogisticsEl('logisticsPreviewPhone');
    var previewCoverage = getLogisticsEl('logisticsPreviewCoverage');
    var previewAvatar = getLogisticsEl('logisticsPreviewAvatar');
    var previewAvatarText = getLogisticsEl('logisticsPreviewAvatarText');
    var profileForm = getLogisticsEl('logisticsProfileForm');

    // Services
    var servicesGrid = getLogisticsEl('logisticsServicesGrid');
    var serviceSearch = getLogisticsEl('logisticsServiceSearch');
    var serviceTypeFilter = getLogisticsEl('logisticsServiceTypeFilter');
    var addServiceBtn = getLogisticsEl('logisticsAddServiceBtn');

    // Contacts
    var contactsList = getLogisticsEl('logisticsContactsList');
    var contactSearch = getLogisticsEl('logisticsContactSearch');
    var contactStatusFilter = getLogisticsEl('logisticsContactStatusFilter');

    // Reviews
    var reviewsList = getLogisticsEl('logisticsReviewsList');

    // Notifications
    var notificationsList = getLogisticsEl('logisticsNotificationsList');
    var notificationDot = getLogisticsEl('logisticsNotificationDot');
    var notificationIcon = getLogisticsEl('logisticsNotificationIcon');

    // Settings
    var settingsDarkMode = getLogisticsEl('logisticsSettingsDarkMode');
    var changePasswordBtn = getLogisticsEl('logisticsChangePasswordBtn');

    // Stats
    var welcomeName = getLogisticsEl('logisticsWelcomeName');
    var servicesCount = getLogisticsEl('logisticsServicesCount');
    var buyersCount = getLogisticsEl('logisticsBuyersCount');
    var farmersCount = getLogisticsEl('logisticsFarmersCount');
    var reviewsCount = getLogisticsEl('logisticsReviewsCount');
    var markAllReadBtn = getLogisticsEl('logisticsMarkAllReadBtn');

    // If critical elements are missing, exit
    if (!sidebar) {
        console.error('❌ Critical: Sidebar not found, aborting.');
        return;
    }

    // =============================================================
    // STATE
    // =============================================================
    var currentSection = 'overview';
    var isSidebarCollapsed = false;
    var isDarkMode = false;
    var services = [];
    var contacts = [];
    var reviews = [];
    var notifications = [];

    // =============================================================
    // INITIAL DATA
    // =============================================================
    function initLogisticsData() {
        // Load from localStorage or use defaults
        var savedData = localStorage.getItem('logisticsServices');
        if (savedData) {
            try {
                services = JSON.parse(savedData);
            } catch(e) {
                services = getDefaultLogisticsServices();
            }
        } else {
            services = getDefaultLogisticsServices();
        }

        var contactsData = localStorage.getItem('logisticsContacts');
        if (contactsData) {
            try {
                contacts = JSON.parse(contactsData);
            } catch(e) {
                contacts = getDefaultLogisticsContacts();
            }
        } else {
            contacts = getDefaultLogisticsContacts();
        }

        var reviewsData = localStorage.getItem('logisticsReviews');
        if (reviewsData) {
            try {
                reviews = JSON.parse(reviewsData);
            } catch(e) {
                reviews = getDefaultLogisticsReviews();
            }
        } else {
            reviews = getDefaultLogisticsReviews();
        }

        var notifsData = localStorage.getItem('logisticsNotifications');
        if (notifsData) {
            try {
                notifications = JSON.parse(notifsData);
            } catch(e) {
                notifications = getDefaultLogisticsNotifications();
            }
        } else {
            notifications = getDefaultLogisticsNotifications();
        }
    }

    function getDefaultLogisticsServices() {
        return [
            {
                id: 1,
                name: 'Bulk Farm Produce Transport',
                type: 'Farm Produce Transport',
                coverage: 'Lagos, Ibadan, Oyo',
                description: 'Heavy-duty transport for large volume farm produce across Nigeria.',
                status: 'Available',
                dateAdded: '2026-01-15',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop'
            },
            {
                id: 2,
                name: 'Cold Chain Delivery',
                type: 'Cold Chain Delivery',
                coverage: 'Lagos, Abuja, Kano',
                description: 'Temperature-controlled transport for perishable produce.',
                status: 'Available',
                dateAdded: '2026-02-20',
                image: 'https://images.unsplash.com/photo-1577412647305-9918a0b5f0b8?w=400&h=250&fit=crop'
            }
        ];
    }

    function getDefaultLogisticsContacts() {
        return [
            {
                id: 1,
                name: 'Chioma Okafor',
                type: 'Buyer',
                service: 'Bulk Farm Produce Transport',
                method: 'WhatsApp',
                date: '2026-03-20',
                status: 'Ongoing'
            },
            {
                id: 2,
                name: 'Ade Farms',
                type: 'Farmer',
                service: 'Cold Chain Delivery',
                method: 'Phone',
                date: '2026-03-18',
                status: 'Contacted'
            }
        ];
    }

    function getDefaultLogisticsReviews() {
        return [
            {
                id: 1,
                reviewer: 'Chioma Okafor',
                type: 'Buyer',
                rating: 5,
                text: 'Excellent service! My produce arrived fresh and on time.',
                date: 'March 15, 2026',
                reply: ''
            },
            {
                id: 2,
                reviewer: 'Ade Farms',
                type: 'Farmer',
                rating: 4,
                text: 'Reliable logistics provider. Good communication.',
                date: 'March 10, 2026',
                reply: 'Thank you for your feedback!'
            }
        ];
    }

    function getDefaultLogisticsNotifications() {
        return [
            {
                id: 1,
                title: 'New Review Received',
                message: 'Chioma Okafor left a 5-star review on your service.',
                time: '2 hours ago',
                read: false,
                link: 'reviews'
            },
            {
                id: 2,
                title: 'Buyer Contacted You',
                message: 'Chioma Okafor contacted you about Bulk Farm Produce Transport.',
                time: '5 hours ago',
                read: false,
                link: 'contacts'
            },
            {
                id: 3,
                title: 'Profile Updated',
                message: 'Your company profile has been successfully updated.',
                time: '1 day ago',
                read: true,
                link: 'profile'
            }
        ];
    }

    // =============================================================
    // SAVE TO LOCALSTORAGE
    // =============================================================
    function saveLogisticsData() {
        try {
            localStorage.setItem('logisticsServices', JSON.stringify(services));
            localStorage.setItem('logisticsContacts', JSON.stringify(contacts));
            localStorage.setItem('logisticsReviews', JSON.stringify(reviews));
            localStorage.setItem('logisticsNotifications', JSON.stringify(notifications));
        } catch(e) {}
    }

    // =============================================================
    // TOAST SYSTEM
    // =============================================================
    function showLogisticsToast(title, message, type) {
        type = type || 'success';
        if (!toastContainer) return;

        var toast = document.createElement('div');
        toast.className = 'logistics-toast logistics-toast-' + type;
        var icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        toast.innerHTML = '<div class="logistics-toast-icon"><i class="fas ' + (icons[type] || icons.success) + '"></i></div><div class="logistics-toast-content"><div class="logistics-toast-title">' + title + '</div><div class="logistics-toast-message">' + message + '</div></div><button class="logistics-toast-close">&times;</button>';
        var closeBtn = toast.querySelector('.logistics-toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() { toast.remove(); });
        }
        toastContainer.appendChild(toast);
        setTimeout(function() {
            if (toast.parentNode) toast.remove();
        }, 5000);
    }

    // =============================================================
    // MODAL SYSTEM
    // =============================================================
    function openLogisticsModal(title, message, fields, confirmText, cancelText, confirmCallback) {
        fields = fields || '';
        confirmText = confirmText || 'Confirm';
        cancelText = cancelText || 'Cancel';
        if (!modal) return;

        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        if (modalFields) modalFields.innerHTML = fields;
        if (modalConfirm) modalConfirm.textContent = confirmText;
        if (modalCancel) modalCancel.textContent = cancelText;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal._confirmCallback = confirmCallback || null;
    }

    function closeLogisticsModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalFields) modalFields.innerHTML = '';
        modal._confirmCallback = null;
    }

    // =============================================================
    // NAVIGATION
    // =============================================================
    function navigateToLogisticsSection(section) {
        var links = document.querySelectorAll('.logistics-sidebar-link[data-section]');
        for (var i = 0; i < links.length; i++) {
            var l = links[i];
            if (l.dataset.section === section) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        }

        var sections = document.querySelectorAll('.logistics-section');
        for (var j = 0; j < sections.length; j++) {
            var s = sections[j];
            if (s.id === 'logistics-section-' + section) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        }

        var titles = {
            overview: 'Overview',
            profile: 'Company Profile',
            services: 'Service Listings',
            contacts: 'Contact History',
            reviews: 'Reviews',
            notifications: 'Notifications',
            settings: 'Settings'
        };
        var titleEl = document.getElementById('logisticsPageTitle');
        if (titleEl) titleEl.textContent = titles[section] || 'Dashboard';

        currentSection = section;

        if (section === 'overview') updateLogisticsOverview();
        if (section === 'services') renderLogisticsServices();
        if (section === 'contacts') renderLogisticsContacts();
        if (section === 'reviews') renderLogisticsReviews();
        if (section === 'notifications') renderLogisticsNotifications();
    }

    // =============================================================
    // PROFILE PREVIEW
    // =============================================================
    function updateLogisticsProfilePreview() {
        var name = companyNameInput ? companyNameInput.value || 'Your Company' : 'Your Company';
        var service = serviceTypeInput ? serviceTypeInput.value || 'Service Type' : 'Service Type';
        var location = locationInput ? locationInput.value || 'Your Location' : 'Your Location';
        var bio = descriptionInput ? descriptionInput.value || 'No description provided.' : 'No description provided.';
        var whatsapp = whatsappInput ? whatsappInput.value || 'Not provided' : 'Not provided';
        var phone = phoneInput ? phoneInput.value || 'Not provided' : 'Not provided';
        var coverage = coverageInput ? coverageInput.value || 'Not provided' : 'Not provided';

        if (previewName) previewName.textContent = name;
        if (previewService) previewService.innerHTML = '<i class="fas fa-truck"></i> ' + service;
        if (previewLocation) previewLocation.innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + location;
        if (previewBio) previewBio.textContent = bio;
        if (previewWhatsApp) previewWhatsApp.textContent = whatsapp;
        if (previewPhone) previewPhone.textContent = phone;
        if (previewCoverage) previewCoverage.textContent = coverage;

        var initials = name.split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
        if (previewAvatarText) previewAvatarText.textContent = initials;

        if (welcomeName) welcomeName.textContent = name.split(' ')[0] || 'Logistics';
    }

    // =============================================================
    // PROFILE IMAGE
    // =============================================================
    if (profileImageUpload && profileImageInput) {
        profileImageUpload.addEventListener('click', function() {
            profileImageInput.click();
        });
        profileImageInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(event) {
                if (profileImagePreview) {
                    profileImagePreview.innerHTML = '<img src="' + event.target.result + '" alt="Logo">';
                }
                if (previewAvatar) {
                    previewAvatar.innerHTML = '<img src="' + event.target.result + '" alt="Logo">';
                    previewAvatar.style.background = 'transparent';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Profile form
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showLogisticsToast('Success', 'Company profile updated successfully!', 'success');
            updateLogisticsProfilePreview();
            saveLogisticsData();
        });
    }

    // Profile inputs live preview
    var profileInputs = [companyNameInput, serviceTypeInput, locationInput, descriptionInput, whatsappInput, phoneInput, coverageInput];
    for (var j = 0; j < profileInputs.length; j++) {
        (function(input) {
            if (input) {
                input.addEventListener('input', updateLogisticsProfilePreview);
            }
        })(profileInputs[j]);
    }

    // =============================================================
    // SERVICES
    // =============================================================
    function renderLogisticsServices() {
        if (!servicesGrid) return;

        var search = serviceSearch ? serviceSearch.value.toLowerCase() : '';
        var type = serviceTypeFilter ? serviceTypeFilter.value : '';

        var filtered = [];
        for (var i = 0; i < services.length; i++) {
            var s = services[i];
            var matchSearch = s.name.toLowerCase().indexOf(search) !== -1;
            var matchType = !type || s.type === type;
            if (matchSearch && matchType) {
                filtered.push(s);
            }
        }

        if (filtered.length === 0) {
            servicesGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--logistics-text-secondary);"><i class="fas fa-truck" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No services found. <a href="#" onclick="openLogisticsAddServiceModal();return false;" style="color:#2D7D3A;">Add your first service</a></p></div>';
            return;
        }

        var html = '';
        for (var j = 0; j < filtered.length; j++) {
            var s = filtered[j];
            var statusClass = 'logistics-status-' + (s.status === 'Available' ? 'available' : s.status === 'Limited' ? 'low' : 'sold');
            var imageUrl = s.image || 'https://via.placeholder.com/400x250/E5E7EB/6B7280?text=No+Image';
            html += '<div class="logistics-service-item"><div class="logistics-service-image" style="background-image: url(\'' + imageUrl + '\');"></div><div class="logistics-service-body"><div class="logistics-service-name">' + s.name + '</div><div class="logistics-service-meta"><span>' + s.type + '</span><span>' + s.coverage + '</span></div><div class="logistics-service-meta"><span class="logistics-service-status ' + statusClass + '">' + s.status + '</span><span style="font-size:0.7rem;color:var(--logistics-text-secondary);">' + s.dateAdded + '</span></div><div class="logistics-service-actions"><button class="logistics-btn logistics-btn-sm logistics-btn-outline" data-action="view-service" data-id="' + s.id + '">View</button><button class="logistics-btn logistics-btn-sm logistics-btn-outline" data-action="edit-service" data-id="' + s.id + '">Edit</button><button class="logistics-btn logistics-btn-sm logistics-btn-outline" data-action="delete-service" data-id="' + s.id + '" style="color:#EF4444;border-color:#EF4444;">Delete</button></div></div></div>';
        }
        servicesGrid.innerHTML = html;

        // Event delegation for service actions
        servicesGrid.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            if (action === 'view-service') {
                var service = null;
                for (var m = 0; m < services.length; m++) {
                    if (services[m].id === id) { service = services[m]; break; }
                }
                if (service) {
                    var fields = '<p><strong>Name:</strong> ' + service.name + '</p><p><strong>Type:</strong> ' + service.type + '</p><p><strong>Coverage:</strong> ' + service.coverage + '</p><p><strong>Status:</strong> ' + service.status + '</p><p><strong>Description:</strong> ' + service.description + '</p><p><strong>Added:</strong> ' + service.dateAdded + '</p>';
                    openLogisticsModal('Service Details', '', fields, 'Close', '');
                    if (modalCancel) modalCancel.style.display = 'none';
                    if (modalConfirm) modalConfirm.textContent = 'Close';
                    modal._confirmCallback = closeLogisticsModal;
                    setTimeout(function() {
                        if (modalCancel) modalCancel.style.display = '';
                        if (modalConfirm) modalConfirm.textContent = 'Confirm';
                    }, 100);
                }
            } else if (action === 'edit-service') {
                // Open add service modal with data
                var service = null;
                for (var m = 0; m < services.length; m++) {
                    if (services[m].id === id) { service = services[m]; break; }
                }
                if (service) {
                    openLogisticsAddServiceModal(service);
                }
            } else if (action === 'delete-service') {
                var service = null;
                for (var m = 0; m < services.length; m++) {
                    if (services[m].id === id) { service = services[m]; break; }
                }
                if (service) {
                    openLogisticsModal('Delete Service', 'Are you sure you want to delete "' + service.name + '"?', '', 'Delete', 'Cancel', function() {
                        var newServices = [];
                        for (var m = 0; m < services.length; m++) {
                            if (services[m].id !== id) newServices.push(services[m]);
                        }
                        services = newServices;
                        saveLogisticsData();
                        renderLogisticsServices();
                        updateLogisticsOverview();
                        closeLogisticsModal();
                        showLogisticsToast('Deleted', 'Service deleted successfully.', 'success');
                    });
                }
            }
        });

        if (servicesCount) servicesCount.textContent = services.length;
    }

    // =============================================================
    // ADD SERVICE MODAL
    // =============================================================
    function openLogisticsAddServiceModal(editData) {
        if (!addServiceModal) return;

        var isEdit = !!editData;
        var title = isEdit ? 'Edit Service' : 'Add New Service';
        var titleEl = document.getElementById('logisticsAddServiceModalTitle');
        if (titleEl) titleEl.textContent = title;

        // Reset form
        var form = addServiceForm;
        if (form) form.reset();

        if (isEdit && editData) {
            document.getElementById('logisticsServiceName').value = editData.name || '';
            document.getElementById('logisticsServiceTypeSelect').value = editData.type || '';
            document.getElementById('logisticsServiceCoverage').value = editData.coverage || '';
            document.getElementById('logisticsServiceDescription').value = editData.description || '';
            document.getElementById('logisticsServiceStatus').value = editData.status || 'Available';
            if (editData.image) {
                var preview = document.getElementById('logisticsServiceImagePreview');
                if (preview) {
                    preview.innerHTML = '<img src="' + editData.image + '" alt="Service">';
                }
            }
            // Store edit ID
            addServiceModal._editId = editData.id;
        } else {
            addServiceModal._editId = null;
            var preview = document.getElementById('logisticsServiceImagePreview');
            if (preview) {
                preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>';
            }
        }

        addServiceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLogisticsAddServiceModal() {
        if (!addServiceModal) return;
        addServiceModal.classList.remove('active');
        document.body.style.overflow = '';
        addServiceModal._editId = null;
    }

    if (addServiceModalClose) {
        addServiceModalClose.addEventListener('click', closeLogisticsAddServiceModal);
    }
    if (addServiceCancel) {
        addServiceCancel.addEventListener('click', closeLogisticsAddServiceModal);
    }
    if (addServiceModal) {
        addServiceModal.addEventListener('click', function(e) {
            if (e.target === addServiceModal) closeLogisticsAddServiceModal();
        });
    }

    // Service image upload
    var serviceImageUpload = document.getElementById('logisticsServiceImageUpload');
    var serviceImageInput = document.getElementById('logisticsServiceImageInput');
    var serviceImagePreview = document.getElementById('logisticsServiceImagePreview');

    if (serviceImageUpload && serviceImageInput) {
        serviceImageUpload.addEventListener('click', function() {
            serviceImageInput.click();
        });
        serviceImageInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(event) {
                if (serviceImagePreview) {
                    serviceImagePreview.innerHTML = '<img src="' + event.target.result + '" alt="Service">';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Add service form submit
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('logisticsServiceName').value.trim();
            var type = document.getElementById('logisticsServiceTypeSelect').value;
            var coverage = document.getElementById('logisticsServiceCoverage').value.trim();
            var description = document.getElementById('logisticsServiceDescription').value.trim();
            var status = document.getElementById('logisticsServiceStatus').value;
            var image = serviceImagePreview ? serviceImagePreview.querySelector('img')?.src || '' : '';

            if (!name) {
                showLogisticsToast('Error', 'Please enter a service name.', 'error');
                return;
            }

            var editId = addServiceModal._editId;

            if (editId) {
                // Edit existing
                for (var m = 0; m < services.length; m++) {
                    if (services[m].id === editId) {
                        services[m].name = name;
                        services[m].type = type;
                        services[m].coverage = coverage;
                        services[m].description = description;
                        services[m].status = status;
                        if (image) services[m].image = image;
                        break;
                    }
                }
                showLogisticsToast('Success', 'Service updated successfully!', 'success');
            } else {
                // Add new
                var newService = {
                    id: Date.now(),
                    name: name,
                    type: type,
                    coverage: coverage,
                    description: description,
                    status: status,
                    image: image,
                    dateAdded: new Date().toISOString().split('T')[0]
                };
                services.push(newService);
                showLogisticsToast('Success', 'Service added successfully!', 'success');
            }

            saveLogisticsData();
            renderLogisticsServices();
            updateLogisticsOverview();
            closeLogisticsAddServiceModal();
        });
    }

    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            openLogisticsAddServiceModal(null);
        });
    }

    // =============================================================
    // CONTACTS
    // =============================================================
    function renderLogisticsContacts() {
        if (!contactsList) return;

        var search = contactSearch ? contactSearch.value.toLowerCase() : '';
        var status = contactStatusFilter ? contactStatusFilter.value : '';

        var filtered = [];
        for (var i = 0; i < contacts.length; i++) {
            var c = contacts[i];
            var matchSearch = c.name.toLowerCase().indexOf(search) !== -1 || c.service.toLowerCase().indexOf(search) !== -1;
            var matchStatus = !status || c.status === status;
            if (matchSearch && matchStatus) {
                filtered.push(c);
            }
        }

        if (filtered.length === 0) {
            contactsList.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--logistics-text-secondary);"><i class="fas fa-phone" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No contact history found.</p></div>';
            return;
        }

        var html = '';
        for (var j = 0; j < filtered.length; j++) {
            var c = filtered[j];
            var statusClass = 'logistics-contact-status-' + c.status.toLowerCase();
            html += '<div class="logistics-contact-item"><div class="logistics-contact-info"><h4>' + c.name + '</h4><p>' + c.type + ' · ' + c.service + ' · ' + c.method + '</p><p style="font-size:0.75rem;color:var(--logistics-text-secondary);">' + c.date + '</p></div><span class="logistics-contact-status ' + statusClass + '">' + c.status + '</span><div class="logistics-contact-actions"><button class="logistics-btn logistics-btn-sm logistics-btn-outline" data-action="view-contact" data-id="' + c.id + '">View</button>' + (c.status !== 'Closed' ? '<button class="logistics-btn logistics-btn-sm logistics-btn-primary" data-action="continue-contact" data-id="' + c.id + '">Continue</button>' : '') + '<button class="logistics-btn logistics-btn-sm logistics-btn-outline" data-action="delete-contact" data-id="' + c.id + '" style="color:#EF4444;border-color:#EF4444;">Delete</button></div></div>';
        }
        contactsList.innerHTML = html;

        contactsList.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            if (action === 'view-contact') {
                var contact = null;
                for (var m = 0; m < contacts.length; m++) {
                    if (contacts[m].id === id) { contact = contacts[m]; break; }
                }
                if (contact) {
                    var fields = '<p><strong>Name:</strong> ' + contact.name + '</p><p><strong>Type:</strong> ' + contact.type + '</p><p><strong>Service:</strong> ' + contact.service + '</p><p><strong>Contact Method:</strong> ' + contact.method + '</p><p><strong>Date:</strong> ' + contact.date + '</p><p><strong>Status:</strong> ' + contact.status + '</p>';
                    openLogisticsModal('Contact Details', '', fields, 'Close', '');
                    if (modalCancel) modalCancel.style.display = 'none';
                    if (modalConfirm) modalConfirm.textContent = 'Close';
                    modal._confirmCallback = closeLogisticsModal;
                    setTimeout(function() {
                        if (modalCancel) modalCancel.style.display = '';
                        if (modalConfirm) modalConfirm.textContent = 'Confirm';
                    }, 100);
                }
            } else if (action === 'continue-contact') {
                var contact = null;
                for (var m = 0; m < contacts.length; m++) {
                    if (contacts[m].id === id) { contact = contacts[m]; break; }
                }
                if (contact) {
                    var fields = '<div class="logistics-form-group"><label>Your Message</label><textarea id="continueMessageInput" class="logistics-form-textarea" rows="4" placeholder="Hi, I\'d like to follow up on..."></textarea></div>';
                    openLogisticsModal('Continue Conversation', 'Continue your conversation with ' + contact.name + ':', fields, 'Send', 'Cancel', function() {
                        var msgInput = document.getElementById('continueMessageInput');
                        var message = msgInput ? msgInput.value.trim() : '';
                        if (!message) {
                            showLogisticsToast('Error', 'Please write a message.', 'error');
                            return;
                        }
                        contact.status = 'Ongoing';
                        saveLogisticsData();
                        showLogisticsToast('Success', 'Message sent to ' + contact.name + '!', 'success');
                        closeLogisticsModal();
                        renderLogisticsContacts();
                    });
                }
            } else if (action === 'delete-contact') {
                var contact = null;
                for (var m = 0; m < contacts.length; m++) {
                    if (contacts[m].id === id) { contact = contacts[m]; break; }
                }
                if (contact) {
                    openLogisticsModal('Delete Contact History', 'Are you sure you want to delete contact with ' + contact.name + '?', '', 'Delete', 'Cancel', function() {
                        var newContacts = [];
                        for (var m = 0; m < contacts.length; m++) {
                            if (contacts[m].id !== id) newContacts.push(contacts[m]);
                        }
                        contacts = newContacts;
                        saveLogisticsData();
                        renderLogisticsContacts();
                        updateLogisticsOverview();
                        closeLogisticsModal();
                        showLogisticsToast('Deleted', 'Contact history removed.', 'success');
                    });
                }
            }
        });

        var buyerCount = 0;
        var farmerCount = 0;
        for (var m = 0; m < contacts.length; m++) {
            if (contacts[m].type === 'Buyer') buyerCount++;
            else if (contacts[m].type === 'Farmer') farmerCount++;
        }
        if (buyersCount) buyersCount.textContent = buyerCount;
        if (farmersCount) farmersCount.textContent = farmerCount;
    }

    // =============================================================
    // REVIEWS
    // =============================================================
    function renderLogisticsReviews() {
        if (!reviewsList) return;

        if (reviews.length === 0) {
            reviewsList.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--logistics-text-secondary);"><i class="fas fa-star" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No reviews received yet.</p></div>';
            return;
        }

        var html = '';
        for (var i = 0; i < reviews.length; i++) {
            var r = reviews[i];
            var stars = '';
            for (var s = 0; s < r.rating; s++) stars += '⭐';
            for (var s = r.rating; s < 5; s++) stars += '☆';
            html += '<div class="logistics-review-item"><div class="logistics-review-header"><div><span class="logistics-review-recipient">' + r.reviewer + '</span><span class="logistics-review-type">' + r.type + '</span></div><span class="logistics-review-stars">' + stars + '</span></div><p class="logistics-review-text">"' + r.text + '"</p><span class="logistics-review-date">' + r.date + '</span>';
            if (r.reply) {
                html += '<div class="logistics-review-reply"><div class="logistics-review-reply-label">Your Reply</div><p class="logistics-review-reply-text">' + r.reply + '</p></div>';
            }
            html += '<div class="logistics-review-actions">';
            if (!r.reply) {
                html += '<button class="logistics-btn logistics-btn-sm logistics-btn-primary" data-action="reply-review" data-id="' + r.id + '">Reply</button>';
            } else {
                html += '<button class="logistics-btn logistics-btn-sm logistics-btn-outline" data-action="delete-reply" data-id="' + r.id + '" style="color:#EF4444;border-color:#EF4444;">Delete Reply</button>';
            }
            html += '</div></div>';
        }
        reviewsList.innerHTML = html;

        reviewsList.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            if (action === 'reply-review') {
                var review = null;
                for (var m = 0; m < reviews.length; m++) {
                    if (reviews[m].id === id) { review = reviews[m]; break; }
                }
                if (review) {
                    var fields = '<div class="logistics-form-group"><label>Your Reply</label><textarea id="replyInput" class="logistics-form-textarea" rows="4" placeholder="Thank you for your review..."></textarea></div>';
                    openLogisticsModal('Reply to Review', 'Respond to ' + review.reviewer + ':', fields, 'Send Reply', 'Cancel', function() {
                        var replyInput = document.getElementById('replyInput');
                        var reply = replyInput ? replyInput.value.trim() : '';
                        if (!reply) {
                            showLogisticsToast('Error', 'Please write a reply.', 'error');
                            return;
                        }
                        review.reply = reply;
                        saveLogisticsData();
                        renderLogisticsReviews();
                        closeLogisticsModal();
                        showLogisticsToast('Success', 'Reply sent successfully!', 'success');
                    });
                }
            } else if (action === 'delete-reply') {
                var review = null;
                for (var m = 0; m < reviews.length; m++) {
                    if (reviews[m].id === id) { review = reviews[m]; break; }
                }
                if (review) {
                    openLogisticsModal('Delete Reply', 'Are you sure you want to delete your reply?', '', 'Delete', 'Cancel', function() {
                        review.reply = '';
                        saveLogisticsData();
                        renderLogisticsReviews();
                        closeLogisticsModal();
                        showLogisticsToast('Deleted', 'Reply deleted successfully.', 'success');
                    });
                }
            }
        });

        if (reviewsCount) reviewsCount.textContent = reviews.length;
    }

    // =============================================================
    // NOTIFICATIONS
    // =============================================================
    function renderLogisticsNotifications() {
        if (!notificationsList) return;

        var unreadCount = 0;
        for (var i = 0; i < notifications.length; i++) {
            if (!notifications[i].read) unreadCount++;
        }
        if (notificationDot) {
            notificationDot.style.display = unreadCount > 0 ? 'block' : 'none';
        }

        if (notifications.length === 0) {
            notificationsList.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--logistics-text-secondary);"><i class="fas fa-bell-slash" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No notifications</p></div>';
            return;
        }

        var html = '';
        for (var j = 0; j < notifications.length; j++) {
            var n = notifications[j];
            html += '<div class="logistics-notification-item ' + (n.read ? '' : 'unread') + '" data-id="' + n.id + '" data-link="' + n.link + '"><div class="logistics-notification-content"><div class="logistics-notification-title">' + n.title + '</div><div class="logistics-notification-message">' + n.message + '</div><span class="logistics-notification-time">' + n.time + '</span></div><div class="logistics-notification-actions"><button class="logistics-btn logistics-btn-sm logistics-btn-outline" data-action="mark-read" data-id="' + n.id + '">' + (n.read ? 'Read' : 'Mark Read') + '</button><button class="logistics-btn logistics-btn-sm logistics-btn-outline" data-action="delete-notification" data-id="' + n.id + '" style="color:#EF4444;border-color:#EF4444;">Delete</button></div></div>';
        }
        notificationsList.innerHTML = html;

        notificationsList.addEventListener('click', function(e) {
            var target = e.target;
            var item = target.closest('.logistics-notification-item');
            if (!item) return;

            var btn = target.closest('button');
            if (btn) {
                var action = btn.dataset.action;
                var id = parseInt(btn.dataset.id);
                if (action === 'mark-read') {
                    var notif = null;
                    for (var m = 0; m < notifications.length; m++) {
                        if (notifications[m].id === id) { notif = notifications[m]; break; }
                    }
                    if (notif) {
                        notif.read = true;
                        saveLogisticsData();
                        renderLogisticsNotifications();
                    }
                    return;
                } else if (action === 'delete-notification') {
                    var notif = null;
                    for (var m = 0; m < notifications.length; m++) {
                        if (notifications[m].id === id) { notif = notifications[m]; break; }
                    }
                    if (notif) {
                        openLogisticsModal('Delete Notification', 'Are you sure you want to delete this notification?', '', 'Delete', 'Cancel', function() {
                            var newNotifs = [];
                            for (var m = 0; m < notifications.length; m++) {
                                if (notifications[m].id !== id) newNotifs.push(notifications[m]);
                            }
                            notifications = newNotifs;
                            saveLogisticsData();
                            renderLogisticsNotifications();
                            closeLogisticsModal();
                            showLogisticsToast('Deleted', 'Notification deleted.', 'success');
                        });
                    }
                    return;
                }
            }

            // Click on notification body to navigate
            var link = item.dataset.link;
            var id = parseInt(item.dataset.id);
            var notif = null;
            for (var m = 0; m < notifications.length; m++) {
                if (notifications[m].id === id) { notif = notifications[m]; break; }
            }
            if (notif && !notif.read) {
                notif.read = true;
                saveLogisticsData();
                renderLogisticsNotifications();
            }
            if (link) {
                navigateToLogisticsSection(link);
            }
        });
    }

    // =============================================================
    // OVERVIEW
    // =============================================================
    function updateLogisticsOverview() {
        if (servicesCount) servicesCount.textContent = services.length;

        var buyerCount = 0;
        var farmerCount = 0;
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].type === 'Buyer') buyerCount++;
            else if (contacts[i].type === 'Farmer') farmerCount++;
        }
        if (buyersCount) buyersCount.textContent = buyerCount;
        if (farmersCount) farmersCount.textContent = farmerCount;
        if (reviewsCount) reviewsCount.textContent = reviews.length;
    }

    // =============================================================
    // SETTINGS
    // =============================================================
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            var newPass = document.getElementById('logisticsSettingsNewPassword') ? document.getElementById('logisticsSettingsNewPassword').value : '';
            var confirmPass = document.getElementById('logisticsSettingsConfirmPassword') ? document.getElementById('logisticsSettingsConfirmPassword').value : '';

            if (!newPass || !confirmPass) {
                showLogisticsToast('Error', 'Please fill in both password fields.', 'error');
                return;
            }
            if (newPass !== confirmPass) {
                showLogisticsToast('Error', 'Passwords do not match.', 'error');
                return;
            }
            if (newPass.length < 6) {
                showLogisticsToast('Error', 'Password must be at least 6 characters.', 'error');
                return;
            }

            showLogisticsToast('Success', 'Password updated successfully!', 'success');
            if (document.getElementById('logisticsSettingsNewPassword')) document.getElementById('logisticsSettingsNewPassword').value = '';
            if (document.getElementById('logisticsSettingsConfirmPassword')) document.getElementById('logisticsSettingsConfirmPassword').value = '';
        });
    }

    // =============================================================
    // SETUP EVENT LISTENERS
    // =============================================================
    function setupLogisticsEventListeners() {
        // Sidebar collapse
        if (sidebarCollapse) {
            sidebarCollapse.addEventListener('click', function() {
                isSidebarCollapsed = !isSidebarCollapsed;
                if (sidebar) sidebar.classList.toggle('collapsed', isSidebarCollapsed);
                try {
                    localStorage.setItem('logisticsSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
                } catch(e) {}
            });
        }

        try {
            var savedCollapse = localStorage.getItem('logisticsSidebarCollapsed');
            if (savedCollapse === 'true') {
                isSidebarCollapsed = true;
                if (sidebar) sidebar.classList.add('collapsed');
            }
        } catch(e) {}

        // Mobile menu with overlay
        if (navbarToggle && sidebar) {
            navbarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
                if (overlay) overlay.classList.toggle('active');
                var icon = this.querySelector('i');
                if (icon) {
                    if (sidebar.classList.contains('mobile-open')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', function() {
                if (sidebar) sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                var icon = navbarToggle ? navbarToggle.querySelector('i') : null;
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }

        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                if (sidebar && navbarToggle && !sidebar.contains(e.target) && !navbarToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                    if (overlay) overlay.classList.remove('active');
                    var icon = navbarToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });

        // Sidebar links
        var sidebarLinks = document.querySelectorAll('.logistics-sidebar-link[data-section]');
        for (var i = 0; i < sidebarLinks.length; i++) {
            (function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    var section = this.dataset.section;
                    navigateToLogisticsSection(section);
                    if (window.innerWidth <= 992) {
                        if (sidebar) sidebar.classList.remove('mobile-open');
                        if (overlay) overlay.classList.remove('active');
                        var icon = navbarToggle ? navbarToggle.querySelector('i') : null;
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                });
            })(sidebarLinks[i]);
        }

        // Dark mode
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                isDarkMode = !isDarkMode;
                document.body.classList.toggle('logistics-dark-mode', isDarkMode);
                var icon = this.querySelector('i');
                if (icon) {
                    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
                }
                try {
                    localStorage.setItem('logisticsDarkMode', JSON.stringify(isDarkMode));
                } catch(e) {}
                if (settingsDarkMode) settingsDarkMode.checked = isDarkMode;
            });
        }

        try {
            var savedDarkMode = localStorage.getItem('logisticsDarkMode');
            if (savedDarkMode === 'true') {
                isDarkMode = true;
                document.body.classList.add('logistics-dark-mode');
                if (darkModeToggle) {
                    var icon = darkModeToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-sun';
                }
                if (settingsDarkMode) settingsDarkMode.checked = true;
            }
        } catch(e) {}

        if (settingsDarkMode) {
            settingsDarkMode.addEventListener('change', function() {
                if (darkModeToggle) darkModeToggle.click();
            });
        }

        // Modal close
        if (modalClose) {
            modalClose.addEventListener('click', closeLogisticsModal);
        }
        if (modalCancel) {
            modalCancel.addEventListener('click', closeLogisticsModal);
        }
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeLogisticsModal();
            });
        }
        if (modalConfirm) {
            modalConfirm.addEventListener('click', function() {
                if (modal._confirmCallback) {
                    modal._confirmCallback();
                } else {
                    closeLogisticsModal();
                }
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (modal && modal.classList.contains('active')) {
                    closeLogisticsModal();
                }
                if (addServiceModal && addServiceModal.classList.contains('active')) {
                    closeLogisticsAddServiceModal();
                }
            }
        });

        // Search and filter
        if (serviceSearch) {
            serviceSearch.addEventListener('input', renderLogisticsServices);
        }
        if (serviceTypeFilter) {
            serviceTypeFilter.addEventListener('change', renderLogisticsServices);
        }
        if (contactSearch) {
            contactSearch.addEventListener('input', renderLogisticsContacts);
        }
        if (contactStatusFilter) {
            contactStatusFilter.addEventListener('change', renderLogisticsContacts);
        }

        // Mark all read
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                for (var k = 0; k < notifications.length; k++) {
                    notifications[k].read = true;
                }
                saveLogisticsData();
                renderLogisticsNotifications();
                showLogisticsToast('Updated', 'All notifications marked as read.', 'success');
            });
        }

        // Notification icon click
        if (notificationIcon) {
            notificationIcon.addEventListener('click', function() {
                navigateToLogisticsSection('notifications');
            });
        }

        // Quick actions
        var actionBtns = document.querySelectorAll('[data-action="profile"], [data-action="services"], [data-action="contacts"]');
        for (var m = 0; m < actionBtns.length; m++) {
            (function(btn) {
                btn.addEventListener('click', function() {
                    var action = this.dataset.action;
                    if (action === 'profile') navigateToLogisticsSection('profile');
                    else if (action === 'services') navigateToLogisticsSection('services');
                    else if (action === 'contacts') navigateToLogisticsSection('contacts');
                });
            })(actionBtns[m]);
        }

        // Profile dropdown
        var profileDropdown = document.getElementById('logisticsProfileDropdown');
        var profileTrigger = document.querySelector('.logistics-profile-trigger');

        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            document.addEventListener('click', function(e) {
                if (profileDropdown && !profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }

        var profileMenuItems = document.querySelectorAll('.logistics-profile-menu-item');
        for (var n = 0; n < profileMenuItems.length; n++) {
            (function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    var action = this.dataset.action;
                    if (profileDropdown) profileDropdown.classList.remove('active');
                    if (action === 'profile') navigateToLogisticsSection('profile');
                    else if (action === 'settings') navigateToLogisticsSection('settings');
                    else if (action === 'logout') {
                        openLogisticsModal('Logout', 'Are you sure you want to logout?', '', 'Logout', 'Cancel', function() {
                            closeLogisticsModal();
                            showLogisticsToast('Info', 'Logging out...', 'info');
                            setTimeout(function() { window.location.href = 'login.html'; }, 1000);
                        });
                    }
                });
            })(profileMenuItems[n]);
        }

        // Logout
        var logoutLink = document.querySelector('.logistics-sidebar-logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                openLogisticsModal('Logout', 'Are you sure you want to logout?', '', 'Logout', 'Cancel', function() {
                    closeLogisticsModal();
                    showLogisticsToast('Info', 'Logging out...', 'info');
                    setTimeout(function() { window.location.href = 'login.html'; }, 1000);
                });
            });
        }

        // Global search
        var globalSearch = document.getElementById('logisticsGlobalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    var term = this.value.toLowerCase();
                    var sections = ['services', 'contacts', 'reviews'];
                    var found = false;
                    for (var p = 0; p < sections.length; p++) {
                        var el = document.getElementById('logistics-section-' + sections[p]);
                        if (el) {
                            var text = el.textContent.toLowerCase();
                            if (text.indexOf(term) !== -1) {
                                navigateToLogisticsSection(sections[p]);
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        showLogisticsToast('Info', 'No results found for "' + this.value + '"', 'info');
                    }
                }
            });
        }
    }

    // =============================================================
    // INITIALIZE
    // =============================================================
    function initLogisticsDashboard() {
        console.log('🚚 Initializing Logistics Dashboard...');

        initLogisticsData();
        setupLogisticsEventListeners();
        updateLogisticsProfilePreview();

        // Initial render
        renderLogisticsServices();
        renderLogisticsContacts();
        renderLogisticsReviews();
        renderLogisticsNotifications();
        updateLogisticsOverview();

        // Set default active section
        navigateToLogisticsSection('overview');

        setTimeout(function() {
            showLogisticsToast('Welcome back!', 'FarmExpress, your logistics services are ready. 🚚', 'success');
        }, 800);

        console.log('✅ Logistics Dashboard initialized successfully');
        console.log('📊 Stats:', {
            services: services.length,
            contacts: contacts.length,
            reviews: reviews.length,
            notifications: notifications.length
        });
    }

    // =============================================================
    // START
    // =============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLogisticsDashboard);
    } else {
        initLogisticsDashboard();
    }

})();



// =============================================================
// ADMIN DASHBOARD · FarmConnect Admin Dashboard
// Namespaced, conflict-free, production-ready
// =============================================================

(function() {
    'use strict';

    // =============================================================
    // PAGE-SAFE INITIALIZATION
    // Only runs on admin dashboard page
    // =============================================================
    if (!document.getElementById('adminSidebar')) {
        console.log('⏭️ Not on admin dashboard page, skipping initialization.');
        return;
    }

    console.log('🔐 Admin Dashboard initializing...');

    // =============================================================
    // DOM REFS - SAFE ELEMENT RETRIEVAL
    // =============================================================
    function getAdminEl(id) {
        var el = document.getElementById(id);
        if (!el) {
            console.warn('⚠️ Element not found:', id);
        }
        return el;
    }

    var sidebar = getAdminEl('adminSidebar');
    var overlay = getAdminEl('adminOverlay');
    var sidebarCollapse = getAdminEl('adminSidebarCollapse');
    var navbarToggle = getAdminEl('adminNavbarToggle');
    var darkModeToggle = getAdminEl('adminDarkModeToggle');
    var modal = getAdminEl('adminModal');
    var modalClose = getAdminEl('adminModalClose');
    var modalCancel = getAdminEl('adminModalCancel');
    var modalConfirm = getAdminEl('adminModalConfirm');
    var modalTitle = getAdminEl('adminModalTitle');
    var modalMessage = getAdminEl('adminModalMessage');
    var modalFields = getAdminEl('adminModalFields');
    var toastContainer = getAdminEl('adminToastContainer');

    // Users
    var usersBody = getAdminEl('adminUsersBody');
    var userSearch = getAdminEl('adminUserSearch');
    var userTypeFilter = getAdminEl('adminUserTypeFilter');
    var userStatusFilter = getAdminEl('adminUserStatusFilter');

    // Products
    var productsBody = getAdminEl('adminProductsBody');
    var productSearch = getAdminEl('adminProductSearch');
    var productStatusFilter = getAdminEl('adminProductStatusFilter');

    // Reviews
    var reviewsBody = getAdminEl('adminReviewsBody');
    var reviewSearch = getAdminEl('adminReviewSearch');
    var reviewRatingFilter = getAdminEl('adminReviewRatingFilter');

    // Reports
    var reportsBody = getAdminEl('adminReportsBody');
    var reportSearch = getAdminEl('adminReportSearch');
    var reportStatusFilter = getAdminEl('adminReportStatusFilter');

    // Notifications
    var notificationsList = getAdminEl('adminNotificationsList');
    var notificationDot = getAdminEl('adminNotificationDot');
    var notificationIcon = getAdminEl('adminNotificationIcon');
    var markAllReadBtn = getAdminEl('adminMarkAllReadBtn');

    // Settings
    var settingsDarkMode = getAdminEl('adminSettingsDarkMode');
    var changePasswordBtn = getAdminEl('adminChangePasswordBtn');

    // Stats
    var buyersCount = getAdminEl('adminBuyersCount');
    var farmersCount = getAdminEl('adminFarmersCount');
    var logisticsCount = getAdminEl('adminLogisticsCount');
    var productsCount = getAdminEl('adminProductsCount');
    var reviewsCount = getAdminEl('adminReviewsCount');
    var reportsCount = getAdminEl('adminReportsCount');

    // If critical elements are missing, exit
    if (!sidebar) {
        console.error('❌ Critical: Sidebar not found, aborting.');
        return;
    }

    // =============================================================
    // STATE
    // =============================================================
    var currentSection = 'overview';
    var isSidebarCollapsed = false;
    var isDarkMode = false;
    var users = [];
    var products = [];
    var reviews = [];
    var reports = [];
    var notifications = [];

    // =============================================================
    // INITIAL DATA
    // =============================================================
    function initAdminData() {
        users = getDefaultUsers();
        products = getDefaultProducts();
        reviews = getDefaultReviews();
        reports = getDefaultReports();
        notifications = getDefaultNotifications();

        // Load from localStorage
        try {
            var savedUsers = localStorage.getItem('adminUsers');
            if (savedUsers) users = JSON.parse(savedUsers);
            var savedProducts = localStorage.getItem('adminProducts');
            if (savedProducts) products = JSON.parse(savedProducts);
            var savedReviews = localStorage.getItem('adminReviews');
            if (savedReviews) reviews = JSON.parse(savedReviews);
            var savedReports = localStorage.getItem('adminReports');
            if (savedReports) reports = JSON.parse(savedReports);
            var savedNotifs = localStorage.getItem('adminNotifications');
            if (savedNotifs) notifications = JSON.parse(savedNotifs);
        } catch(e) {}
    }

    function getDefaultUsers() {
        return [
            { id: 1, name: 'Chioma Okafor', type: 'Buyer', location: 'Lagos', joined: '2026-01-15', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop' },
            { id: 2, name: 'Ade Farms', type: 'Farmer', location: 'Ibadan', joined: '2026-02-20', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop' },
            { id: 3, name: 'FarmExpress Logistics', type: 'Logistics', location: 'Lagos', joined: '2026-03-01', status: 'Active', avatar: 'https://images.unsplash.com/photo-1577412647305-9918a0b5f0b8?w=50&h=50&fit=crop' },
            { id: 4, name: 'Zaria Grains', type: 'Farmer', location: 'Kaduna', joined: '2026-03-15', status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=50&h=50&fit=crop' }
        ];
    }

    function getDefaultProducts() {
        return [
            { id: 1, name: '50kg Bag of Rice', farmer: 'Ade Farms', category: 'Grains', location: 'Ibadan', status: 'Active', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=50&h=50&fit=crop' },
            { id: 2, name: 'Organic Maize (100kg)', farmer: 'Zaria Grains', category: 'Grains', location: 'Kaduna', status: 'Active', image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=50&h=50&fit=crop' },
            { id: 3, name: 'Fresh Tomatoes (crate)', farmer: 'GreenHarvest', category: 'Vegetables', location: 'Lagos', status: 'Hidden', image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=50&h=50&fit=crop' }
        ];
    }

    function getDefaultReviews() {
        return [
            { id: 1, reviewer: 'Chioma Okafor', recipient: 'Ade Farms', rating: 5, text: 'Excellent quality rice!', date: '2026-03-15' },
            { id: 2, reviewer: 'Emeka Nwachukwu', recipient: 'FarmExpress Logistics', rating: 4, text: 'Reliable service.', date: '2026-03-10' }
        ];
    }

    function getDefaultReports() {
        return [
            { id: 1, type: 'Product', item: '50kg Bag of Rice', submittedBy: 'Chioma Okafor', date: '2026-03-20', status: 'Pending' },
            { id: 2, type: 'Farmer', item: 'Ade Farms', submittedBy: 'Emeka Nwachukwu', date: '2026-03-18', status: 'Resolved' }
        ];
    }

    function getDefaultNotifications() {
        return [
            { id: 1, title: 'New User Registration', message: 'A new farmer has registered: Ade Farms', time: '2 hours ago', read: false, link: 'users' },
            { id: 2, title: 'Product Reported', message: 'A product has been reported: 50kg Bag of Rice', time: '5 hours ago', read: false, link: 'reports' },
            { id: 3, title: 'Report Resolved', message: 'Report #2 has been resolved.', time: '1 day ago', read: true, link: 'reports' }
        ];
    }

    // =============================================================
    // SAVE TO LOCALSTORAGE
    // =============================================================
    function saveAdminData() {
        try {
            localStorage.setItem('adminUsers', JSON.stringify(users));
            localStorage.setItem('adminProducts', JSON.stringify(products));
            localStorage.setItem('adminReviews', JSON.stringify(reviews));
            localStorage.setItem('adminReports', JSON.stringify(reports));
            localStorage.setItem('adminNotifications', JSON.stringify(notifications));
        } catch(e) {}
    }

    // =============================================================
    // TOAST SYSTEM
    // =============================================================
    function showAdminToast(title, message, type) {
        type = type || 'success';
        if (!toastContainer) return;

        var toast = document.createElement('div');
        toast.className = 'admin-toast admin-toast-' + type;
        var icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
        toast.innerHTML = '<div class="admin-toast-icon"><i class="fas ' + (icons[type] || icons.success) + '"></i></div><div class="admin-toast-content"><div class="admin-toast-title">' + title + '</div><div class="admin-toast-message">' + message + '</div></div><button class="admin-toast-close">&times;</button>';
        var closeBtn = toast.querySelector('.admin-toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() { toast.remove(); });
        }
        toastContainer.appendChild(toast);
        setTimeout(function() {
            if (toast.parentNode) toast.remove();
        }, 5000);
    }

    // =============================================================
    // MODAL SYSTEM
    // =============================================================
    function openAdminModal(title, message, fields, confirmText, cancelText, confirmCallback) {
        fields = fields || '';
        confirmText = confirmText || 'Confirm';
        cancelText = cancelText || 'Cancel';
        if (!modal) return;

        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        if (modalFields) modalFields.innerHTML = fields;
        if (modalConfirm) modalConfirm.textContent = confirmText;
        if (modalCancel) modalCancel.textContent = cancelText;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal._confirmCallback = confirmCallback || null;
    }

    function closeAdminModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalFields) modalFields.innerHTML = '';
        modal._confirmCallback = null;
    }

    // =============================================================
    // NAVIGATION
    // =============================================================
    function navigateToAdminSection(section) {
        var links = document.querySelectorAll('.admin-sidebar-link[data-section]');
        for (var i = 0; i < links.length; i++) {
            var l = links[i];
            if (l.dataset.section === section) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        }

        var sections = document.querySelectorAll('.admin-section');
        for (var j = 0; j < sections.length; j++) {
            var s = sections[j];
            if (s.id === 'admin-section-' + section) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        }

        var titles = {
            overview: 'Overview',
            users: 'Manage Users',
            products: 'Product Listings',
            reviews: 'Reviews Management',
            reports: 'Reports Center',
            notifications: 'Notifications',
            settings: 'Settings'
        };
        var titleEl = document.getElementById('adminPageTitle');
        if (titleEl) titleEl.textContent = titles[section] || 'Dashboard';

        currentSection = section;

        if (section === 'overview') updateAdminOverview();
        if (section === 'users') renderAdminUsers();
        if (section === 'products') renderAdminProducts();
        if (section === 'reviews') renderAdminReviews();
        if (section === 'reports') renderAdminReports();
        if (section === 'notifications') renderAdminNotifications();
    }

    // =============================================================
    // USERS
    // =============================================================
    function renderAdminUsers() {
        if (!usersBody) return;

        var search = userSearch ? userSearch.value.toLowerCase() : '';
        var type = userTypeFilter ? userTypeFilter.value : '';
        var status = userStatusFilter ? userStatusFilter.value : '';

        var filtered = [];
        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            var matchSearch = u.name.toLowerCase().indexOf(search) !== -1;
            var matchType = !type || u.type === type;
            var matchStatus = !status || u.status === status;
            if (matchSearch && matchType && matchStatus) {
                filtered.push(u);
            }
        }

        if (filtered.length === 0) {
            usersBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--admin-text-secondary);">No users found.</td></tr>';
            return;
        }

        var html = '';
        for (var j = 0; j < filtered.length; j++) {
            var u = filtered[j];
            var statusBadge = u.status === 'Active' ? 'admin-badge-success' : 'admin-badge-danger';
            var avatar = u.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.name) + '&background=2D7D3A&color=fff&size=50';
            html += '<tr><td><div class="admin-table-avatar" style="background-image:url(\'' + avatar + '\');"></div></td><td>' + u.name + '</td><td>' + u.type + '</td><td>' + u.location + '</td><td>' + u.joined + '</td><td><span class="admin-badge ' + statusBadge + '">' + u.status + '</span></td><td><button class="admin-action-btn" data-action="view-user" data-id="' + u.id + '">👁</button>' + (u.status === 'Active' ? '<button class="admin-action-btn" data-action="suspend-user" data-id="' + u.id + '">⛔</button>' : '<button class="admin-action-btn" data-action="activate-user" data-id="' + u.id + '">✅</button>') + '</td></tr>';
        }
        usersBody.innerHTML = html;

        // Event delegation for user actions
        usersBody.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            var user = null;
            for (var m = 0; m < users.length; m++) {
                if (users[m].id === id) { user = users[m]; break; }
            }
            if (!user) return;

            if (action === 'view-user') {
                var fields = '<p><strong>Name:</strong> ' + user.name + '</p><p><strong>Type:</strong> ' + user.type + '</p><p><strong>Location:</strong> ' + user.location + '</p><p><strong>Joined:</strong> ' + user.joined + '</p><p><strong>Status:</strong> ' + user.status + '</p>';
                openAdminModal('User Details', '', fields, 'Close', '');
                modalCancel.style.display = 'none';
                modalConfirm.textContent = 'Close';
                modal._confirmCallback = closeAdminModal;
                setTimeout(function() { modalCancel.style.display = ''; modalConfirm.textContent = 'Confirm'; }, 100);
            } else if (action === 'suspend-user') {
                openAdminModal('Suspend User', 'Are you sure you want to suspend ' + user.name + '?', '', 'Suspend', 'Cancel', function() {
                    user.status = 'Suspended';
                    saveAdminData();
                    renderAdminUsers();
                    updateAdminOverview();
                    closeAdminModal();
                    showAdminToast('Suspended', user.name + ' has been suspended.', 'success');
                });
            } else if (action === 'activate-user') {
                openAdminModal('Activate User', 'Are you sure you want to activate ' + user.name + '?', '', 'Activate', 'Cancel', function() {
                    user.status = 'Active';
                    saveAdminData();
                    renderAdminUsers();
                    updateAdminOverview();
                    closeAdminModal();
                    showAdminToast('Activated', user.name + ' has been activated.', 'success');
                });
            }
        });

        updateUserStats();
    }

    function updateUserStats() {
        var buyers = 0, farmers = 0, logistics = 0;
        for (var i = 0; i < users.length; i++) {
            if (users[i].type === 'Buyer') buyers++;
            else if (users[i].type === 'Farmer') farmers++;
            else if (users[i].type === 'Logistics') logistics++;
        }
        if (buyersCount) buyersCount.textContent = buyers;
        if (farmersCount) farmersCount.textContent = farmers;
        if (logisticsCount) logisticsCount.textContent = logistics;
    }

    if (userSearch) userSearch.addEventListener('input', renderAdminUsers);
    if (userTypeFilter) userTypeFilter.addEventListener('change', renderAdminUsers);
    if (userStatusFilter) userStatusFilter.addEventListener('change', renderAdminUsers);

    // =============================================================
    // PRODUCTS
    // =============================================================
    function renderAdminProducts() {
        if (!productsBody) return;

        var search = productSearch ? productSearch.value.toLowerCase() : '';
        var status = productStatusFilter ? productStatusFilter.value : '';

        var filtered = [];
        for (var i = 0; i < products.length; i++) {
            var p = products[i];
            var matchSearch = p.name.toLowerCase().indexOf(search) !== -1 || p.farmer.toLowerCase().indexOf(search) !== -1;
            var matchStatus = !status || p.status === status;
            if (matchSearch && matchStatus) {
                filtered.push(p);
            }
        }

        if (filtered.length === 0) {
            productsBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--admin-text-secondary);">No products found.</td></tr>';
            return;
        }

        var html = '';
        for (var j = 0; j < filtered.length; j++) {
            var p = filtered[j];
            var statusBadge = p.status === 'Active' ? 'admin-badge-success' : 'admin-badge-warning';
            var image = p.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(p.name) + '&background=2D7D3A&color=fff&size=50';
            html += '<tr><td><div class="admin-table-avatar" style="background-image:url(\'' + image + '\');"></div></td><td>' + p.name + '</td><td>' + p.farmer + '</td><td>' + p.category + '</td><td>' + p.location + '</td><td><span class="admin-badge ' + statusBadge + '">' + p.status + '</span></td><td><button class="admin-action-btn" data-action="view-product" data-id="' + p.id + '">👁</button>' + (p.status === 'Active' ? '<button class="admin-action-btn" data-action="hide-product" data-id="' + p.id + '">🙈</button>' : '<button class="admin-action-btn" data-action="restore-product" data-id="' + p.id + '">✅</button>') + '</td></tr>';
        }
        productsBody.innerHTML = html;

        productsBody.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            var product = null;
            for (var m = 0; m < products.length; m++) {
                if (products[m].id === id) { product = products[m]; break; }
            }
            if (!product) return;

            if (action === 'view-product') {
                var fields = '<p><strong>Name:</strong> ' + product.name + '</p><p><strong>Farmer:</strong> ' + product.farmer + '</p><p><strong>Category:</strong> ' + product.category + '</p><p><strong>Location:</strong> ' + product.location + '</p><p><strong>Status:</strong> ' + product.status + '</p>';
                openAdminModal('Product Details', '', fields, 'Close', '');
                modalCancel.style.display = 'none';
                modalConfirm.textContent = 'Close';
                modal._confirmCallback = closeAdminModal;
                setTimeout(function() { modalCancel.style.display = ''; modalConfirm.textContent = 'Confirm'; }, 100);
            } else if (action === 'hide-product') {
                openAdminModal('Hide Product', 'Are you sure you want to hide ' + product.name + '?', '', 'Hide', 'Cancel', function() {
                    product.status = 'Hidden';
                    saveAdminData();
                    renderAdminProducts();
                    updateAdminOverview();
                    closeAdminModal();
                    showAdminToast('Hidden', product.name + ' has been hidden.', 'success');
                });
            } else if (action === 'restore-product') {
                openAdminModal('Restore Product', 'Are you sure you want to restore ' + product.name + '?', '', 'Restore', 'Cancel', function() {
                    product.status = 'Active';
                    saveAdminData();
                    renderAdminProducts();
                    updateAdminOverview();
                    closeAdminModal();
                    showAdminToast('Restored', product.name + ' has been restored.', 'success');
                });
            }
        });

        if (productsCount) productsCount.textContent = products.length;
    }

    if (productSearch) productSearch.addEventListener('input', renderAdminProducts);
    if (productStatusFilter) productStatusFilter.addEventListener('change', renderAdminProducts);

    // =============================================================
    // REVIEWS
    // =============================================================
    function renderAdminReviews() {
        if (!reviewsBody) return;

        var search = reviewSearch ? reviewSearch.value.toLowerCase() : '';
        var rating = reviewRatingFilter ? reviewRatingFilter.value : '';

        var filtered = [];
        for (var i = 0; i < reviews.length; i++) {
            var r = reviews[i];
            var matchSearch = r.reviewer.toLowerCase().indexOf(search) !== -1 || r.recipient.toLowerCase().indexOf(search) !== -1;
            var matchRating = !rating || r.rating === parseInt(rating);
            if (matchSearch && matchRating) {
                filtered.push(r);
            }
        }

        if (filtered.length === 0) {
            reviewsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--admin-text-secondary);">No reviews found.</td></tr>';
            return;
        }

        var html = '';
        for (var j = 0; j < filtered.length; j++) {
            var r = filtered[j];
            var stars = '';
            for (var s = 0; s < r.rating; s++) stars += '⭐';
            for (var s = r.rating; s < 5; s++) stars += '☆';
            html += '<tr><td>' + r.reviewer + '</td><td>' + r.recipient + '</td><td>' + stars + '</td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + r.text + '</td><td>' + r.date + '</td><td><button class="admin-action-btn" data-action="view-review" data-id="' + r.id + '">👁</button><button class="admin-action-btn" data-action="delete-review" data-id="' + r.id + '" style="color:#EF4444;">🗑️</button></td></tr>';
        }
        reviewsBody.innerHTML = html;

        reviewsBody.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            var review = null;
            for (var m = 0; m < reviews.length; m++) {
                if (reviews[m].id === id) { review = reviews[m]; break; }
            }
            if (!review) return;

            if (action === 'view-review') {
                var stars = '';
                for (var s = 0; s < review.rating; s++) stars += '⭐';
                for (var s = review.rating; s < 5; s++) stars += '☆';
                var fields = '<p><strong>Reviewer:</strong> ' + review.reviewer + '</p><p><strong>Recipient:</strong> ' + review.recipient + '</p><p><strong>Rating:</strong> ' + stars + '</p><p><strong>Review:</strong> "' + review.text + '"</p><p><strong>Date:</strong> ' + review.date + '</p>';
                openAdminModal('Review Details', '', fields, 'Close', '');
                modalCancel.style.display = 'none';
                modalConfirm.textContent = 'Close';
                modal._confirmCallback = closeAdminModal;
                setTimeout(function() { modalCancel.style.display = ''; modalConfirm.textContent = 'Confirm'; }, 100);
            } else if (action === 'delete-review') {
                openAdminModal('Delete Review', 'Are you sure you want to delete this review?', '', 'Delete', 'Cancel', function() {
                    var newReviews = [];
                    for (var m = 0; m < reviews.length; m++) {
                        if (reviews[m].id !== id) newReviews.push(reviews[m]);
                    }
                    reviews = newReviews;
                    saveAdminData();
                    renderAdminReviews();
                    updateAdminOverview();
                    closeAdminModal();
                    showAdminToast('Deleted', 'Review has been deleted.', 'success');
                });
            }
        });

        if (reviewsCount) reviewsCount.textContent = reviews.length;
    }

    if (reviewSearch) reviewSearch.addEventListener('input', renderAdminReviews);
    if (reviewRatingFilter) reviewRatingFilter.addEventListener('change', renderAdminReviews);

    // =============================================================
    // REPORTS
    // =============================================================
    function renderAdminReports() {
        if (!reportsBody) return;

        var search = reportSearch ? reportSearch.value.toLowerCase() : '';
        var status = reportStatusFilter ? reportStatusFilter.value : '';

        var filtered = [];
        for (var i = 0; i < reports.length; i++) {
            var r = reports[i];
            var matchSearch = r.item.toLowerCase().indexOf(search) !== -1 || r.submittedBy.toLowerCase().indexOf(search) !== -1;
            var matchStatus = !status || r.status === status;
            if (matchSearch && matchStatus) {
                filtered.push(r);
            }
        }

        if (filtered.length === 0) {
            reportsBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--admin-text-secondary);">No reports found.</td></tr>';
            return;
        }

        var html = '';
        for (var j = 0; j < filtered.length; j++) {
            var r = filtered[j];
            var statusBadge = r.status === 'Pending' ? 'admin-badge-warning' : 'admin-badge-success';
            html += '<tr><td>#' + r.id + '</td><td>' + r.type + '</td><td>' + r.item + '</td><td>' + r.submittedBy + '</td><td>' + r.date + '</td><td><span class="admin-badge ' + statusBadge + '">' + r.status + '</span></td><td><button class="admin-action-btn" data-action="view-report" data-id="' + r.id + '">👁</button>' + (r.status === 'Pending' ? '<button class="admin-action-btn" data-action="resolve-report" data-id="' + r.id + '">✅</button>' : '') + '<button class="admin-action-btn" data-action="delete-report" data-id="' + r.id + '" style="color:#EF4444;">🗑️</button></td></tr>';
        }
        reportsBody.innerHTML = html;

        reportsBody.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var action = btn.dataset.action;
            var id = parseInt(btn.dataset.id);

            var report = null;
            for (var m = 0; m < reports.length; m++) {
                if (reports[m].id === id) { report = reports[m]; break; }
            }
            if (!report) return;

            if (action === 'view-report') {
                var fields = '<p><strong>Type:</strong> ' + report.type + '</p><p><strong>Reported Item:</strong> ' + report.item + '</p><p><strong>Submitted By:</strong> ' + report.submittedBy + '</p><p><strong>Date:</strong> ' + report.date + '</p><p><strong>Status:</strong> ' + report.status + '</p>';
                openAdminModal('Report Details', '', fields, 'Close', '');
                modalCancel.style.display = 'none';
                modalConfirm.textContent = 'Close';
                modal._confirmCallback = closeAdminModal;
                setTimeout(function() { modalCancel.style.display = ''; modalConfirm.textContent = 'Confirm'; }, 100);
            } else if (action === 'resolve-report') {
                openAdminModal('Resolve Report', 'Mark this report as resolved?', '', 'Resolve', 'Cancel', function() {
                    report.status = 'Resolved';
                    saveAdminData();
                    renderAdminReports();
                    updateAdminOverview();
                    closeAdminModal();
                    showAdminToast('Resolved', 'Report has been resolved.', 'success');
                });
            } else if (action === 'delete-report') {
                openAdminModal('Delete Report', 'Are you sure you want to delete this report?', '', 'Delete', 'Cancel', function() {
                    var newReports = [];
                    for (var m = 0; m < reports.length; m++) {
                        if (reports[m].id !== id) newReports.push(reports[m]);
                    }
                    reports = newReports;
                    saveAdminData();
                    renderAdminReports();
                    updateAdminOverview();
                    closeAdminModal();
                    showAdminToast('Deleted', 'Report has been deleted.', 'success');
                });
            }
        });

        if (reportsCount) reportsCount.textContent = reports.length;
    }

    if (reportSearch) reportSearch.addEventListener('input', renderAdminReports);
    if (reportStatusFilter) reportStatusFilter.addEventListener('change', renderAdminReports);

    // =============================================================
    // NOTIFICATIONS
    // =============================================================
    function renderAdminNotifications() {
        if (!notificationsList) return;

        var unreadCount = 0;
        for (var i = 0; i < notifications.length; i++) {
            if (!notifications[i].read) unreadCount++;
        }
        if (notificationDot) {
            notificationDot.style.display = unreadCount > 0 ? 'block' : 'none';
        }

        if (notifications.length === 0) {
            notificationsList.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--admin-text-secondary);"><i class="fas fa-bell-slash" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#9CA3AF;"></i><p>No notifications</p></div>';
            return;
        }

        var html = '';
        for (var j = 0; j < notifications.length; j++) {
            var n = notifications[j];
            html += '<div class="admin-notification-item ' + (n.read ? '' : 'unread') + '" data-id="' + n.id + '" data-link="' + n.link + '"><div class="admin-notification-content"><div class="admin-notification-title">' + n.title + '</div><div class="admin-notification-message">' + n.message + '</div><span class="admin-notification-time">' + n.time + '</span></div><div class="admin-notification-actions"><button class="admin-btn admin-btn-sm admin-btn-outline" data-action="mark-read" data-id="' + n.id + '">' + (n.read ? 'Read' : 'Mark Read') + '</button><button class="admin-btn admin-btn-sm admin-btn-outline" data-action="delete-notification" data-id="' + n.id + '" style="color:#EF4444;border-color:#EF4444;">Delete</button></div></div>';
        }
        notificationsList.innerHTML = html;

        notificationsList.addEventListener('click', function(e) {
            var target = e.target;
            var item = target.closest('.admin-notification-item');
            if (!item) return;

            var btn = target.closest('button');
            if (btn) {
                var action = btn.dataset.action;
                var id = parseInt(btn.dataset.id);
                if (action === 'mark-read') {
                    var notif = null;
                    for (var m = 0; m < notifications.length; m++) {
                        if (notifications[m].id === id) { notif = notifications[m]; break; }
                    }
                    if (notif) {
                        notif.read = true;
                        saveAdminData();
                        renderAdminNotifications();
                    }
                    return;
                } else if (action === 'delete-notification') {
                    var notif = null;
                    for (var m = 0; m < notifications.length; m++) {
                        if (notifications[m].id === id) { notif = notifications[m]; break; }
                    }
                    if (notif) {
                        openAdminModal('Delete Notification', 'Are you sure you want to delete this notification?', '', 'Delete', 'Cancel', function() {
                            var newNotifs = [];
                            for (var m = 0; m < notifications.length; m++) {
                                if (notifications[m].id !== id) newNotifs.push(notifications[m]);
                            }
                            notifications = newNotifs;
                            saveAdminData();
                            renderAdminNotifications();
                            closeAdminModal();
                            showAdminToast('Deleted', 'Notification deleted.', 'success');
                        });
                    }
                    return;
                }
            }

            var link = item.dataset.link;
            var id = parseInt(item.dataset.id);
            var notif = null;
            for (var m = 0; m < notifications.length; m++) {
                if (notifications[m].id === id) { notif = notifications[m]; break; }
            }
            if (notif && !notif.read) {
                notif.read = true;
                saveAdminData();
                renderAdminNotifications();
            }
            if (link) {
                navigateToAdminSection(link);
            }
        });
    }

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            for (var k = 0; k < notifications.length; k++) {
                notifications[k].read = true;
            }
            saveAdminData();
            renderAdminNotifications();
            showAdminToast('Updated', 'All notifications marked as read.', 'success');
        });
    }

    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            navigateToAdminSection('notifications');
        });
    }

    // =============================================================
    // OVERVIEW
    // =============================================================
    function updateAdminOverview() {
        updateUserStats();
        if (productsCount) productsCount.textContent = products.length;
        if (reviewsCount) reviewsCount.textContent = reviews.length;
        if (reportsCount) reportsCount.textContent = reports.length;
    }

    // =============================================================
    // SETTINGS
    // =============================================================
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            var newPass = document.getElementById('adminSettingsNewPassword') ? document.getElementById('adminSettingsNewPassword').value : '';
            var confirmPass = document.getElementById('adminSettingsConfirmPassword') ? document.getElementById('adminSettingsConfirmPassword').value : '';

            if (!newPass || !confirmPass) {
                showAdminToast('Error', 'Please fill in both password fields.', 'error');
                return;
            }
            if (newPass !== confirmPass) {
                showAdminToast('Error', 'Passwords do not match.', 'error');
                return;
            }
            if (newPass.length < 6) {
                showAdminToast('Error', 'Password must be at least 6 characters.', 'error');
                return;
            }

            showAdminToast('Success', 'Password updated successfully!', 'success');
            if (document.getElementById('adminSettingsNewPassword')) document.getElementById('adminSettingsNewPassword').value = '';
            if (document.getElementById('adminSettingsConfirmPassword')) document.getElementById('adminSettingsConfirmPassword').value = '';
        });
    }

    // =============================================================
    // SETUP EVENT LISTENERS
    // =============================================================
    function setupAdminEventListeners() {
        // Sidebar collapse
        if (sidebarCollapse) {
            sidebarCollapse.addEventListener('click', function() {
                isSidebarCollapsed = !isSidebarCollapsed;
                if (sidebar) sidebar.classList.toggle('collapsed', isSidebarCollapsed);
                try {
                    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
                } catch(e) {}
            });
        }

        try {
            var savedCollapse = localStorage.getItem('adminSidebarCollapsed');
            if (savedCollapse === 'true') {
                isSidebarCollapsed = true;
                if (sidebar) sidebar.classList.add('collapsed');
            }
        } catch(e) {}

        // Mobile menu with overlay
        if (navbarToggle && sidebar) {
            navbarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
                if (overlay) overlay.classList.toggle('active');
                var icon = this.querySelector('i');
                if (icon) {
                    if (sidebar.classList.contains('mobile-open')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', function() {
                if (sidebar) sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                var icon = navbarToggle ? navbarToggle.querySelector('i') : null;
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }

        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                if (sidebar && navbarToggle && !sidebar.contains(e.target) && !navbarToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                    if (overlay) overlay.classList.remove('active');
                    var icon = navbarToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });

        // Sidebar links
        var sidebarLinks = document.querySelectorAll('.admin-sidebar-link[data-section]');
        for (var i = 0; i < sidebarLinks.length; i++) {
            (function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    var section = this.dataset.section;
                    navigateToAdminSection(section);
                    if (window.innerWidth <= 992) {
                        if (sidebar) sidebar.classList.remove('mobile-open');
                        if (overlay) overlay.classList.remove('active');
                        var icon = navbarToggle ? navbarToggle.querySelector('i') : null;
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                });
            })(sidebarLinks[i]);
        }

        // Dark mode
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                isDarkMode = !isDarkMode;
                document.body.classList.toggle('admin-dark-mode', isDarkMode);
                var icon = this.querySelector('i');
                if (icon) {
                    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
                }
                try {
                    localStorage.setItem('adminDarkMode', JSON.stringify(isDarkMode));
                } catch(e) {}
                if (settingsDarkMode) settingsDarkMode.checked = isDarkMode;
            });
        }

        try {
            var savedDarkMode = localStorage.getItem('adminDarkMode');
            if (savedDarkMode === 'true') {
                isDarkMode = true;
                document.body.classList.add('admin-dark-mode');
                if (darkModeToggle) {
                    var icon = darkModeToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-sun';
                }
                if (settingsDarkMode) settingsDarkMode.checked = true;
            }
        } catch(e) {}

        if (settingsDarkMode) {
            settingsDarkMode.addEventListener('change', function() {
                if (darkModeToggle) darkModeToggle.click();
            });
        }

        // Modal close
        if (modalClose) {
            modalClose.addEventListener('click', closeAdminModal);
        }
        if (modalCancel) {
            modalCancel.addEventListener('click', closeAdminModal);
        }
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeAdminModal();
            });
        }
        if (modalConfirm) {
            modalConfirm.addEventListener('click', function() {
                if (modal._confirmCallback) {
                    modal._confirmCallback();
                } else {
                    closeAdminModal();
                }
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeAdminModal();
            }
        });

        // Quick actions
        var actionBtns = document.querySelectorAll('[data-action="users"], [data-action="reports"], [data-action="products"]');
        for (var m = 0; m < actionBtns.length; m++) {
            (function(btn) {
                btn.addEventListener('click', function() {
                    var action = this.dataset.action;
                    if (action === 'users') navigateToAdminSection('users');
                    else if (action === 'reports') navigateToAdminSection('reports');
                    else if (action === 'products') navigateToAdminSection('products');
                });
            })(actionBtns[m]);
        }

        // Profile dropdown
        var profileDropdown = document.getElementById('adminProfileDropdown');
        var profileTrigger = document.querySelector('.admin-profile-trigger');

        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            document.addEventListener('click', function(e) {
                if (profileDropdown && !profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }

        var profileMenuItems = document.querySelectorAll('.admin-profile-menu-item');
        for (var n = 0; n < profileMenuItems.length; n++) {
            (function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    var action = this.dataset.action;
                    if (profileDropdown) profileDropdown.classList.remove('active');
                    if (action === 'settings') navigateToAdminSection('settings');
                    else if (action === 'logout') {
                        openAdminModal('Logout', 'Are you sure you want to logout?', '', 'Logout', 'Cancel', function() {
                            closeAdminModal();
                            showAdminToast('Info', 'Logging out...', 'info');
                            setTimeout(function() { window.location.href = 'login.html'; }, 1000);
                        });
                    }
                });
            })(profileMenuItems[n]);
        }

        // Logout
        var logoutLink = document.querySelector('.admin-sidebar-logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                openAdminModal('Logout', 'Are you sure you want to logout?', '', 'Logout', 'Cancel', function() {
                    closeAdminModal();
                    showAdminToast('Info', 'Logging out...', 'info');
                    setTimeout(function() { window.location.href = 'login.html'; }, 1000);
                });
            });
        }

        // Global search
        var globalSearch = document.getElementById('adminGlobalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    var term = this.value.toLowerCase();
                    var sections = ['users', 'products', 'reviews', 'reports'];
                    var found = false;
                    for (var p = 0; p < sections.length; p++) {
                        var el = document.getElementById('admin-section-' + sections[p]);
                        if (el) {
                            var text = el.textContent.toLowerCase();
                            if (text.indexOf(term) !== -1) {
                                navigateToAdminSection(sections[p]);
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        showAdminToast('Info', 'No results found for "' + this.value + '"', 'info');
                    }
                }
            });
        }
    }

    // =============================================================
    // INITIALIZE
    // =============================================================
    function initAdminDashboard() {
        console.log('🔐 Initializing Admin Dashboard...');

        initAdminData();
        setupAdminEventListeners();

        // Initial render
        renderAdminUsers();
        renderAdminProducts();
        renderAdminReviews();
        renderAdminReports();
        renderAdminNotifications();
        updateAdminOverview();

        // Set default active section
        navigateToAdminSection('overview');

        setTimeout(function() {
            showAdminToast('Welcome back!', 'Admin, FarmConnect is running smoothly. 🌱', 'success');
        }, 800);

        console.log('✅ Admin Dashboard initialized successfully');
        console.log('📊 Stats:', {
            users: users.length,
            products: products.length,
            reviews: reviews.length,
            reports: reports.length,
            notifications: notifications.length
        });
    }

    // =============================================================
    // START
    // =============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminDashboard);
    } else {
        initAdminDashboard();
    }

})();


// ============================================================
// SAVE PRODUCT FUNCTIONALITY
// ============================================================

(function() {
    'use strict';

    // Get all save buttons on the page
    var saveButtons = document.querySelectorAll('.home-featured-save-btn');

    // Load saved products from localStorage
    var savedProducts = [];
    try {
        var saved = localStorage.getItem('homeSavedProducts');
        if (saved) {
            savedProducts = JSON.parse(saved);
        }
    } catch(e) {}

    // Update button states based on saved products
    function updateSaveButtons() {
        saveButtons.forEach(function(btn) {
            var productId = parseInt(btn.dataset.productId);
            if (savedProducts.indexOf(productId) !== -1) {
                btn.classList.add('saved');
                btn.querySelector('i').classList.remove('far');
                btn.querySelector('i').classList.add('fas');
            } else {
                btn.classList.remove('saved');
                btn.querySelector('i').classList.remove('fas');
                btn.querySelector('i').classList.add('far');
            }
        });
    }

    // Save product to localStorage
    function saveProduct(productId) {
        if (savedProducts.indexOf(productId) === -1) {
            savedProducts.push(productId);
            try {
                localStorage.setItem('homeSavedProducts', JSON.stringify(savedProducts));
            } catch(e) {}
            return true;
        }
        return false;
    }

    // Remove product from localStorage
    function unsaveProduct(productId) {
        var index = savedProducts.indexOf(productId);
        if (index !== -1) {
            savedProducts.splice(index, 1);
            try {
                localStorage.setItem('homeSavedProducts', JSON.stringify(savedProducts));
            } catch(e) {}
            return true;
        }
        return false;
    }

    // Toggle save state
    function toggleSave(btn) {
        var productId = parseInt(btn.dataset.productId);
        var isSaved = btn.classList.contains('saved');

        if (isSaved) {
            unsaveProduct(productId);
            btn.classList.remove('saved');
            btn.querySelector('i').classList.remove('fas');
            btn.querySelector('i').classList.add('far');
            console.log('💔 Product removed from saved:', productId);
        } else {
            saveProduct(productId);
            btn.classList.add('saved');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
            console.log('❤️ Product saved:', productId);
        }
    }

    // Add click event listeners to all save buttons
    saveButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleSave(this);
        });
    });

    // Update button states on page load
    updateSaveButtons();

    console.log('💾 Save product functionality initialized');
    console.log('📦 Saved products:', savedProducts);

})();

// ============================================================
// SAVE PRODUCT FUNCTIONALITY - MARKETPLACE
// ============================================================

(function() {
    'use strict';

    // Get all save buttons on the page
    var saveButtons = document.querySelectorAll('.marketplace-save-btn');

    // Load saved products from localStorage (using same key as home)
    var savedProducts = [];
    try {
        var saved = localStorage.getItem('homeSavedProducts');
        if (saved) {
            savedProducts = JSON.parse(saved);
        }
    } catch(e) {}

    // Update button states based on saved products
    function updateSaveButtons() {
        saveButtons.forEach(function(btn) {
            var productId = parseInt(btn.dataset.productId);
            if (savedProducts.indexOf(productId) !== -1) {
                btn.classList.add('saved');
                btn.querySelector('i').classList.remove('far');
                btn.querySelector('i').classList.add('fas');
            } else {
                btn.classList.remove('saved');
                btn.querySelector('i').classList.remove('fas');
                btn.querySelector('i').classList.add('far');
            }
        });
    }

    // Save product to localStorage
    function saveProduct(productId) {
        if (savedProducts.indexOf(productId) === -1) {
            savedProducts.push(productId);
            try {
                localStorage.setItem('homeSavedProducts', JSON.stringify(savedProducts));
            } catch(e) {}
            return true;
        }
        return false;
    }

    // Remove product from localStorage
    function unsaveProduct(productId) {
        var index = savedProducts.indexOf(productId);
        if (index !== -1) {
            savedProducts.splice(index, 1);
            try {
                localStorage.setItem('homeSavedProducts', JSON.stringify(savedProducts));
            } catch(e) {}
            return true;
        }
        return false;
    }

    // Toggle save state
    function toggleSave(btn) {
        var productId = parseInt(btn.dataset.productId);
        var isSaved = btn.classList.contains('saved');

        if (isSaved) {
            unsaveProduct(productId);
            btn.classList.remove('saved');
            btn.querySelector('i').classList.remove('fas');
            btn.querySelector('i').classList.add('far');
            console.log('💔 Product removed from saved:', productId);
        } else {
            saveProduct(productId);
            btn.classList.add('saved');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
            console.log('❤️ Product saved:', productId);
        }
    }

    // Add click event listeners to all save buttons
    saveButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleSave(this);
        });
    });

    // Update button states on page load
    updateSaveButtons();

    console.log('💾 Marketplace save functionality initialized');

})();

// ============================================================
// SAVE PRODUCT FUNCTIONALITY - SIMILAR PRODUCTS
// ============================================================

(function() {
    'use strict';

    // Get all save buttons on the page
    var saveButtons = document.querySelectorAll('.detail-similar-save-btn');

    // Load saved products from localStorage (using same key as home and marketplace)
    var savedProducts = [];
    try {
        var saved = localStorage.getItem('homeSavedProducts');
        if (saved) {
            savedProducts = JSON.parse(saved);
        }
    } catch(e) {}

    // Update button states based on saved products
    function updateSaveButtons() {
        saveButtons.forEach(function(btn) {
            var productId = parseInt(btn.dataset.productId);
            if (savedProducts.indexOf(productId) !== -1) {
                btn.classList.add('saved');
                btn.querySelector('i').classList.remove('far');
                btn.querySelector('i').classList.add('fas');
            } else {
                btn.classList.remove('saved');
                btn.querySelector('i').classList.remove('fas');
                btn.querySelector('i').classList.add('far');
            }
        });
    }

    // Save product to localStorage
    function saveProduct(productId) {
        if (savedProducts.indexOf(productId) === -1) {
            savedProducts.push(productId);
            try {
                localStorage.setItem('homeSavedProducts', JSON.stringify(savedProducts));
            } catch(e) {}
            return true;
        }
        return false;
    }

    // Remove product from localStorage
    function unsaveProduct(productId) {
        var index = savedProducts.indexOf(productId);
        if (index !== -1) {
            savedProducts.splice(index, 1);
            try {
                localStorage.setItem('homeSavedProducts', JSON.stringify(savedProducts));
            } catch(e) {}
            return true;
        }
        return false;
    }

    // Toggle save state
    function toggleSave(btn) {
        var productId = parseInt(btn.dataset.productId);
        var isSaved = btn.classList.contains('saved');

        if (isSaved) {
            unsaveProduct(productId);
            btn.classList.remove('saved');
            btn.querySelector('i').classList.remove('fas');
            btn.querySelector('i').classList.add('far');
            console.log('💔 Product removed from saved:', productId);
        } else {
            saveProduct(productId);
            btn.classList.add('saved');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
            console.log('❤️ Product saved:', productId);
        }
    }

    // Add click event listeners to all save buttons
    saveButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleSave(this);
        });
    });

    // Update button states on page load
    updateSaveButtons();

    console.log('💾 Similar products save functionality initialized');

})();

// ============================================================
// PRODUCT DETAIL - SAVE BUTTON
// ============================================================

(function() {
    'use strict';

    var saveBtn = document.querySelector('.detail-product-save-btn');
    if (!saveBtn) return;

    var productId = parseInt(saveBtn.dataset.productId);

    // Check if backend provided saved state
    var isSavedFromBackend = saveBtn.dataset.isSaved === 'true';

    // Load saved products from localStorage (for frontend testing)
    var savedProducts = [];
    try {
        var saved = localStorage.getItem('homeSavedProducts');
        if (saved) {
            savedProducts = JSON.parse(saved);
        }
    } catch(e) {}

    // Determine initial state: backend takes priority, fallback to localStorage
    var isSaved = isSavedFromBackend || savedProducts.indexOf(productId) !== -1;

    // Update button state
    function updateButtonState() {
        if (isSaved) {
            saveBtn.classList.add('saved');
            saveBtn.querySelector('i').classList.remove('far');
            saveBtn.querySelector('i').classList.add('fas');
        } else {
            saveBtn.classList.remove('saved');
            saveBtn.querySelector('i').classList.remove('fas');
            saveBtn.querySelector('i').classList.add('far');
        }
    }

    // Toggle save
    function toggleSave() {
        isSaved = !isSaved;
        
        // Update UI
        if (isSaved) {
            saveBtn.classList.add('saved');
            saveBtn.querySelector('i').classList.remove('far');
            saveBtn.querySelector('i').classList.add('fas');
            // Save to localStorage
            if (savedProducts.indexOf(productId) === -1) {
                savedProducts.push(productId);
            }
            console.log('❤️ Product saved:', productId);
        } else {
            saveBtn.classList.remove('saved');
            saveBtn.querySelector('i').classList.remove('fas');
            saveBtn.querySelector('i').classList.add('far');
            // Remove from localStorage
            var index = savedProducts.indexOf(productId);
            if (index !== -1) {
                savedProducts.splice(index, 1);
            }
            console.log('💔 Product removed from saved:', productId);
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('homeSavedProducts', JSON.stringify(savedProducts));
        } catch(e) {}
        
        // If backend is connected, send AJAX request
        if (typeof sendSaveRequest === 'function') {
            sendSaveRequest(productId, isSaved ? 'save' : 'unsave');
        }
    }

    // Event listener
    saveBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        toggleSave();
    });

    // Initialize
    updateButtonState();

    console.log('💾 Product detail save button initialized');
    console.log('📦 Product ID:', productId);
    console.log('❤️ Saved:', isSaved);

})();

// ============================================================
// LOGISTICS PROFILE COMPLETION
// ============================================================

// Function to calculate and update profile completion
function updateLogisticsProfileCompletion() {
    // Get all the profile fields
    var companyName = document.getElementById('logisticsCompanyName');
    var serviceType = document.getElementById('logisticsServiceType');
    var location = document.getElementById('logisticsLocation');
    var description = document.getElementById('logisticsDescription');
    var whatsapp = document.getElementById('logisticsWhatsApp');
    var phone = document.getElementById('logisticsPhone');
    var coverage = document.getElementById('logisticsCoverage');
    var profileImage = document.getElementById('logisticsProfileImagePreview');

    // Check which fields have values
    var fields = [
        companyName ? companyName.value.trim() : '',
        serviceType ? serviceType.value.trim() : '',
        location ? location.value.trim() : '',
        description ? description.value.trim() : '',
        whatsapp ? whatsapp.value.trim() : '',
        phone ? phone.value.trim() : '',
        coverage ? coverage.value.trim() : ''
    ];

    // Check if image is uploaded
    var hasImage = profileImage ? profileImage.querySelector('img') !== null : false;

    var filledCount = 0;
    var totalFields = fields.length + 1; // +1 for image

    // Count filled text fields
    for (var i = 0; i < fields.length; i++) {
        if (fields[i] !== '') {
            filledCount++;
        }
    }

    // Count image if uploaded
    if (hasImage) {
        filledCount++;
    }

    // Calculate percentage
    var percent = Math.round((filledCount / totalFields) * 100);
    
    // Update the progress bar
    var fill = document.getElementById('logisticsCompletionFill');
    var percentText = document.getElementById('logisticsCompletionPercent');

    if (fill) {
        fill.style.width = percent + '%';
    }
    if (percentText) {
        percentText.textContent = percent + '%';
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only run on logistics dashboard
    if (!document.getElementById('logisticsSidebar')) {
        return;
    }
    
    updateLogisticsProfileCompletion();

    // Update on input changes
    var inputs = document.querySelectorAll('#logisticsCompanyName, #logisticsServiceType, #logisticsLocation, #logisticsDescription, #logisticsWhatsApp, #logisticsPhone, #logisticsCoverage');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', updateLogisticsProfileCompletion);
        inputs[i].addEventListener('change', updateLogisticsProfileCompletion);
    }

    // Update on image upload
    var imageInput = document.getElementById('logisticsProfileImageInput');
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            setTimeout(updateLogisticsProfileCompletion, 300);
        });
    }

    console.log('📊 Logistics profile completion initialized');
});

// ============================================================
// MARKETPLACE - READ CATEGORY FROM URL & FILTER
// ============================================================

(function() {
    'use strict';

    // Get URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    var category = urlParams.get('category');

    if (category) {
        console.log('🔍 Filtering by category:', category);
        
        // Wait for page to load
        setTimeout(function() {
            // Find the category filter dropdown
            var categoryFilter = document.getElementById('filterCategory');
            
            if (categoryFilter) {
                // Check if the category exists in the dropdown
                var categoryExists = false;
                for (var i = 0; i < categoryFilter.options.length; i++) {
                    if (categoryFilter.options[i].value === category) {
                        categoryExists = true;
                        categoryFilter.value = category;
                        break;
                    }
                }
                
                if (!categoryExists) {
                    console.log('⚠️ Category not found:', category, '- Showing 0 products');
                    // Add a temporary option or just show empty state
                    // Trigger filter with the category that doesn't exist
                    categoryFilter.value = '';
                    // Force empty state by filtering with a non-existent category
                    filterProductsByCategory(category);
                } else {
                    // Trigger change event to apply filter
                    var event = new Event('change', { bubbles: true });
                    categoryFilter.dispatchEvent(event);
                    console.log('✅ Category filter applied:', category);
                }
            }
        }, 500);
    }

})();

// Function to filter products by category (even if not in dropdown)
function filterProductsByCategory(category) {
    console.log('🔍 Filtering non-existent category:', category);
    
    var cards = document.querySelectorAll('.marketplace-card-item');
    var visibleCount = 0;
    var resultCount = document.getElementById('resultCount');
    var emptyState = document.getElementById('emptyState');
    
    cards.forEach(function(card) {
        var cardCategory = card.getAttribute('data-category') || '';
        
        // Only show if category matches (which it won't, since category doesn't exist)
        if (cardCategory === category) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update count
    if (resultCount) {
        resultCount.textContent = visibleCount + ' product' + (visibleCount !== 1 ? 's' : '');
    }
    
    // Show empty state
    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.classList.add('show');
            emptyState.style.display = 'block';
        } else {
            emptyState.classList.remove('show');
            emptyState.style.display = 'none';
        }
    }
    
    // Also set the category filter to show the category (even if not in dropdown)
    var categoryFilter = document.getElementById('filterCategory');
    if (categoryFilter) {
        // Add the category as a temporary option if it doesn't exist
        var exists = false;
        for (var i = 0; i < categoryFilter.options.length; i++) {
            if (categoryFilter.options[i].value === category) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            var option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            option.selected = true;
            categoryFilter.appendChild(option);
        } else {
            categoryFilter.value = category;
        }
    }
}

// ============================================================
// CATEGORIES - SHOW MORE/LESS (6 AT A TIME) - FIXED
// ============================================================

(function() {
    'use strict';

    var categoryGrid = document.getElementById('categoryGrid');
    var showMoreBtn = document.getElementById('categoryShowMoreBtn');
    
    if (!categoryGrid || !showMoreBtn) return;

    var allItems = categoryGrid.querySelectorAll('.home-category-item');
    var totalItems = allItems.length;
    
    // Set how many to show initially
    var itemsToShowDesktop = 12;
    var itemsToShowMobile = 6;
    var batchSize = 6;
    var currentCount = 0;
    var isExpanded = false;
    var isInitialized = false;
    
    function getItemsToShow() {
        return window.innerWidth <= 768 ? itemsToShowMobile : itemsToShowDesktop;
    }
    
    function showCategories(count) {
        allItems.forEach(function(item, index) {
            if (index < count) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }
    
    function initCategories() {
        // Only initialize if not expanded
        if (isExpanded) return;
        
        var initialCount = getItemsToShow();
        currentCount = initialCount;
        isInitialized = true;
        
        showCategories(currentCount);
        
        if (currentCount >= totalItems) {
            showMoreBtn.style.display = 'none';
        } else {
            showMoreBtn.style.display = 'inline-flex';
            showMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show More';
        }
    }
    
    function showMoreCategories() {
        var newCount = Math.min(currentCount + batchSize, totalItems);
        currentCount = newCount;
        
        showCategories(currentCount);
        
        if (currentCount >= totalItems) {
            showMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
            isExpanded = true;
        } else {
            showMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show More (' + (totalItems - currentCount) + ' left)';
        }
    }
    
    function showLessCategories() {
        var initialCount = getItemsToShow();
        currentCount = initialCount;
        isExpanded = false;
        
        showCategories(currentCount);
        
        if (currentCount >= totalItems) {
            showMoreBtn.style.display = 'none';
        } else {
            showMoreBtn.style.display = 'inline-flex';
            showMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show More';
        }
    }
    
    function toggleCategories() {
        if (isExpanded) {
            showLessCategories();
        } else {
            showMoreCategories();
        }
    }
    
    // Show More/Less button click
    showMoreBtn.addEventListener('click', toggleCategories);
    
    // Re-initialize on window resize - ONLY if NOT expanded
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Only reinitialize if not expanded and already initialized
            if (!isExpanded && isInitialized) {
                initCategories();
            }
        }, 250);
    });
    
    // Initialize
    initCategories();
    
    console.log('🏷️ Categories Show More/Less initialized');
    console.log('📦 Total categories:', totalItems);

})();

// ============================================================
// MARKETPLACE PAGINATION - DYNAMIC
// ============================================================

(function() {
    'use strict';

    var currentPage = 1;
    var itemsPerPage = 12;
    var allItems = document.querySelectorAll('.marketplace-card-item');
    var totalItems = allItems.length;
    var totalPages = Math.ceil(totalItems / itemsPerPage); // ← DYNAMIC!

    console.log('📦 Total items:', totalItems);
    console.log('📄 Total pages:', totalPages);

    function getItemsForPage(page) {
        var start = (page - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var visibleCount = 0;

        allItems.forEach(function(item, index) {
            if (index >= start && index < end) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Update count
        var resultCount = document.getElementById('resultCount');
        if (resultCount) {
            resultCount.textContent = visibleCount + ' product' + (visibleCount !== 1 ? 's' : '');
        }

        // Update pagination buttons
        updatePagination(page);
    }

    function updatePagination(page) {
        var prevBtn = document.getElementById('prevPageBtn');
        var nextBtn = document.getElementById('nextPageBtn');
        var pageNumbers = document.getElementById('paginationNumbers');

        // Update prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = page === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = page === totalPages;
        }

        // Regenerate page number buttons
        if (pageNumbers) {
            var html = '';
            for (var i = 1; i <= totalPages; i++) {
                var activeClass = i === page ? 'active' : '';
                html += '<button class="marketplace-pagination-btn ' + activeClass + '" data-page="' + i + '">' + i + '</button>';
            }
            pageNumbers.innerHTML = html;

            // Add click listeners to new buttons
            pageNumbers.querySelectorAll('.marketplace-pagination-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var pageNum = parseInt(this.dataset.page);
                    if (pageNum !== currentPage) {
                        goToPage(pageNum);
                    }
                });
            });
        }
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        getItemsForPage(page);
        
        // Scroll to top of products
        var grid = document.getElementById('productGrid');
        if (grid) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Event listeners
    document.addEventListener('DOMContentLoaded', function() {
        var prevBtn = document.getElementById('prevPageBtn');
        var nextBtn = document.getElementById('nextPageBtn');

        if (!prevBtn || !nextBtn) return;

        // Previous button
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });

        // Next button
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });

        // Initialize - show page 1
        goToPage(1);

        console.log('📄 Marketplace pagination initialized');
        console.log('📦 Total items:', totalItems);
        console.log('📄 Total pages:', totalPages);
    });

})();

// ============================================================
// FARMERS - SAVE BUTTON
// ============================================================

(function() {
    'use strict';

    var saveButtons = document.querySelectorAll('.farmers-save-btn');

    var savedFarmers = [];
    try {
        var saved = localStorage.getItem('farmersSaved');
        if (saved) {
            savedFarmers = JSON.parse(saved);
        }
    } catch(e) {}

    function updateFarmersSaveButtons() {
        saveButtons.forEach(function(btn) {
            var farmerId = parseInt(btn.dataset.farmerId);
            if (savedFarmers.indexOf(farmerId) !== -1) {
                btn.classList.add('saved');
                btn.querySelector('i').classList.remove('far');
                btn.querySelector('i').classList.add('fas');
            } else {
                btn.classList.remove('saved');
                btn.querySelector('i').classList.remove('fas');
                btn.querySelector('i').classList.add('far');
            }
        });
    }

    function toggleFarmersSave(btn) {
        var farmerId = parseInt(btn.dataset.farmerId);
        var isSaved = btn.classList.contains('saved');

        if (isSaved) {
            var index = savedFarmers.indexOf(farmerId);
            if (index !== -1) {
                savedFarmers.splice(index, 1);
            }
            btn.classList.remove('saved');
            btn.querySelector('i').classList.remove('fas');
            btn.querySelector('i').classList.add('far');
            console.log('💔 Farmer removed from saved:', farmerId);
        } else {
            if (savedFarmers.indexOf(farmerId) === -1) {
                savedFarmers.push(farmerId);
            }
            btn.classList.add('saved');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
            console.log('❤️ Farmer saved:', farmerId);
        }

        try {
            localStorage.setItem('farmersSaved', JSON.stringify(savedFarmers));
        } catch(e) {}
    }

    saveButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleFarmersSave(this);
        });
    });

    updateFarmersSaveButtons();

    console.log('💾 Farmers save functionality initialized');

})();

// ============================================================
// FARMERS PAGINATION - DYNAMIC
// ============================================================

(function() {
    'use strict';

    var currentPage = 1;
    var itemsPerPage = 12;
    var allItems = document.querySelectorAll('.farmers-card-item');
    var totalItems = allItems.length;
    var totalPages = Math.ceil(totalItems / itemsPerPage);

    console.log('📦 Total farmers:', totalItems);
    console.log('📄 Total pages:', totalPages);

    function getFarmersForPage(page) {
        var start = (page - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var visibleCount = 0;

        allItems.forEach(function(item, index) {
            if (index >= start && index < end) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        var resultCount = document.getElementById('farmersResultCount');
        if (resultCount) {
            resultCount.textContent = visibleCount + ' farmer' + (visibleCount !== 1 ? 's' : '');
        }

        updateFarmersPagination(page);
    }

    function updateFarmersPagination(page) {
        var prevBtn = document.getElementById('farmersPrevBtn');
        var nextBtn = document.getElementById('farmersNextBtn');
        var pageNumbers = document.getElementById('farmersPaginationNumbers');

        if (prevBtn) {
            prevBtn.disabled = page === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = page === totalPages;
        }

        if (pageNumbers) {
            var html = '';
            for (var i = 1; i <= totalPages; i++) {
                var activeClass = i === page ? 'active' : '';
                html += '<button class="farmers-pagination-btn ' + activeClass + '" data-page="' + i + '">' + i + '</button>';
            }
            pageNumbers.innerHTML = html;

            pageNumbers.querySelectorAll('.farmers-pagination-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var pageNum = parseInt(this.dataset.page);
                    if (pageNum !== currentPage) {
                        goToFarmersPage(pageNum);
                    }
                });
            });
        }
    }

    function goToFarmersPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        getFarmersForPage(page);

        var grid = document.getElementById('farmerGrid');
        if (grid) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        var prevBtn = document.getElementById('farmersPrevBtn');
        var nextBtn = document.getElementById('farmersNextBtn');

        if (!prevBtn || !nextBtn) return;

        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                goToFarmersPage(currentPage - 1);
            }
        });

        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                goToFarmersPage(currentPage + 1);
            }
        });

        goToFarmersPage(1);
    });

})();

// ============================================================
// FARMER DETAIL - SAVE BUTTON
// ============================================================

(function() {
    'use strict';

    var saveBtn = document.querySelector('.detail-profile-save-btn');
    if (!saveBtn) return;

    var farmerId = parseInt(saveBtn.dataset.farmerId);

    var savedFarmers = [];
    try {
        var saved = localStorage.getItem('farmersSaved');
        if (saved) {
            savedFarmers = JSON.parse(saved);
        }
    } catch(e) {}

    function updateButtonState() {
        if (savedFarmers.indexOf(farmerId) !== -1) {
            saveBtn.classList.add('saved');
            saveBtn.querySelector('i').classList.remove('far');
            saveBtn.querySelector('i').classList.add('fas');
        } else {
            saveBtn.classList.remove('saved');
            saveBtn.querySelector('i').classList.remove('fas');
            saveBtn.querySelector('i').classList.add('far');
        }
    }

    function toggleSave() {
        var isSaved = saveBtn.classList.contains('saved');

        if (isSaved) {
            var index = savedFarmers.indexOf(farmerId);
            if (index !== -1) {
                savedFarmers.splice(index, 1);
            }
            saveBtn.classList.remove('saved');
            saveBtn.querySelector('i').classList.remove('fas');
            saveBtn.querySelector('i').classList.add('far');
            console.log('💔 Farmer removed from saved:', farmerId);
        } else {
            if (savedFarmers.indexOf(farmerId) === -1) {
                savedFarmers.push(farmerId);
            }
            saveBtn.classList.add('saved');
            saveBtn.querySelector('i').classList.remove('far');
            saveBtn.querySelector('i').classList.add('fas');
            console.log('❤️ Farmer saved:', farmerId);
        }

        try {
            localStorage.setItem('farmersSaved', JSON.stringify(savedFarmers));
        } catch(e) {}
    }

    saveBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        toggleSave();
    });

    updateButtonState();

    console.log('💾 Farmer detail save button initialized');

})();

// ============================================================
// LOGISTICS - SAVE BUTTON
// ============================================================

(function() {
    'use strict';

    var saveButtons = document.querySelectorAll('.logistics-save-btn');

    var savedLogistics = [];
    try {
        var saved = localStorage.getItem('logisticsSaved');
        if (saved) {
            savedLogistics = JSON.parse(saved);
        }
    } catch(e) {}

    function updateLogisticsSaveButtons() {
        saveButtons.forEach(function(btn) {
            var logisticsId = parseInt(btn.dataset.logisticsId);
            if (savedLogistics.indexOf(logisticsId) !== -1) {
                btn.classList.add('saved');
                btn.querySelector('i').classList.remove('far');
                btn.querySelector('i').classList.add('fas');
            } else {
                btn.classList.remove('saved');
                btn.querySelector('i').classList.remove('fas');
                btn.querySelector('i').classList.add('far');
            }
        });
    }

    function toggleLogisticsSave(btn) {
        var logisticsId = parseInt(btn.dataset.logisticsId);
        var isSaved = btn.classList.contains('saved');

        if (isSaved) {
            var index = savedLogistics.indexOf(logisticsId);
            if (index !== -1) {
                savedLogistics.splice(index, 1);
            }
            btn.classList.remove('saved');
            btn.querySelector('i').classList.remove('fas');
            btn.querySelector('i').classList.add('far');
            console.log('💔 Logistics provider removed from saved:', logisticsId);
        } else {
            if (savedLogistics.indexOf(logisticsId) === -1) {
                savedLogistics.push(logisticsId);
            }
            btn.classList.add('saved');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
            console.log('❤️ Logistics provider saved:', logisticsId);
        }

        try {
            localStorage.setItem('logisticsSaved', JSON.stringify(savedLogistics));
        } catch(e) {}
    }

    saveButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleLogisticsSave(this);
        });
    });

    updateLogisticsSaveButtons();

    console.log('💾 Logistics save functionality initialized');

})();

// ============================================================
// LOGISTICS PAGINATION - DYNAMIC
// ============================================================

(function() {
    'use strict';

    var currentPage = 1;
    var itemsPerPage = 12;
    var allItems = document.querySelectorAll('.logistics-card-item');
    var totalItems = allItems.length;
    var totalPages = Math.ceil(totalItems / itemsPerPage);

    console.log('📦 Total logistics providers:', totalItems);
    console.log('📄 Total pages:', totalPages);

    function getLogisticsForPage(page) {
        var start = (page - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var visibleCount = 0;

        allItems.forEach(function(item, index) {
            if (index >= start && index < end) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        var resultCount = document.getElementById('logisticsResultCount');
        if (resultCount) {
            resultCount.textContent = visibleCount + ' provider' + (visibleCount !== 1 ? 's' : '');
        }

        updateLogisticsPagination(page);
    }

    function updateLogisticsPagination(page) {
        var prevBtn = document.getElementById('logisticsPrevBtn');
        var nextBtn = document.getElementById('logisticsNextBtn');
        var pageNumbers = document.getElementById('logisticsPaginationNumbers');

        if (prevBtn) {
            prevBtn.disabled = page === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = page === totalPages;
        }

        if (pageNumbers) {
            var html = '';
            for (var i = 1; i <= totalPages; i++) {
                var activeClass = i === page ? 'active' : '';
                html += '<button class="logistics-pagination-btn ' + activeClass + '" data-page="' + i + '">' + i + '</button>';
            }
            pageNumbers.innerHTML = html;

            pageNumbers.querySelectorAll('.logistics-pagination-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var pageNum = parseInt(this.dataset.page);
                    if (pageNum !== currentPage) {
                        goToLogisticsPage(pageNum);
                    }
                });
            });
        }
    }

    function goToLogisticsPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        getLogisticsForPage(page);

        var grid = document.getElementById('logisticsGrid');
        if (grid) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        var prevBtn = document.getElementById('logisticsPrevBtn');
        var nextBtn = document.getElementById('logisticsNextBtn');

        if (!prevBtn || !nextBtn) return;

        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                goToLogisticsPage(currentPage - 1);
            }
        });

        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                goToLogisticsPage(currentPage + 1);
            }
        });

        goToLogisticsPage(1);
    });

})();

