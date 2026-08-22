/* =====================================================
   THE CROWN CHESS SOCIETY
   V1.1 — COMPLETE JAVASCRIPT
===================================================== */


/* =====================================================
   HEADER SCROLL
===================================================== */

const header = document.getElementById("header");

function updateHeader() {
    if (!header) return;

    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader);
updateHeader();


/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {

    menuBtn.addEventListener("click", () => {

        mobileMenu.classList.toggle("open");

        if (mobileMenu.classList.contains("open")) {
            menuBtn.textContent = "×";
        } else {
            menuBtn.textContent = "☰";
        }

    });


    document
        .querySelectorAll(".mobile-menu a")
        .forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");

                menuBtn.textContent = "☰";

            });

        });

}


/* =====================================================
   DARK MODE
===================================================== */

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("crown-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    if (themeToggle) {
        themeToggle.textContent = "☀";
    }

} else {

    if (themeToggle) {
        themeToggle.textContent = "☾";
    }

}


if (themeToggle) {

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

}


/* =====================================================
   STAT COUNTER
   FIXED VERSION
===================================================== */

const counters =
    document.querySelectorAll("[data-target]");


function startCounters() {

    counters.forEach(counter => {

        const target =
            Number(counter.dataset.target);

        if (isNaN(target)) return;

        const duration = 1200;

        let startTime = null;


        function animate(currentTime) {

            if (startTime === null) {
                startTime = currentTime;
            }

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);


            /*
             * Ease-out animation
             */
            const eased =
                1 - Math.pow(1 - progress, 3);


            const currentValue =
                Math.floor(target * eased);


            counter.textContent =
                currentValue;


            if (progress < 1) {

                requestAnimationFrame(animate);

            } else {

                /*
                 * Hiển thị số cuối cùng
                 */
                counter.textContent =
                    target + "+";

            }

        }


        requestAnimationFrame(animate);

    });

}


/*
 * Chạy counter ngay khi trang tải xong.
 *
 * Không dùng IntersectionObserver cho counter
 * để tránh trường hợp GitHub Pages hiển thị 0.
 */

window.addEventListener("load", () => {

    setTimeout(() => {

        startCounters();

    }, 200);

});


/* =====================================================
   REVEAL ANIMATION
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".section, .event-card, .member-card, .about-card"
    );


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.08
            }
        );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

} else {

    /*
     * Trình duyệt cũ
     */
    revealElements.forEach(element => {

        element.classList.add("show");

    });

}


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );


function updateActiveNav() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;

        const sectionBottom =
            sectionTop + section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {

            currentSection =
                section.id;

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        const href =
            link.getAttribute("href");


        if (
            href === "#" + currentSection
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNav
);

updateActiveNav();


/* =====================================================
   CHESS CARD TILT
===================================================== */

const chessCard =
    document.querySelector(
        ".chess-card"
    );


if (
    chessCard &&
    window.innerWidth > 900
) {

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
                ((x / rect.width) - 0.5) * 7;

            const rotateX =
                ((y / rect.height) - 0.5) * -7;


            chessCard.style.transform =
                `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-5px)
                `;

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
   SMOOTH SCROLL
===================================================== */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.offsetTop -
                    headerHeight -
                    15;


                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }
        );

    });


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            if (mobileMenu) {
                mobileMenu.classList.remove(
                    "open"
                );
            }

            if (menuBtn) {
                menuBtn.textContent = "☰";
            }

        }

    }
);


/* =====================================================
   PREVENT MOBILE MENU FROM STAYING OPEN
   WHEN RESIZING TO DESKTOP
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 900 &&
            mobileMenu
        ) {

            mobileMenu.classList.remove(
                "open"
            );

            if (menuBtn) {
                menuBtn.textContent = "☰";
            }

        }

    }
);


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "%c♛ THE CROWN CHESS SOCIETY",
    "font-size:20px;font-weight:bold;"
);

console.log(
    "%cWelcome to the Society.",
    "font-size:13px;"
);
