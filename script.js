const CLUB = "the-crown-chess-society";

const API = {
  club: `https://api.chess.com/pub/club/${CLUB}`,
  members: `https://api.chess.com/pub/club/${CLUB}/members`,
  matches: `https://api.chess.com/pub/club/${CLUB}/matches`
};

const CHESS_CLUB =
  "https://www.chess.com/club/the-crown-chess-society";

let members = [];
let matches = {
  registered: [],
  in_progress: [],
  finished: []
};


/* =========================
   HELPERS
========================= */

const $ = id =>
  document.getElementById(id);

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text ?? "";

  return div.innerHTML;
}

function number(value) {

  return Number(value || 0)
    .toLocaleString("en-US");

}

function usernameFromURL(url) {

  if (!url) return null;

  try {

    const u = new URL(url);

    const parts =
      u.pathname
        .split("/")
        .filter(Boolean);

    return parts.at(-1);

  } catch {

    return null;

  }

}

async function getJSON(url) {

  const response =
    await fetch(
      url,
      {
        cache: "no-store"
      }
    );

  if (!response.ok) {

    throw new Error(
      `${response.status}`
    );

  }

  return response.json();

}


/* =========================
   CLUB
========================= */

async function loadClub() {

  try {

    const data =
      await getJSON(API.club);

    const count =
      data.members_count || 0;

    $("membersCount").textContent =
      number(count);

    $("heroMembers").textContent =
      number(count);

    $("apiStatus").innerHTML =
      `<span class="green-dot"></span>
       Chess.com connected`;

    renderAdmins(
      data.admin || []
    );

  } catch(error) {

    console.error(error);

    $("apiStatus").textContent =
      "Chess.com API unavailable";

    renderAdmins([]);

  }

}


/* =========================
   ADMINS
========================= */

function renderAdmins(admins) {

  const grid =
    $("adminGrid");

  if (!admins.length) {

    grid.innerHTML = `
      <div class="loading">
        Administration unavailable.
        <br><br>
        <a
          href="${CHESS_CLUB}"
          target="_blank"
          style="color:#f4cf73"
        >
          View Chess.com Club →
        </a>
      </div>
    `;

    return;

  }

  const names =
    admins
      .map(item => {

        if (
          typeof item === "string"
        ) {

          return (
            usernameFromURL(item) ||
            item
          );

        }

        return item.username;

      })
      .filter(Boolean);


  const unique =
    [...new Set(names)];


  grid.innerHTML =
    unique.map(name => {

      const safe =
        escapeHTML(name);

      const profile =
        `https://www.chess.com/member/${encodeURIComponent(name)}`;

      return `
        <article class="admin">

          <div class="admin-icon">
            ♛
          </div>

          <div class="admin-role">
            CLUB ADMIN
          </div>

          <h3>
            ${safe}
          </h3>

          <p>
            The Crown Chess Society
          </p>

          <a
            href="${profile}"
            target="_blank"
          >
            Chess.com Profile →
          </a>

        </article>
      `;

    }).join("");

}


/* =========================
   MEMBERS
========================= */

async function loadMembers() {

  const grid =
    $("membersGrid");

  grid.innerHTML =
    `<div class="loading">
      Loading members...
    </div>`;

  try {

    const data =
      await getJSON(API.members);

    const combined = [

      ...(data.weekly || []),
      ...(data.monthly || []),
      ...(data.all_time || [])

    ];

    const unique =
      new Map();

    combined.forEach(member => {

      const name =
        typeof member === "string"
          ? member
          : member.username;

      if (!name) return;

      unique.set(
        name.toLowerCase(),
        name
      );

    });

    members =
      [...unique.values()]
        .sort(
          (a,b) =>
            a.localeCompare(
              b,
              undefined,
              {
                sensitivity: "base"
              }
            )
        );

    renderMembers(members);

  } catch(error) {

    console.error(error);

    grid.innerHTML =
      `<div class="loading">
        Unable to load members.
        <br><br>
        <a
          href="${CHESS_CLUB}"
          target="_blank"
          style="color:#f4cf73"
        >
          Open Chess.com →
        </a>
      </div>`;

  }

}


function renderMembers(list) {

  const grid =
    $("membersGrid");

  const shown =
    list.slice(0,48);

  if (!shown.length) {

    grid.innerHTML =
      `<div class="loading">
        No members found.
      </div>`;

    $("memberInfo").textContent =
      "0 members.";

    return;

  }

  grid.innerHTML =
    shown.map(name => {

      const safe =
        escapeHTML(name);

      const profile =
        `https://www.chess.com/member/${encodeURIComponent(name)}`;

      const initial =
        escapeHTML(
          name.charAt(0).toUpperCase()
        );

      return `
        <a
          class="member"
          href="${profile}"
          target="_blank"
        >

          <div class="avatar">
            ${initial}
          </div>

          <div>
            <div class="member-name">
              ${safe}
            </div>

            <div class="member-sub">
              Chess.com Member
            </div>
          </div>

        </a>
      `;

    }).join("");

  $("memberInfo").textContent =
    list.length > 48
      ? `Showing 48 of ${number(list.length)} members.`
      : `${number(list.length)} members loaded.`;

}


