// Google Sheets Endpoint Integration Constant
const GOOGLE_SCRIPT_URL = ''; 

// Centered GPU-Accelerated Cursor Glow (incorporates translate(-50%, -50%))
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
});

// HTML5 Canvas Constellation Particle Animation
const canvas = document.getElementById('constellationCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    
    function resizeCanvas() {
        const hero = document.getElementById('hero');
        if (hero) {
            canvas.width = hero.clientWidth;
            canvas.height = hero.clientHeight;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    document.getElementById('hero').addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    document.getElementById('hero').addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.45)';
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        // Determine particle density relative to screen resolution
        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);
    
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const alpha = (1 - dist / 100) * 0.15;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    const alpha = (1 - dist / mouse.radius) * 0.25;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();
}

// Navigation scroll effect & Active Navigation link on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Mobile menu controls
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobile() {
    mobileToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

// Scroll reveal observer
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});
revealElements.forEach(el => revealObserver.observe(el));

// Interactive Wave Timeline Node Hover/Click Handlers
const waveNodes = document.querySelectorAll('.wave-node');
const expCards = document.querySelectorAll('.experience-card');
const mobileExpTabs = document.querySelectorAll('.mobile-exp-tab');

waveNodes.forEach(node => {
    const selectNode = () => {
        waveNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        
        const index = node.getAttribute('data-index');
        
        // Sync mobile tabs
        mobileExpTabs.forEach(t => {
            t.classList.toggle('active', t.getAttribute('data-index') === index);
        });

        expCards.forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('data-index') === index) {
                card.classList.add('active');
            }
        });
    };
    
    node.addEventListener('mouseenter', selectNode);
    node.addEventListener('click', selectNode);
});

// Mobile-Only Experience Tabs Event Listener
mobileExpTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const index = tab.getAttribute('data-index');
        
        // Sync desktop nodes
        waveNodes.forEach(n => {
            n.classList.toggle('active', n.getAttribute('data-index') === index);
        });
        
        // Sync mobile tabs
        mobileExpTabs.forEach(t => {
            t.classList.toggle('active', t.getAttribute('data-index') === index);
        });
        
        // Sync experience details cards
        expCards.forEach(card => {
            card.classList.toggle('active', card.getAttribute('data-index') === index);
        });
    });
});

