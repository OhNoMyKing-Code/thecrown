/* =========================================================
   THE CROWN CHESS SOCIETY
   V2 — LIVE CHESS.COM SYSTEM
========================================================= */


const CLUB_SLUG =
    "the-crown-chess-society";


const API = {

    club:
        `https://api.chess.com/pub/club/${CLUB_SLUG}`,

    members:
        `https://api.chess.com/pub/club/${CLUB_SLUG}/members`,

    matches:
        `https://api.chess.com/pub/club/${CLUB_SLUG}/matches`

};


const CHESS_CLUB =
    "https://www.chess.com/club/the-crown-chess-society";


/* =========================================================
   DOM
========================================================= */

const $ = id =>
    document.getElementById(id);


const memberCount =
    $("memberCount");

const liveCount =
    $("liveCount");

const upcomingCount =
    $("upcomingCount");

const finishedCount =
    $("finishedCount");


const heroMembers =
    $("heroMembers");

const heroLive =
    $("heroLive");


const membersGrid =
    $("membersGrid");

const memberSearch =
    $("memberSearch");

const memberResultText =
    $("memberResultText");


const teamGrid =
    $("teamGrid");


const eventsGrid =
    $("eventsGrid");

const eventsStatus =
    $("eventsStatus");


const apiStatus =
    $("apiStatus");


const refreshButton =
    $("refreshButton");


const menuButton =
    $("menuButton");

const mobileMenu =
    $("mobileMenu");


const currentYear =
    $("currentYear");


/* =========================================================
   STATE
========================================================= */

let allMembers = [];

