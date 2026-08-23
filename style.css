/* =========================================================
   THE CROWN CHESS SOCIETY
   V1.5 — LIVE CLUB SYSTEM
========================================================= */

const CLUB_SLUG = "the-crown-chess-society";

const API = {
    club: `https://api.chess.com/pub/club/${CLUB_SLUG}`,
    members: `https://api.chess.com/pub/club/${CLUB_SLUG}/members`,
    matches: `https://api.chess.com/pub/club/${CLUB_SLUG}/matches`
};

const CHESS_CLUB =
    "https://www.chess.com/club/the-crown-chess-society";


/* =========================================================
   DOM
========================================================= */

const $ = id => document.getElementById(id);

const memberCount = $("memberCount");
const eventCount = $("eventCount");
const matchCount = $("matchCount");
const statusText = $("statusText");

const heroMembers = $("heroMembers");
const heroEvents = $("heroEvents");

const membersGrid = $("membersGrid");
const memberSearch = $("memberSearch");
const memberResultText = $("memberResultText");
const refreshMembers = $("refreshMembers");

const apiStatus = $("apiStatus");
const eventsGrid = $("eventsGrid");
const eventsStatus = $("eventsStatus");

const menuButton = $("menuButton");
const mobileMenu = $("mobileMenu");

const currentYear = $("currentYear");


/* =========================================================
   STATE
========================================================= */

let allMembers = [];

let clubData = null;

let matchData = {
    registered: [],
    in_progress: [],
    finished: []
};


/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value) {

    if (
        value === undefined ||
        value === null ||
        Number.isNaN(Number(value))
    ) {
        return "—";
    }

    return Number(value).toLocaleString("en-US");
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


function initial(username) {

    if (!username) {
        return "?";
    }

    return username
        .trim()
        .charAt(0)
        .toUpperCase();
}


function formatDate(timestamp) {

    if (!timestamp) {
        return "Time unavailable";
    }

    return new Date(timestamp * 1000)
        .toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}


function matchURL(match) {

    return (
        match.url ||
        match["@id"] ||
        "https://www.chess.com/clubs/matches/open"
    );
}


/* =========================================================
   API STATUS
========================================================= */

function setAPIStatus(
    message,
    online = true
) {

    if (!apiStatus) {
        return;
    }

    apiStatus.innerHTML = `
        <span
            class="status-dot"
            style="
                background:${online ? "#5fd38b" : "#d86b6b"};
                box-shadow:0 0 10px ${
                    online
                        ? "rgba(95,211,139,.6)"
                        : "rgba(216,107,107,.5)"
                };
            "
        ></span>

        ${escapeHTML(message)}
    `;
}


/* =========================================================
   FETCH JSON
========================================================= */

async function fetchJSON(url) {

    const response = await fetch(
        url,
        {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        }
    );

    if (!response.ok) {

        throw new Error(
            `${response.status} ${response.statusText}`
        );
    }

    return response.json();
}


/* =========================================================
   LOAD CLUB
========================================================= */

async function loadClub() {

    try {

        const data =
            await fetchJSON(API.club);

        clubData = data;


        /* -----------------------------------------
           MEMBERS
        ----------------------------------------- */

        const members =
            data.members_count ??
            data.members ??
            0;

        memberCount.textContent =
            formatNumber(members);

        heroMembers.textContent =
            formatNumber(members);


        /* -----------------------------------------
           EVENTS
        ----------------------------------------- */

        const events =
            data.events_played ??
            data.events ??
            0;

        eventCount.textContent =
            formatNumber(events);

        heroEvents.textContent =
            formatNumber(events);


        /* -----------------------------------------
           STATUS
        ----------------------------------------- */

        statusText.textContent =
            data.visibility === "private"
                ? "PRIVATE"
                : "ACTIVE";


        setAPIStatus(
            "Chess.com data connected",
            true
        );

    } catch (error) {

        console.error(
            "Club API error:",
            error
        );

        setAPIStatus(
            "Chess.com API temporarily unavailable",
            false
        );

    }
}


/* =========================================================
   LOAD MEMBERS
========================================================= */

async function loadMembers() {

    membersGrid.innerHTML = `
        <div class="loading-card">
            <div>
                <div class="loader"></div>
                <p>Updating members...</p>
            </div>
        </div>
    `;

    try {

        const data =
            await fetchJSON(API.members);


        /*
         * Chess.com returns:
         *
         * weekly
         * monthly
         * all_time
         */

        const combined = [
            ...(data.weekly || []),
            ...(data.monthly || []),
            ...(data.all_time || [])
        ];


        const unique =
            new Map();


        combined.forEach(member => {

            const username =
                typeof member === "string"
                    ? member
                    : member.username;

            if (!username) {
                return;
            }

            unique.set(
                username.toLowerCase(),
                username
            );

        });


        allMembers =
            Array.from(unique.values());


        allMembers.sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
        );


        renderMembers(allMembers);


    } catch (error) {

        console.error(
            "Members API error:",
            error
        );


        membersGrid.innerHTML = `

            <div class="loading-card">

                <div>

                    <div style="
                        font-size:36px;
                        color:#d9a441;
                    ">
                        ♟
                    </div>

                    <p>
                        Member data unavailable.
                    </p>

                    <a
                        href="${CHESS_CLUB}"
                        target="_blank"
                        rel="noopener"
                        style="
                            display:inline-block;
                            margin-top:10px;
                            color:#f2c96b;
                        "
                    >
                        Open Chess.com →
                    </a>

                </div>

            </div>
        `;

        memberResultText.textContent =
            "Live member data unavailable.";
    }
}