// Skills Section Show All/Less Toggle Handler
const toggleSkillsBtn = document.getElementById('toggleSkillsBtn');
const skillsGrid = document.querySelector('.skills-grid');
if (toggleSkillsBtn && skillsGrid) {
    toggleSkillsBtn.addEventListener('click', () => {
        const isExpanded = skillsGrid.classList.toggle('expanded');
        if (isExpanded) {
            toggleSkillsBtn.innerHTML = '<i class="fas fa-minus"></i> Show Less';
        } else {
            toggleSkillsBtn.innerHTML = '<i class="fas fa-plus"></i> Show All Skills';
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// ----------------------------------------------------
// Project Portfolio Database & Dynamic Rendering
// ----------------------------------------------------
const projects = [
    {
        title: "Planboards",
        category: "featured",
        description: "Cross-platform Kanban productivity app (Trello-like) for iOS, Android, Web, macOS & tablets. Features AI voice-to-task, subscriptions, and real-time sync.",
        badge: "1,000+ Downloads",
        tech: ["Flutter", "RxDart", "Firebase", "Vertex AI", "OpenAI Whisper", "In-App Purchases", "Node.js"],
        icon: "fas fa-chalkboard",
        gradient: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=app.planboards",
            appStore: "https://apps.apple.com/us/app/planboards-todo-notes/id6758831916",
            website: "https://planboardsapp.com/"
        }
    },
    {
        title: "La Bonne Semence",
        category: "featured",
        description: "Daily devotional and spiritual content application featuring audio streaming, multi-region localization, offline access, and daily content updates.",
        badge: "100K+ Downloads",
        tech: ["Flutter", "Dart", "Provider", "SQLite", "Push Notifications", "Audio Streaming"],
        icon: "fas fa-book-open",
        gradient: "linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=app.bs",
            appStore: "https://apps.apple.com/us/app/la-bonne-semence/id1543385890"
        }
    },
    {
        title: "Dio Sync",
        category: "featured",
        description: "Bluetooth-connected bar inventory management and synchronization productivity platform. Features real-time bottle tracking and data sync.",
        badge: "Real-time Sync",
        tech: ["Flutter", "Bluetooth Plus", "GetX", "SQLite", "Firebase", "MVVM"],
        icon: "fas fa-sync",
        gradient: "linear-gradient(135deg, #10b981, #059669, #047857)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.diosync.app",
            appStore: "https://apps.apple.com/us/app/diosync/id6746481455"
        }
    },
    {
        title: "Upvoit",
        category: "featured",
        description: "Community engagement, voting, and service booking platform. Features social login (Google, Apple) and real-time push notifications.",
        badge: "Community",
        tech: ["Flutter", "BLoC / Cubit", "Firebase", "Social Login", "FCM", "MVVM"],
        icon: "fas fa-users",
        gradient: "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.upvoit",
            appStore: "https://apps.apple.com/us/app/upvoit/id6476645997"
        }
    },
    {
        title: "Milk Club",
        category: "featured",
        description: "Educational, content sharing, and rewards application for dairy consumers with seamless mobile-web synchronization.",
        badge: "Loyalty & Rewards",
        tech: ["Flutter", "GetX", "In-App WebView", "Deep Linking", "MVC"],
        icon: "fas fa-cow",
        gradient: "linear-gradient(135deg, #14b8a6, #0d9488, #0f766e)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.dairyfarmersofontario.milkclub",
            appStore: "https://apps.apple.com/ca/app/milk-club/id1599621681"
        }
    },
    {
        title: "Liquor Junction Ghana",
        category: "featured",
        description: "Premium liquor e-commerce and retail platform. Retail stores locator, online cart ordering, and mobile applications synchronizing catalog data across iOS, Android, and Web.",
        badge: "E-Commerce Web & Apps",
        tech: ["React Native", "React", "Node.js", "MongoDB", "Redux", "Stripe"],
        icon: "fas fa-wine-glass",
        gradient: "linear-gradient(135deg, #b91c1c, #991b1b, #7f1d1d)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.liquor.junction",
            appStore: "https://apps.apple.com/in/app/liquor-junction-ghana-app/id6547853117",
            website: "https://liquorjunctionghana.com/"
        }
    },
    {
        title: "WhyWe",
        category: "additional",
        description: "Interactive social connection application designed to foster closer relationships and communication.",
        badge: "Social Connect",
        tech: ["Flutter", "Firebase", "Push Notifications", "Clean Architecture"],
        icon: "fas fa-heart-pulse",
        gradient: "linear-gradient(135deg, #ec4899, #f43f5e, #e11d48)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.whywe.in",
            appStore: "https://apps.apple.com/in/app/whywe/id6458049161"
        }
    },
    {
        title: "Trade25",
        category: "additional",
        description: "B2B trade and commercial networking platform for buying, selling, and directory search.",
        badge: "B2B Marketplace",
        tech: ["Flutter", "Dart", "REST API", "State Management"],
        icon: "fas fa-briefcase",
        gradient: "linear-gradient(135deg, #64748b, #475569, #334155)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.trade25",
            appStore: "https://apps.apple.com/au/app/trade25/id6468847120"
        }
    },
    {
        title: "EV Point",
        category: "additional",
        description: "Electric vehicle charging network platform for finding stations, initiating charges, and handling payments.",
        badge: "EV Charging",
        tech: ["Flutter", "Maps Integration", "Payments", "IoT Telemetry"],
        icon: "fas fa-charging-station",
        gradient: "linear-gradient(135deg, #22c55e, #15803d, #166534)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=global.ampeco.eu.evpoint",
            appStore: "https://apps.apple.com/bg/app/evpoint/id1465144295"
        }
    },
    {
        title: "Himmer",
        category: "additional",
        description: "Modern social matchmaking and dating application focusing on personalized search and profiles.",
        badge: "Matchmaking",
        tech: ["Flutter", "Firebase Auth", "Real-time Chat", "Geolocator"],
        icon: "fas fa-fire-flame-curved",
        gradient: "linear-gradient(135deg, #f97316, #ea580c, #c2410c)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.himmer.dating"
        }
    },
    {
        title: "BookInk",
        category: "additional",
        description: "Booking and discovery application for tattoo artists, salons, and body art studios.",
        badge: "Artist Booking",
        tech: ["Flutter", "Dart", "Calendar Sync", "Stripe Integration"],
        icon: "fas fa-pen-nib",
        gradient: "linear-gradient(135deg, #7c3aed, #6d28d9, #5b21b6)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.bookink",
            appStore: "https://apps.apple.com/be/app/bookink/id6472483162"
        }
    },
    {
        title: "TalotSing (User)",
        category: "additional",
        description: "On-demand consumer shopping and delivery platform (Amazon-style) featuring local product search, order placement, live delivery tracking, and digital payments.",
        badge: "Consumer Shopping",
        tech: ["Flutter", "Google Maps", "WebSockets", "Razorpay"],
        icon: "fas fa-car",
        gradient: "linear-gradient(135deg, #0ea5e9, #0284c7, #0369a1)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.talotsing.user",
            appStore: "https://apps.apple.com/in/app/talotsing/id6745091463"
        }
    },
    {
        title: "TalotSing Driver",
        category: "additional",
        description: "Companion driver-side logistics and delivery agent app for shopping orders, featuring real-time dispatch, route optimization, and delivery tracking.",
        badge: "Logistics Delivery",
        tech: ["Flutter", "Background Location", "Maps API", "WebSockets"],
        icon: "fas fa-taxi",
        gradient: "linear-gradient(135deg, #0284c7, #0369a1, #075985)",
        links: {
            playStore: "https://play.google.com/store/apps/details?id=com.talotsing.driver",
            appStore: "https://apps.apple.com/in/app/talotsing-driver/id6745094090"
        }
    }
];

