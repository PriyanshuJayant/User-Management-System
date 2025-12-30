/* ============================
   TRANSITIONS & INTERACTIONS
   ============================ */

document.addEventListener('DOMContentLoaded', function () {

    // Add loading state to form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.classList.contains('action-btn')) {
                submitBtn.classList.add('loading');
            }
        });
    });

    // Delete confirmation with animation
    const deleteForms = document.querySelectorAll('form[action*="/delete"]');
    deleteForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const row = form.closest('tr');

            if (confirm('Are you sure you want to delete this user?')) {
                if (row) {
                    row.style.transition = 'all 0.3s ease';
                    row.style.transform = 'translateX(100%)';
                    row.style.opacity = '0';

                    setTimeout(() => {
                        form.submit();
                    }, 300);
                } else {
                    form.submit();
                }
            }
        });
    });

    // Smooth scroll for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Input animation on focus
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement?.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            this.parentElement?.classList.remove('focused');
        });
    });

    // Add ripple effect to buttons (skip submit buttons to avoid interference)
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-btn, .action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Page transition effect
    document.body.classList.add('page-loaded');
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.page-loaded {
        opacity: 1;
    }
    
    .form-group.focused label {
        color: #78b4ff;
    }
`;
document.head.appendChild(style);
