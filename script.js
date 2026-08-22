```javascript
/* =====================================================
   THE CROWN CHESS SOCIETY
   V1 — JAVASCRIPT
===================================================== */


/* =====================================================
   HEADER SCROLL
===================================================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("open");

    menuBtn.textContent =
        mobileMenu.classList.contains("open")
            ? "×"
            : "☰";

});


document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

        menuBtn.textContent = "☰";

    });

});


/* =====================================================
   DARK MODE
===================================================== */

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("crown-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀";

}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    themeToggle.textContent =
        isDark ? "☀" : "☾";

    localStorage.setItem(
        "crown-theme",
        isDark ? "dark" : "light"
    );

});


/* =====================================================
   STAT COUNTER
===================================================== */

const counters =
    document.querySelectorAll("[data-target]");

let counterStarted = false;


function startCounters() {

    if (counterStarted) return;

    counterStarted = true;

    counters.forEach(counter => {

        const target =
            Number(counter.dataset.target);

        let current = 0;

        const duration = 1300;

        const start = performance.now();

        function update(time) {

            const progress =
                Math.min(
                    (time - start) / duration,
                    1
                );

            const eased =
                1 - Math.pow(1 - progress, 3);

            current =
                Math.floor(target * eased);

            counter.textContent = current;

            if (progress < 1) {

                requestAnimationFrame(update);

            } else {

                counter.textContent = target + "+";

            }

        }

        requestAnimationFrame(update);

    });

}


/* =====================================================
   INTERSECTION OBSERVER
===================================================== */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },
        {
            threshold: .12
        }
    );


document.querySelectorAll(
    ".section, .event-card, .member-card, .about-card"
).forEach(element => {

    element.classList.add("reveal");

    observer.observe(element);

});


const statsSection =
    document.querySelector(".stats");

const statsObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    startCounters();

                    statsObserver.disconnect();

                }

            });

        },
        {
            threshold: .3
        }
    );


statsObserver.observe(statsSection);


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-links a");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current = section.id;

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.classList.add("active");

        }

    });

});


/* =====================================================
   CHESS CARD TILT
===================================================== */

const chessCard =
    document.querySelector(".chess-card");


if (window.innerWidth > 900) {

    chessCard.addEventListener(
        "mousemove",
        event => {

            const rect =
                chessCard.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - .5) * 8;

            const rotateX =
                ((y / rect.height) - .5) * -8;

            chessCard.style.transform =
                `rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-5px)`;

        }
    );


    chessCard.addEventListener(
        "mouseleave",
        () => {

            chessCard.style.transform =
                "rotate(2deg)";

        }
    );

}


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        mobileMenu.classList.remove("open");

        menuBtn.textContent = "☰";

    }

});
```