/* =========================================================
   RENDER MEMBERS
========================================================= */

function renderMembers(
    members
) {

    const limit = 48;

    const visible =
        members.slice(0, limit);


    if (!visible.length) {

        membersGrid.innerHTML = `
            <div class="loading-card">
                <div>
                    <div style="
                        font-size:35px;
                        color:#d9a441;
                    ">
                        ♟
                    </div>

                    <p>
                        No members found.
                    </p>
                </div>
            </div>
        `;

        memberResultText.textContent =
            "0 members.";

        return;
    }


    membersGrid.innerHTML =
        visible
            .map(username => {

                const safe =
                    escapeHTML(username);

                const avatar =
                    initial(username);

                const profile =
                    `https://www.chess.com/member/${encodeURIComponent(username)}`;


                return `

                    <a
                        class="member-card"
                        href="${profile}"
                        target="_blank"
                        rel="noopener"
                    >

                        <div class="member-avatar">
                            ${avatar}
                        </div>

                        <div style="min-width:0">

                            <div class="member-name">
                                ${safe}
                            </div>

                            <div class="member-label">
                                Chess.com Member
                            </div>

                        </div>

                    </a>

                `;

            })
            .join("");


    memberResultText.textContent =
        members.length > limit
            ? `Showing ${formatNumber(limit)} of ${formatNumber(members.length)} members.`
            : `${formatNumber(members.length)} members loaded.`;
}


/* =========================================================
   LOAD CLUB MATCHES
========================================================= */

async function loadMatches() {

    if (!eventsGrid) {
        return;
    }


    eventsGrid.innerHTML = `
        <div class="loading-card">
            <div>
                <div class="loader"></div>
                <p>Loading live club events...</p>
            </div>
        </div>
    `;


    try {

        const data =
            await fetchJSON(API.matches);


        matchData = {

            registered:
                data.registered || [],

            in_progress:
                data.in_progress || [],

            finished:
                data.finished || []

        };


        const active = [
            ...matchData.in_progress
                .map(match => ({
                    ...match,
                    status: "LIVE"
                })),

            ...matchData.registered
                .map(match => ({
                    ...match,
                    status: "UPCOMING"
                }))
        ];


        /*
         * Only display active/upcoming events.
         */

        renderMatches(active);


        if (matchCount) {

            matchCount.textContent =
                formatNumber(
                    matchData.in_progress.length
                );

        }


    } catch (error) {

        console.error(
            "Matches API error:",
            error
        );


        eventsGrid.innerHTML = `

            <div class="loading-card">

                <div>

                    <div style="
                        font-size:35px;
                        color:#d9a441;
                    ">
                        ⚔
                    </div>

                    <p>
                        Live club events are unavailable.
                    </p>

                    <a
                        href="https://www.chess.com/clubs/matches/open"
                        target="_blank"
                        rel="noopener"
                        style="
                            display:inline-block;
                            margin-top:10px;
                            color:#f2c96b;
                        "
                    >
                        Open Chess.com Matches →
                    </a>

                </div>

            </div>

        `;

    }
}


/* =========================================================
   RENDER MATCHES
========================================================= */

