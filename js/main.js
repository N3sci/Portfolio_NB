document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ----------------------------------------------------
    // Custom Cursor
    // ----------------------------------------------------
    const cursor = document.getElementById("custom-cursor");
    if (cursor && !window.matchMedia("(hover: none)").matches) {
        // Show cursor only on devices that support hover
        gsap.set(cursor, { opacity: 1 });
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        // Track mouse position
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor follow using GSAP ticker
        gsap.ticker.add(() => {
            // Lerp (linear interpolation) for smooth spring effect
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            gsap.set(cursor, {
                x: cursorX,
                y: cursorY
            });
        });
        
        // Add hover effects for interactive elements
        const hoverTargets = document.querySelectorAll("a, button, .bento-item, .hover-target");
        
        hoverTargets.forEach(target => {
            target.addEventListener("mouseenter", () => {
                gsap.to(cursor, {
                    scale: 2.5,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            target.addEventListener("mouseleave", () => {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: "transparent",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener("mouseleave", () => {
            gsap.to(cursor, { opacity: 0, duration: 0.3 });
        });
        document.addEventListener("mouseenter", () => {
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
        });
    }

    // ----------------------------------------------------
    // GSAP Entrance Animations
    // ----------------------------------------------------
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Initial state setup for things that need to be hidden before animation
    gsap.set(".hero-left", { x: -40, opacity: 0 });
    gsap.set(".hero-title", { y: 100 });
    gsap.set(".hero-subtitle", { y: 40, opacity: 0 });
    gsap.set(".hero-buttons", { y: 30, opacity: 0 });
    gsap.set(".nav-logo, .nav-links", { y: -20, opacity: 0 });
    gsap.set(".mockup-text-1, .mockup-text-2", { y: 20, opacity: 0 });

    // Play animation
    tl.to(".nav-logo, .nav-links", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        delay: 0.2
    })
    .to(".hero-left", {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out"
    }, "-=0.6")
    .to(".mockup-text-1", {
        y: 0,
        opacity: 1,
        duration: 1
    }, "-=0.8")
    .to(".mockup-text-2", {
        y: 0,
        opacity: 1,
        duration: 1
    }, "-=0.8")
    .to(".hero-title", {
        y: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=1.4")
    .to(".hero-subtitle", {
        y: 0,
        opacity: 1,
        duration: 1
    }, "-=0.9")
    .to(".hero-buttons", {
        y: 0,
        opacity: 1,
        duration: 1
    }, "-=0.8")
    .to(".scroll-indicator", {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");

    // Scroll line animation (pulsing / moving down)
    gsap.fromTo(".scroll-line", 
        { y: "-100%" },
        { y: "100%", duration: 1.5, repeat: -1, ease: "power2.inOut" }
    );

    // Register ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Bento Section Header Animation
        gsap.from(".bento-header", {
            scrollTrigger: {
                trigger: "#projects",
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Bento Items Staggered Animation
        gsap.from(".bento-item", {
            scrollTrigger: {
                trigger: "#projects",
                start: "top 80%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all" // Clears inline styles after animation to prevent issues
        });

        // About Content Animation
        gsap.from(".about-content > *, .about-skills", {
            scrollTrigger: {
                trigger: "#about",
                start: "top 75%",
            },
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // ----------------------------------------------------
    // Wireframe Interactive Canvas (Sine Wave Terrain)
    // ----------------------------------------------------
    function initWireframeCanvas() {
        const canvas = document.getElementById('wireframe-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width, height;
        
        // Grid parameters
        const cols = 35;
        const rows = 35;
        const spacing = 18; // distance between points
        
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;
        let time = 0;

        function resize() {
            const parent = canvas.parentElement;
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        window.addEventListener('resize', resize);
        resize();
        
        // Track mouse over canvas/window
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            // Map mouse to -1 to 1 relative to canvas center
            targetMouseX = (e.clientX - (rect.left + width / 2)) / (width / 2);
            targetMouseY = (e.clientY - (rect.top + height / 2)) / (height / 2);
        });
        
        window.addEventListener('mouseleave', () => {
            targetMouseX = 0;
            targetMouseY = 0;
        });

        const focalLength = 400;
        
        function render() {
            ctx.clearRect(0, 0, width, height);
            
            // Smooth mouse following
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;
            
            time += 0.012;
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            // Base rotation parameters
            const rotX = Math.PI / 3 + mouseY * 0.2; // Tilt based on Y mouse
            const rotY = time * 0.2 + mouseX * 0.5;  // Rotate over time and X mouse
            
            const cx = width / 2;
            const cy = height / 2;
            
            const projected = [];
            
            // Calculate 3D points
            for (let i = 0; i < rows; i++) {
                projected[i] = [];
                for (let j = 0; j < cols; j++) {
                    let x = (j - cols/2) * spacing;
                    let z = (i - rows/2) * spacing;
                    
                    // Elegant wavy terrain formula
                    let d = Math.sqrt(x*x + z*z);
                    let y = Math.sin(d * 0.04 - time * 2) * 25 + Math.cos(x * 0.05 + time) * 15;
                    
                    // Rotate Y (Spin)
                    let rx = x * Math.cos(rotY) - z * Math.sin(rotY);
                    let rz = z * Math.cos(rotY) + x * Math.sin(rotY);
                    
                    // Rotate X (Tilt)
                    let ry = y * Math.cos(rotX) - rz * Math.sin(rotX);
                    let rrz = rz * Math.cos(rotX) + y * Math.sin(rotX);
                    
                    // Projection to 2D
                    let scale = focalLength / (focalLength + rrz + 300);
                    let px = cx + rx * scale;
                    let py = cy + ry * scale + 50; // offset down a bit
                    
                    projected[i][j] = { x: px, y: py, scale: scale };
                }
            }
            
            // Draw connecting lines
            for (let i = 0; i < rows - 1; i++) {
                for (let j = 0; j < cols - 1; j++) {
                    const p1 = projected[i][j];
                    const p2 = projected[i][j+1];
                    const p3 = projected[i+1][j];
                    
                    if (p1.scale > 0 && p2.scale > 0 && p3.scale > 0) {
                        // Horizontal line
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        
                        // Vertical line
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p3.x, p3.y);
                    }
                }
            }
            ctx.stroke();
            
            requestAnimationFrame(render);
        }
        
        render();
        
        // GSAP Fade In Canvas
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.to(canvas, {
                scrollTrigger: {
                    trigger: ".about-canvas-container",
                    start: "top 75%",
                },
                opacity: 1,
                duration: 2.5,
                ease: "power2.inOut"
            });
        }
    }
    
    // Initialize Canvas
    initWireframeCanvas();

    // ----------------------------------------------------
    // Mobile Menu Toggle
    // ----------------------------------------------------
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (menuToggle && mobileMenu && menuClose) {
        const openMenu = () => {
            mobileMenu.classList.remove('pointer-events-none');
            gsap.to(mobileMenu, { opacity: 1, duration: 0.5, ease: "power2.out" });
            
            // Stagger animation for links
            gsap.fromTo(mobileNavLinks, 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2, ease: "power3.out" }
            );
        };

        const closeMenu = () => {
            gsap.to(mobileMenu, { opacity: 0, duration: 0.5, ease: "power2.out", onComplete: () => {
                mobileMenu.classList.add('pointer-events-none');
            }});
        };

        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

});