/* =========================
   MATCHES
========================= */

async function loadMatches() {

  const grid =
    $("matchesGrid");

  try {

    const data =
      await getJSON(API.matches);

    matches = {

      registered:
        data.registered || [],

      in_progress:
        data.in_progress || [],

      finished:
        data.finished || []

    };

    $("liveCount").textContent =
      number(matches.in_progress.length);

    $("upcomingCount").textContent =
      number(matches.registered.length);

    $("finishedCount").textContent =
      number(matches.finished.length);

    $("heroLive").textContent =
      number(matches.in_progress.length);

    renderMatches();

  } catch(error) {

    console.error(error);

    $("liveCount").textContent = "—";
    $("upcomingCount").textContent = "—";
    $("finishedCount").textContent = "—";
    $("heroLive").textContent = "—";

    grid.innerHTML =
      `<div class="loading">
        Match data unavailable.
        <br><br>
        <a
          href="https://www.chess.com/clubs/matches/open"
          target="_blank"
          style="color:#f4cf73"
        >
          Open Chess.com Matches →
        </a>
      </div>`;

  }

}


function renderMatches() {

  const grid =
    $("matchesGrid");

  let list = [

    ...matches.in_progress.map(x => ({
      ...x,
      status: "LIVE"
    })),

    ...matches.registered.map(x => ({
      ...x,
      status: "UPCOMING"
    }))

  ];


  if (!list.length) {

    list =
      matches.finished
        .slice(0,6)
        .map(x => ({
          ...x,
          status: "FINISHED"
        }));

  }


  if (!list.length) {

    grid.innerHTML =
      `<div class="loading">
        ♛
        <br><br>
        No active matches right now.
      </div>`;

    return;

  }


  grid.innerHTML =
    list.slice(0,12).map(match => {

      const name =
        escapeHTML(
          match.name || "Club Match"
        );

      const opponent =
        escapeHTML(
          usernameFromURL(
            match.opponent
          ) || "Opponent"
        );

      const url =
        match.url ||
        match["@id"] ||
        "https://www.chess.com/clubs/matches/open";

      const live =
        match.status === "LIVE";

      let date = "";

      if (match.start_time) {

        date =
          new Date(
            match.start_time * 1000
          ).toLocaleString(
            "vi-VN"
          );

      }

      return `
        <article class="match">

          <div class="match-status ${live ? "live" : ""}">

            <small>
              ${match.status}
            </small>

            <strong>
              ${live ? "⚡" : "♛"}
            </strong>

          </div>

          <div>

            <div class="match-type">
              ${live
                ? "LIVE CLUB MATCH"
                : match.status === "UPCOMING"
                  ? "UPCOMING MATCH"
                  : "FINISHED MATCH"}
            </div>

            <h3>
              ${name}
            </h3>

            <p>
              Opponent:
              <b>${opponent}</b>
            </p>

            <p>
              ${date}
            </p>

            <a
              href="${url}"
              target="_blank"
            >
              ${live
                ? "Watch Match →"
                : "View Match →"}
            </a>

          </div>

        </article>
      `;

    }).join("");

}


/* =========================
   SEARCH
========================= */

$("memberSearch")
  .addEventListener(
    "input",
    event => {

      const query =
        event.target.value
          .trim()
          .toLowerCase();

      if (!query) {

        renderMembers(members);

        return;

      }

      renderMembers(
        members.filter(
          name =>
            name
              .toLowerCase()
              .includes(query)
        )
      );

    }
  );


/* =========================
   REFRESH
========================= */

$("refreshBtn")
  .addEventListener(
    "click",
    async () => {

      const btn =
        $("refreshBtn");

      btn.disabled = true;

      btn.textContent =
        "↻ Updating...";

      await Promise.all([
        loadClub(),
        loadMembers(),
        loadMatches()
      ]);

      btn.disabled = false;

      btn.textContent =
        "↻ Refresh";

    }
  );


/* =========================
   MOBILE
========================= */

$("menuBtn")
  .addEventListener(
    "click",
    () => {

      $("mobileMenu")
        .classList
        .toggle("open");

    }
  );


/* =========================
   AUTO UPDATE
========================= */

setInterval(
  () => {

    loadClub();
    loadMembers();
    loadMatches();

  },
  30 * 60 * 1000
);


/* =========================
   YEAR
========================= */

$("year").textContent =
  new Date().getFullYear();


/* =========================
   START
========================= */

loadClub();
loadMembers();
loadMatches();