function renderMatches(
    matches
) {

    if (!matches.length) {

        eventsGrid.innerHTML = `

            <article class="event-card">

                <div class="event-date">

                    <span>LIVE</span>

                    <strong>♛</strong>

                </div>

                <div class="event-info">

                    <div class="event-type">
                        NO ACTIVE MATCHES
                    </div>

                    <h3>
                        The board is waiting.
                    </h3>

                    <p>
                        There are currently no registered
                        or in-progress club matches.
                    </p>

                    <a
                        href="${CHESS_CLUB}"
                        target="_blank"
                        rel="noopener"
                    >
                        Check The Crown →
                    </a>

                </div>

            </article>

        `;

        if (eventsStatus) {

            eventsStatus.textContent =
                "No active events right now.";

        }

        return;
    }


    eventsGrid.innerHTML =
        matches
            .slice(0, 12)
            .map(match => {

                const name =
                    escapeHTML(
                        match.name ||
                        "Club Match"
                    );


                const opponent =
                    match.opponent
                        ? match.opponent
                        : null;


                let opponentName =
                    "Chess.com Club";


                if (opponent) {

                    opponentName =
                        opponent
                            .split("/")
                            .filter(Boolean)
                            .pop() ||
                        "Opponent";

                }


                opponentName =
                    escapeHTML(
                        opponentName
                    );


                const status =
                    match.status === "LIVE"
                        ? "LIVE NOW"
                        : "UPCOMING";


                const statusClass =
                    match.status === "LIVE"
                        ? "live"
                        : "upcoming";


                const time =
                    match.start_time
                        ? formatDate(
                            match.start_time
                        )
                        : "Start time unavailable";


                return `

                    <article class="
                        event-card
                        dynamic-event
                    ">

                        <div class="
                            event-date
                            ${statusClass}
                        ">

                            <span>
                                ${status}
                            </span>

                            <strong>
                                ${match.status === "LIVE"
                                    ? "⚡"
                                    : "♛"}
                            </strong>

                        </div>


                        <div class="event-info">

                            <div class="event-type">
                                CLUB MATCH
                            </div>

                            <h3>
                                ${name}
                            </h3>

                            <p>
                                Opponent:
                                <strong>
                                    ${opponentName}
                                </strong>
                            </p>

                            <p>
                                ${time}
                            </p>

                            <a
                                href="${matchURL(match)}"
                                target="_blank"
                                rel="noopener"
                            >
                                ${
                                    match.status === "LIVE"
                                        ? "Watch / Join →"
                                        : "View Event →"
                                }
                            </a>

                        </div>

                    </article>

                `;

            })
            .join("");


    if (eventsStatus) {

        const live =
            matchData.in_progress.length;

        const upcoming =
            matchData.registered.length;


        eventsStatus.textContent =
            `${live} live • ${upcoming} upcoming`;
    }
}


/* =========================================================
   SEARCH
========================================================= */

if (memberSearch) {

    memberSearch.addEventListener(
        "input",
        () => {

            const query =
                memberSearch.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                renderMembers(
                    allMembers
                );

                return;
            }


            const filtered =
                allMembers.filter(
                    username =>
                        username
                            .toLowerCase()
                            .includes(query)
                );


            renderMembers(
                filtered
            );

            memberResultText.textContent =
                `${filtered.length} matching members.`;

        }
    );

}


/* =========================================================
   MANUAL REFRESH
========================================================= */

if (refreshMembers) {

    refreshMembers.addEventListener(
        "click",
        async () => {

            refreshMembers.disabled =
                true;

            refreshMembers.textContent =
                "↻ Updating...";


            await Promise.all([
                loadClub(),
                loadMembers(),
                loadMatches()
            ]);


            refreshMembers.disabled =
                false;

            refreshMembers.textContent =
                "↻ Refresh";

        }
    );

}


/* =========================================================
   AUTOMATIC REFRESH
========================================================= */

/*
 * Website checks the API every 30 minutes.
 *
 * IMPORTANT:
 * Chess.com's PubAPI itself may cache data
 * for up to 12 hours.
 */

const AUTO_REFRESH =
    30 * 60 * 1000;


setInterval(
    async () => {

        console.log(
            "[Crown] Automatic update..."
        );


        await Promise.all([
            loadClub(),
            loadMembers(),
            loadMatches()
        ]);

    },
    AUTO_REFRESH
);


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuButton && mobileMenu) {

    menuButton.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "open"
            );

        }
    );


    document
        .querySelectorAll(
            ".mobile-menu a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileMenu.classList.remove(
                        "open"
                    );

                }
            );

        });

}


/* =========================================================
   ESCAPE MENU
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            mobileMenu
        ) {

            mobileMenu.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   YEAR
========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   INITIAL LOAD
========================================================= */

async function init() {

    console.log(
        "♛ The Crown Chess Society V1.5"
    );

    await Promise.all([
        loadClub(),
        loadMembers(),
        loadMatches()
    ]);

}


init();