// Carousel & view mode state
let currentFilter = 'all';
let currentView = 'carousel';
let carouselIndex = 0;

const track = document.getElementById('projectsTrack');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrevBtn');
const nextBtn = document.getElementById('carouselNextBtn');

function getFilteredProjects() {
    if (currentFilter === 'all') return projects;
    return projects.filter(p => p.category === currentFilter);
}

function getItemsPerScreen() {
    const w = window.innerWidth;
    if (w > 1024) return 3;
    if (w > 768) return 2;
    return 1;
}

function renderProjects() {
    if (!track) return;
    const filtered = getFilteredProjects();
    track.innerHTML = '';
    
    if (filtered.length === 0) {
        track.innerHTML = `<div style="text-align:center; width:100%; color:var(--text-muted); padding:3rem 0;">No projects found in this category.</div>`;
        return;
    }
    
    filtered.forEach(p => {
        const techHTML = p.tech.map(t => `<span>${t}</span>`).join('');
        
        let linksHTML = '';
        if (p.links.playStore) {
            linksHTML += `<a href="${p.links.playStore}" target="_blank" class="project-link"><i class="fab fa-google-play"></i> Play Store</a>`;
        }
        if (p.links.appStore) {
            linksHTML += `<a href="${p.links.appStore}" target="_blank" class="project-link"><i class="fab fa-app-store"></i> App Store</a>`;
        }
        if (p.links.website) {
            linksHTML += `<a href="${p.links.website}" target="_blank" class="project-link"><i class="fas fa-globe"></i> Website</a>`;
        }
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-image" style="background: ${p.gradient};">
                <i class="${p.icon} project-icon"></i>
                <span class="project-badge"><i class="fas fa-star"></i> ${p.badge}</span>
            </div>
            <div class="project-content">
                <div class="project-content-text">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                </div>
                <div>
                    <div class="project-tech">
                        ${techHTML}
                    </div>
                    <div class="project-links">
                        ${linksHTML}
                    </div>
                </div>
            </div>
        `;
        track.appendChild(card);
    });
    
    if (currentView === 'carousel') {
        track.classList.remove('grid-view');
        track.style.transform = `translateX(0px)`;
        carouselIndex = 0;
        setupCarouselDots();
        updateCarouselNavigation();
        if (prevBtn && nextBtn) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
        if (dotsContainer) dotsContainer.style.display = 'flex';
    } else {
        track.classList.add('grid-view');
        track.style.transform = 'none';
        if (prevBtn && nextBtn) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        if (dotsContainer) dotsContainer.style.display = 'none';
    }
}

function setupCarouselDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const filteredCount = getFilteredProjects().length;
    const itemsPerScreen = getItemsPerScreen();
    const totalPages = Math.max(1, filteredCount - itemsPerScreen + 1);
    
    if (totalPages <= 1) {
        dotsContainer.style.display = 'none';
        return;
    }
    
    dotsContainer.style.display = 'flex';
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            slideCarousel(i);
        });
        dotsContainer.appendChild(dot);
    }
}

// Infinite loop carousel scroller
function slideCarousel(index) {
    if (!track) return;
    const filtered = getFilteredProjects();
    const itemsPerScreen = getItemsPerScreen();
    const maxIndex = Math.max(0, filtered.length - itemsPerScreen);
    
    if (index > maxIndex) {
        carouselIndex = 0; // Wrap back to beginning
    } else if (index < 0) {
        carouselIndex = maxIndex; // Wrap to end
    } else {
        carouselIndex = index;
    }
    
    const cardWidth = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 32;
    
    const offset = carouselIndex * (cardWidth + gap);
    track.style.transform = `translateX(${-offset}px)`;
    
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === carouselIndex);
        });
    }
    
    updateCarouselNavigation();
}

function updateCarouselNavigation() {
    if (!prevBtn || !nextBtn) return;
    // For infinite wrap-around, navigation arrows are always clickable
    prevBtn.disabled = false;
    nextBtn.disabled = false;
}

// Window resize calculations
window.addEventListener('resize', () => {
    if (currentView === 'carousel') {
        renderProjects();
    }
});

// Controls binding
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderProjects();
    });
});

const carouselBtn = document.getElementById('carouselViewBtn');
const gridBtn = document.getElementById('gridViewBtn');

if (carouselBtn && gridBtn) {
    carouselBtn.addEventListener('click', () => {
        carouselBtn.classList.add('active');
        gridBtn.classList.remove('active');
        currentView = 'carousel';
        renderProjects();
    });
    
    gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        carouselBtn.classList.remove('active');
        currentView = 'grid';
        renderProjects();
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => slideCarousel(carouselIndex - 1));
    nextBtn.addEventListener('click', () => slideCarousel(carouselIndex + 1));
}

// Touch support
if (track) {
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (currentView !== 'carousel') return;
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            slideCarousel(carouselIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            slideCarousel(carouselIndex - 1);
        }
    }
}

renderProjects();

// ----------------------------------------------------
// Google Sheets Form Submissions Handlers
// ----------------------------------------------------
async function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp;&nbsp;Sending...';
    btn.disabled = true;
    
    const form = document.getElementById('contactForm');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value || '';
    const message = document.getElementById('message').value;
    
    if (GOOGLE_SCRIPT_URL) {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify({ name, email, subject, message })
            });
            
            const result = await response.json();
            if (result.status === 'success') {
                showSuccess(btn, originalText);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>&nbsp;&nbsp;Failed! Opening Mail Client...';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            setTimeout(() => {
                window.location.href = `mailto:amitprajapatimi4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " <" + email + ">\n\n" + message)}`;
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 2500);
        }
    } else {
        console.log('No Google Apps Script endpoint provided. Redirecting to direct mailto client.');
        showSuccess(btn, originalText);
        setTimeout(() => {
            window.location.href = `mailto:amitprajapatimi4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " <" + email + ">\n\n" + message)}`;
        }, 800);
    }
}

function showSuccess(btn, originalText) {
    btn.innerHTML = '<i class="fas fa-check"></i>&nbsp;&nbsp;Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    document.getElementById('contactForm').reset();
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
}

window.handleSubmit = handleSubmit;

// ----------------------------------------------------
// Counters and Scroll Smooth Effects
// ----------------------------------------------------
function animateCounters() {
    document.querySelectorAll('.stat-item h3').forEach(counter => {
        const target = counter.textContent;
        const isNumeric = /^\d+/.test(target);
        if (!isNumeric) return;

        const num = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/[\d]/g, '');
        let current = 0;
        const increment = num / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    });
}
setTimeout(animateCounters, 1000);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