let currentMatches = {

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

    return Number(value)
        .toLocaleString("en-US");

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


function getUsernameFromURL(url) {

    if (!url) {
        return null;
    }

    try {

        const parsed =
            new URL(url);

        const parts =
            parsed.pathname
                .split("/")
                .filter(Boolean);

        return (
            parts[parts.length - 1] ||
            null
        );

    } catch {

        return null;

    }

}


function getInitial(username) {

    return (
        username
            ?.charAt(0)
            ?.toUpperCase() ||
        "?"
    );

}


function formatDate(timestamp) {

    if (!timestamp) {

        return "Time unavailable";

    }

    return new Date(
        timestamp * 1000
    ).toLocaleString(
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


function getMatchURL(match) {

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

    apiStatus.innerHTML = `

        <span
            class="status-dot"
            style="
                background:
                    ${online
                        ? "#5fd38b"
                        : "#d86b6b"};

                box-shadow:
                    0 0 10px
                    ${
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
   FETCH
========================================================= */

async function fetchJSON(url) {

    const response =
        await fetch(
            url,
            {
                method: "GET",

                headers: {
                    "Accept":
                        "application/json"
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
            await fetchJSON(
                API.club
            );


        /* -----------------------------------------
           MEMBERS COUNT
        ----------------------------------------- */

        const members =
            Number(
                data.members_count ??
                0
            );


        memberCount.textContent =
            formatNumber(
                members
            );


        heroMembers.textContent =
            formatNumber(
                members
            );


        /* -----------------------------------------
           ADMIN
        ----------------------------------------- */

        renderAdmins(
            data.admin || []
        );


        /* -----------------------------------------
           STATUS
        ----------------------------------------- */

        setAPIStatus(
            "Live data connected to Chess.com",
            true
        );


    } catch(error) {

        console.error(
            "Club API:",
            error
        );


        memberCount.textContent =
            "—";


        heroMembers.textContent =
            "—";


        renderAdmins([]);


        setAPIStatus(
            "Chess.com data temporarily unavailable",
            false
        );

    }

}


/* =========================================================
   RENDER ADMINS
========================================================= */

function renderAdmins(
    admins
) {

    if (!teamGrid) {
        return;
    }


    if (!admins.length) {

        teamGrid.innerHTML = `

            <article class="team-card">

                <div class="team-crown">
                    ♛
                </div>

                <div class="team-role">
                    CLUB ADMINISTRATION
                </div>

                <h3>
                    The Crown Team
                </h3>

                <p>
                    Open Chess.com club page
                    for current administration.
                </p>

                <a
                    href="${CHESS_CLUB}"
                    target="_blank"
                    rel="noopener"
                >
                    View on Chess.com →
                </a>

            </article>

        `;

        return;

    }


    const adminUsernames =
        admins
            .map(
                item =>
                    typeof item === "string"
                        ? getUsernameFromURL(item) || item
                        : item.username
            )
            .filter(Boolean);


    const unique =
        [...new Set(adminUsernames)];


    teamGrid.innerHTML =
        unique
            .map(
                username => {

                    const safe =
                        escapeHTML(
                            username
                        );


                    const profile =
                        `https://www.chess.com/member/${encodeURIComponent(username)}`;


                    return `

                        <article
                            class="team-card"
                        >

                            <div class="team-crown">
                                ♜
                            </div>

                            <div class="team-role">
                                ADMIN
                            </div>

                            <h3>
                                ${safe}
                            </h3>

                            <p>
                                Club Administration
                            </p>

                            <a
                                href="${profile}"
                                target="_blank"
                                rel="noopener"
                            >
                                Chess.com Profile →
                            </a>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   LOAD MEMBERS
========================================================= */

async function loadMembers() {

    membersGrid.innerHTML = `

        <div class="loading-card">

            <div>

                <div class="loader"></div>

                <p>
                    Updating members...
                </p>

            </div>

        </div>

    `;


    try {

        const data =
            await fetchJSON(
                API.members
            );


        /*
         * The endpoint returns:
         *
         * weekly
         * monthly
         * all_time
         *
         * Each item contains username + joined.
         */


        const combined = [

            ...(data.weekly || []),

            ...(data.monthly || []),

            ...(data.all_time || [])

        ];


        const unique =
            new Map();


        combined.forEach(
            member => {

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

            }
        );


        allMembers =
            Array.from(
                unique.values()
            );


        allMembers.sort(
            (a,b) =>
                a.localeCompare(
                    b,
                    undefined,
                    {
                        sensitivity:
                            "base"
                    }
                )
        );


        renderMembers(
            allMembers
        );


    } catch(error) {

        console.error(
            "Members API:",
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
        members.slice(
            0,
            limit
        );


    if (!visible.length) {

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
            .map(
                username => {

                    const safe =
                        escapeHTML(
                            username
                        );


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

                                ${escapeHTML(
                                    getInitial(
                                        username
                                    )
                                )}

                            </div>


                            <div
                                style="
                                    min-width:0
                                "
                            >

                                <div
                                    class="member-name"
                                >
                                    ${safe}
                                </div>

                                <div
                                    class="member-label"
                                >
                                    Chess.com Member
                                </div>

                            </div>

                        </a>

                    `;

                }
            )
            .join("");


    memberResultText.textContent =

        members.length > limit

            ? `Showing ${formatNumber(limit)} of ${formatNumber(members.length)} members.`

            : `${formatNumber(members.length)} members loaded.`;

}


/* =========================================================
   LOAD MATCHES
========================================================= */

async function loadMatches() {

    eventsGrid.innerHTML = `

        <div class="loading-card">

            <div>

                <div class="loader"></div>

                <p>
                    Loading live matches...
                </p>

            </div>

        </div>

    `;


    try {

        const data =
            await fetchJSON(
                API.matches
            );


        currentMatches = {

            registered:
                Array.isArray(
                    data.registered
                )
                    ? data.registered
                    : [],


            in_progress:
                Array.isArray(
                    data.in_progress
                )
                    ? data.in_progress
                    : [],


            finished:
                Array.isArray(
                    data.finished
                )
                    ? data.finished
                    : []

        };


        /* -----------------------------------------
           STATS
        ----------------------------------------- */

        const live =
            currentMatches
                .in_progress.length;


        const upcoming =
            currentMatches
                .registered.length;


        const finished =
            currentMatches
                .finished.length;


        liveCount.textContent =
            formatNumber(
                live
            );


        upcomingCount.textContent =
            formatNumber(
                upcoming
            );


        finishedCount.textContent =
            formatNumber(
                finished
            );


        heroLive.textContent =
            formatNumber(
                live
            );


        /* -----------------------------------------
           EVENTS
        ----------------------------------------- */

        renderMatches();


    } catch(error) {

        console.error(
            "Matches API:",
            error
        );


        liveCount.textContent =
            "—";


        upcomingCount.textContent =
            "—";


        finishedCount.textContent =
            "—";


        heroLive.textContent =
            "—";


        eventsGrid.innerHTML = `

            <div class="loading-card">

                <div>

                    <div style="
                        font-size:36px;
                        color:#d9a441;
                    ">
                        ⚔
                    </div>

                    <p>
                        Match data unavailable.
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


        eventsStatus.textContent =
            "Unable to load live match data.";

    }

}


/* =========================================================
   RENDER MATCHES
========================================================= */

function renderMatches() {

    const live =
        currentMatches.in_progress
            .map(
                match => ({
                    ...match,
                    crownStatus: "LIVE"
                })
            );


    const upcoming =
        currentMatches.registered
            .map(
                match => ({
                    ...match,
                    crownStatus: "UPCOMING"
                })
            );


    const active = [
        ...live,
        ...upcoming
    ];


    /*
     * If nothing is currently live/upcoming,
     * show recent finished matches instead.
     */


    if (!active.length) {

        const recent =
            currentMatches.finished
                .slice(0,6)
                .map(
                    match => ({
                        ...match,
                        crownStatus:
                            "FINISHED"
                    })
                );


        if (recent.length) {

            renderMatchCards(
                recent
            );


            eventsStatus.textContent =
                "No live matches right now • Showing recent finished matches.";

            return;

        }


        eventsGrid.innerHTML = `

            <article class="event-card">

                <div class="event-date">

                    <span>
                        READY
                    </span>

                    <strong>
                        ♛
                    </strong>

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
                        or in-progress matches.
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


        eventsStatus.textContent =
            "No active or upcoming matches.";

        return;

    }


    renderMatchCards(
        active
    );


    eventsStatus.textContent =
        `${currentMatches.in_progress.length} live • ${currentMatches.registered.length} upcoming`;

}


/* =========================================================
   MATCH CARDS
========================================================= */

function renderMatchCards(
    matches
) {

    eventsGrid.innerHTML =
        matches
            .slice(0,12)
            .map(
                match => {

                    const name =
                        escapeHTML(
                            match.name ||
                            "Club Match"
                        );


                    const opponentURL =
                        match.opponent ||
                        "";


                    const opponent =
                        getUsernameFromURL(
                            opponentURL
                        ) ||
                        "Opponent";


                    const safeOpponent =
                        escapeHTML(
                            opponent
                        );


                    const status =
                        match.crownStatus;


                    const isLive =
                        status === "LIVE";


                    const isFinished =
                        status === "FINISHED";


                    const date =
                        formatDate(
                            match.start_time
                        );


                    const url =
                        getMatchURL(
                            match
                        );


                    return `

                        <article
                            class="event-card"
                        >

                            <div
                                class="
                                    event-date
                                    ${isLive
                                        ? "live"
                                        : ""}
                                "
                            >

                                <span>

                                    ${
                                        isLive
                                            ? "LIVE NOW"
                                            : status
                                    }

                                </span>


                                <strong>

                                    ${
                                        isLive
                                            ? "⚡"
                                            : isFinished
                                                ? "✓"
                                                : "♛"
                                    }

                                </strong>

                            </div>


                            <div
                                class="event-info"
                            >

                                <div
                                    class="event-type"
                                >

                                    ${
                                        isLive
                                            ? "LIVE CLUB MATCH"
                                            : isFinished
                                                ? "FINISHED MATCH"
                                                : "UPCOMING CLUB MATCH"
                                    }

                                </div>


                                <h3>
                                    ${name}
                                </h3>


                                <p>

                                    Opponent:

                                    <strong>
                                        ${safeOpponent}
                                    </strong>

                                </p>


                                <p>
                                    ${date}
                                </p>


                                <a
                                    href="${url}"
                                    target="_blank"
                                    rel="noopener"
                                >

                                    ${
                                        isLive
                                            ? "Watch / Join →"
                                            : isFinished
                                                ? "View Match →"
                                                : "View Event →"
                                    }

                                </a>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   MEMBER SEARCH
========================================================= */

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


/* =========================================================
   REFRESH
========================================================= */

refreshButton.addEventListener(
    "click",
    async () => {

        refreshButton.disabled =
            true;


        refreshButton.textContent =
            "↻ Updating...";


        await Promise.all([

            loadClub(),

            loadMembers(),

            loadMatches()

        ]);


        refreshButton.disabled =
            false;


        refreshButton.textContent =
            "↻ Refresh";

    }
);


/* =========================================================
   AUTO UPDATE
========================================================= */

const REFRESH_TIME =
    30 * 60 * 1000;


setInterval(
    async () => {

        console.log(
            "♛ The Crown: automatic update"
        );


        await Promise.all([

            loadClub(),

            loadMembers(),

            loadMatches()

        ]);

    },
    REFRESH_TIME
);


/* =========================================================
   MOBILE MENU
========================================================= */

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
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    mobileMenu
                        .classList
                        .remove("open");

                }
            );

        }
    );


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            mobileMenu
                .classList
                .remove("open");

        }

    }
);


/* =========================================================
   YEAR
========================================================= */

currentYear.textContent =
    new Date().getFullYear();


/* =========================================================
   INITIAL LOAD
========================================================= */

async function init() {

    console.log(
        "♛ The Crown Chess Society V2"
    );


    await Promise.all([

        loadClub(),

        loadMembers(),

        loadMatches()

    ]);

}


init();
