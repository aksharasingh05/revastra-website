const SUPABASE_URL = "https://lxnedrpyrqywelpjlvyj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IA1_Ixqe1hcwTG8RSzbtsQ_STvIgYIA";

const supabaseReady = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase,
);

const db = supabaseReady
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

(async function testSupabase() {
  if (!db) {
    console.error("Supabase client not initialized");
    return;
  }

  const { data, error } = await db.from("donations").select("id").limit(1);

  if (error) {
    console.error("Supabase connection test:", error.message);
  } else {
    console.log("Supabase connected successfully!", data);
  }
})();

const A = "/assets/";

const categories = [
  "Outerwear",
  "Knitwear",
  "Dresses",
  "Shirts & Tops",
  "Denim",
  "Kidswear",
  "Footwear",
  "Accessories",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Kids", "Mixed"];
const conditions = ["Like new", "Gently used", "Well loved"];

const steps = [
  [
    "1",
    "Submit Your Donation",
    "Fill in a short form with the clothing type, condition and quantity.",
  ],
  [
    "2",
    "Schedule a Pickup",
    "Choose a pickup date and address. A volunteer collects from your door.",
  ],
  [
    "3",
    "Make an Impact",
    "Clothes are sorted and given to families, shelters and partner NGOs.",
  ],
];

const faqs = [
  ["Is pickup free?", "Yes. Pickups are free within our service area."],
  [
    "How do I know where my clothes went?",
    "Each donation has a status — Pending, Approved, Pickup Scheduled, Collected and Distributed — visible in your dashboard.",
  ],
  [
    "Can a request be rejected?",
    "If items don't meet our guidelines, an admin may reject the request and you'll be notified.",
  ],
];

const cleanPath =
  location.pathname.replace(/index\.html$/i, "").replace(/\/+$/, "") || "/";

const path = cleanPath;
const routeName = path === "/" ? "home" : path.slice(1).split("/")[0];
const page = routeName === "track" ? "track" : routeName;

function esc(s = "") {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function navLink(href, label) {
  return `<a href="${href}" class="${path === href ? "active" : ""}">${label}</a>`;
}

function header() {
  return `
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="/">
          <img
            src="/favicon.svg"
            alt="ReVastra"
            class="brand-logo"
          />
          ReVastra
        </a>

        <nav class="nav-links">
          ${navLink("/", "Home")}
          ${navLink("/how-it-works", "How It Works")}
          ${navLink("/about", "About Us")}
          ${navLink("/dashboard", "My Donations")}
          ${navLink("/admin", "Admin")}

          <a href="/login" data-auth-link>Login</a>

          <a class="btn btn-dark" href="/donate/">
            Donate Clothes
          </a>
        </nav>

        <button class="menu-toggle" id="menuToggle" aria-label="Open menu">
          ☰
        </button>
      </div>

      <nav class="mobile-links" id="mobileLinks">
        ${navLink("/", "Home")}
        ${navLink("/how-it-works", "How It Works")}
        ${navLink("/about", "About Us")}
        ${navLink("/dashboard", "My Donations")}
        ${navLink("/admin", "Admin")}

        <a href="/login" data-auth-link>Login</a>

        <a class="btn btn-dark" href="/donate/">Donate Clothes</a>
      </nav>
    </header>
  `;
}

function updateAuthNavigation(user) {
  document.querySelectorAll("[data-auth-link]").forEach((link) => {
    if (user) {
      link.href = "/";
      link.dataset.authAction = "logout";

      link.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="vertical-align: middle; margin-right: 5px;"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      `;
    } else {
      link.href = "/login";
      link.dataset.authAction = "login";
      link.textContent = "Login";
    }
  });
}

// Initial authentication and landing-page routing
document.addEventListener("DOMContentLoaded", async () => {
  if (!db) {
    if (path === "/") {
      location.replace("/login/");
    }
    return;
  }

  const { data, error } = await db.auth.getSession();

  if (error) {
    console.error("Could not check login session:", error.message);

    if (path === "/") {
      location.replace("/login/");
    }
    return;
  }

  const user = data.session?.user ?? null;

  updateAuthNavigation(user);

  // Logged-out visitors opening the website go to Login.
  if (path === "/" && !user) {
    location.replace("/login/");
    return;
  }

  // Already logged-in users should not see Login again.
  if (page === "login" && user) {
    location.replace("/");
  }
});

// Update navbar whenever authentication changes
if (db) {
  db.auth.onAuthStateChange((event, session) => {
    updateAuthNavigation(session?.user ?? null);
  });
}

// Logout click handler
document.addEventListener("click", async (e) => {
  const link = e.target.closest('[data-auth-action="logout"]');

  if (!link) return;

  e.preventDefault();

  const { error } = await db.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
    return;
  }

  window.location.href = "/";
});

function footer() {
  return `<footer class="footer"><div class="container footer-grid"><div><strong style="font-size:21px">ReVastra</strong><p style="max-width:370px;margin-top:10px;opacity:.75">A simple way to donate pre-loved clothes, schedule a pickup, and see the difference you make.</p></div><div><strong>Quick links</strong><a href="/donate/">Donate clothes</a><a href="/how-it-works/">How it works</a><a href="/about/">About us</a><a href="/dashboard/">Track a donation</a></div></div><div class="container copyright">© 2026 ReVastra · Software Engineering Project</div></footer>`;
}

function shell(content) {
  return header() + `<main>${content}</main>` + footer();
}

function home() {
  return `<section class="container hero"><div><span class="pill">♡ Community clothing donation</span><h1 style="margin:20px 0 0">Give Your Clothes a <span class="accent">Second Life</span></h1><p>Instead of letting unused clothes go to waste, donate them to people who need them. Submit a request, schedule a free doorstep pickup, and track your donation every step of the way.</p><div class="actions"><a class="btn btn-dark" href="/donate/">Donate Now →</a><a class="btn btn-outline" href="/how-it-works/">How It Works</a></div></div><img src="${A}pickup.jpg" alt="A donor handing a box of folded clothes to a volunteer"></section>
<section class="section section-card"><div class="container"><h2 class="center">How it works</h2><p class="center muted">Three simple steps to donate.</p><div class="steps"><a class="step how-card" href="/donate/"><span class="number">1</span><h3>Submit Your Donation</h3><p>Fill in a short form with the clothing type, condition and quantity.</p><span class="card-action">Submit donation →</span></a><a class="step how-card" href="/schedule-pickup/"><span class="number">2</span><h3>Schedule a Pickup</h3><p>Choose a convenient pickup date and time, and provide your address and contact details.</p><span class="card-action">Schedule pickup →</span></a><article class="step"><span class="number">3</span><h3>Make an Impact</h3><p>Your pre-loved clothes find a new home and help someone in need.</p></article></div></div></section>
<section class="container section"><h2>What we accept</h2><div class="category-grid">${[
    [
      "<svg viewBox='0 0 24 24'><path d='M6.5 3 3 5l2 5 3-1v12h8V9l3 1 2-5-3.5-2-3 3h-5z'/></svg>",
      "Everyday wear",
      "Shirts, tops, jeans, kurtas",
    ],
    [
      "<svg viewBox='0 0 24 24'><path d='M12 2v20M4.93 6l14.14 12M4.93 18 19.07 6M2 12h20M8 3.5l4 3 4-3M8 20.5l4-3 4 3M3.5 8l3 4-3 4M20.5 8l-3 4 3 4'/></svg>",
      "Winter wear",
      "Sweaters, jackets, shawls",
    ],
    [
      "<svg viewBox='0 0 24 24'><circle cx='12' cy='8' r='4'/><path d='M5 21v-2a7 7 0 0 1 14 0v2M9 8h.01M15 8h.01M10 11s1 1 2 1 2-1 2-1'/></svg>",
      "Kids' clothing",
      "All ages, school uniforms",
    ],
    [
      "<svg viewBox='0 0 24 24'><path d='M7 3c-2 0-3 2-3 5 0 4 2 6 3 9l1 4h4l-1-6c-.5-3-1-6-1-9 0-2-1-3-3-3ZM17 3c2 0 3 2 3 5 0 4-2 6-3 9l-1 4h-4l1-6c.5-3-1-6-1-9 0-2 1-3 3-3Z'/></svg>",
      "Footwear & bedding",
      "Shoes in pairs, blankets",
    ],
  ]
    .map(
      (c) =>
        `<article class="category"><div class="symbol">${c[0]}</div><strong>${c[1]}</strong><p>${c[2]}</p></article>`,
    )
    .join(
      "",
    )}</div><div class="guidelines"><div class="panel"><h3>Please donate</h3><ul>${["Clean and washed clothes", "Gently used, no major damage", "Folded and packed in a bag or box", "Shoes tied together in pairs"].map((x) => `<li class="good"><svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='9'/><path d='m8 12 2.5 2.5L16 9'/></svg>${x}</li>`).join("")}</ul></div><div class="panel"><h3>Please avoid</h3><ul>${["Torn, stained or damp items", "Undergarments or socks", "Items with strong odour", "Non-clothing household items"].map((x) => `<li class="bad"><svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='9'/><path d='m9 9 6 6m0-6-6 6'/></svg>${x}</li>`).join("")}</ul></div></div></section>
<section class="container"><div class="impact"><div><h2>Our impact so far</h2><p>Sample figures — these will update once real donation data is available.</p><div class="stats"><div class="stat">♧<strong>1,250+</strong><span>Clothes donated</span></div><div class="stat">▣<strong>320</strong><span>Donations completed</span></div><div class="stat">♡<strong>900+</strong><span>People helped</span></div></div><a class="btn" style="background:white;color:#29251f;margin-top:25px" href="/donate/">Start a donation →</a></div><img class="feature-img" src="${A}volunteers.jpg" alt="Volunteers sorting donated clothes into boxes"></div></section>`;
}

function about() {
  return `<section class="container hero"><div><h1>About ReVastra</h1><p>ReVastra — from <em>re</em> (again) and <em>vastra</em> (cloth) — is a clothing donation platform that makes it easy to pass on clothes you no longer wear.</p><p>Many usable clothes end up in landfill simply because donating feels like a hassle. We handle the pickup and keep you updated, while our volunteers and partner NGOs make sure every item reaches someone who needs it.</p></div><img src="${A}volunteers.jpg" alt="Volunteers sorting donated clothes"></section>`;
}

function how() {
  return `<section class="container page" style="max-width:1000px"><h1>How It Works</h1><p class="muted">Donating with ReVastra takes just a few minutes.</p><div class="steps how-steps">
<a class="step how-card" href="/donate/"><span class="number">1</span><h3>Submit Your Donation</h3><p>Fill in a short form with the clothing type, condition and quantity. Upload photos of the clothes you wish to donate.</p><span class="card-action">Submit donation →</span></a>
<a class="step how-card" href="/schedule-pickup/"><span class="number">2</span><h3>Schedule a Pickup</h3><p>Choose a convenient pickup date and time, and provide your address and contact details.</p><span class="card-action">Schedule pickup →</span></a>
<article class="step how-card"><span class="number">3</span><h3>Make an Impact</h3><p>Your pre-loved clothes find a new home and help someone in need. Track your donation journey from My Donations.</p><span class="card-action muted">Make a difference ♡</span></article>
</div><h2 style="margin-top:55px">Common questions</h2>${faqs.map((f) => `<div class="faq"><strong>${f[0]}</strong><p class="muted" style="margin:7px 0 0">${f[1]}</p></div>`).join("")}</section>`;
}

function donate() {
  return `<section class="container page page-grid"><aside><p class="eyebrow">Donate</p><h1 style="font-size:2.7rem;margin-top:12px">Pass it on, beautifully.</h1><p class="muted" style="margin-top:20px">A few details and we'll take care of the rest — pickup is always free.</p><img class="feature-img" style="margin-top:35px;aspect-ratio:4/5" src="${A}flatlay.jpg" alt="Camel coat and cream dress"></aside><form id="donationForm"><fieldset><legend>Clothing category</legend><div class="choice-row" id="categoryChoices">${categories.map((c, i) => `<button type="button" class="choice ${i === 0 ? "selected" : ""}" data-value="${c}">${c}</button>`).join("")}</div><input type="hidden" name="category" value="${categories[0]}"></fieldset><div class="form-grid"><label>Size<select class="field" name="size">${sizes.map((s) => `<option>${s}</option>`).join("")}</select></label><label>Quantity<input class="field" name="quantity" type="number" min="1" max="100" value="1" required></label></div><fieldset style="margin-top:30px"><legend>Condition</legend><div class="condition-grid" id="conditionChoices">${conditions.map((c, i) => `<button type="button" class="choice ${i === 0 ? "selected" : ""}" data-value="${c}">${c}</button>`).join("")}</div><input type="hidden" name="condition" value="${conditions[0]}"></fieldset><div style="margin:25px 0"><p class="display" style="font-size:24px">Photo</p><label class="upload" for="photoInput"><span id="photoLabel">＋ Upload a photo of your items</span><input id="photoInput" type="file" accept="image/*" multiple></label></div><p class="muted" style="margin-top:20px">After submitting your clothing details, you'll be taken to the separate pickup scheduling page.</p><button class="btn btn-dark" style="margin-top:12px">Continue to schedule pickup →</button><p id="donationMessage" class="message"></p></form></section>`;
}

function schedulePickup() {
  return `<section class="container page" style="max-width:900px"><p class="eyebrow">Pickup details</p><h1 style="font-size:2.8rem">Schedule your pickup</h1><p class="muted">Tell us where and when we should collect your donation.</p><form id="pickupForm" class="panel form-stack" style="margin-top:25px"><div class="form-grid"><label>Full name<input class="field" name="full_name" required maxlength="100" placeholder="Your name"></label><label>Contact number<input class="field" name="phone" type="tel" required pattern="(?:[0-9]|\\+|\\(|\\)| |-){8,18}" placeholder="+91 98765 43210"></label><label>Email address<input class="field" name="email" type="email" required placeholder="you@example.com"></label><label>City<input class="field" name="city" required placeholder="Your city"></label><label class="span-2">Pickup address<textarea class="field" name="pickup_address" rows="3" required placeholder="House/flat, street, area, landmark"></textarea></label><label>PIN code<input class="field" name="pincode" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required placeholder="6-digit PIN code"></label><label>Preferred pickup date<input class="field" type="date" name="pickup_date" min="${new Date().toISOString().slice(0, 10)}" required></label><label class="span-2">Preferred time slot<select class="field" name="pickup_time" required><option value="">Choose a time slot</option><option>9:00 AM – 12:00 PM</option><option>12:00 PM – 3:00 PM</option><option>3:00 PM – 6:00 PM</option></select></label><label class="span-2">Additional instructions (optional)<textarea class="field" name="instructions" rows="2" placeholder="Landmark, gate instructions, etc."></textarea></label></div><button class="btn btn-dark">Confirm pickup details</button><p id="pickupMessage" class="message"></p></form></section>`;
}

function login() {
  return `<section class="container page auth-grid"><img src="${A}folded.jpg" alt="Folded sweaters"><div><p class="eyebrow" id="authEyebrow">Welcome back</p><h1 id="authTitle" style="font-size:2.7rem">Sign in</h1><div class="tabs"><button type="button" class="active" data-mode="login">Sign in</button><button type="button" data-mode="register">Register</button></div><form id="authForm" class="form-stack"><label id="nameWrap" class="hidden">Full name<input class="field" name="full_name" maxlength="100" placeholder="Your name"></label><label>Email<input class="field" name="email" type="email" required maxlength="255" placeholder="you@example.com"></label><label>Password<input class="field" name="password" type="password" required minlength="6" placeholder="••••••••"></label><button class="btn btn-dark">Sign in</button></form><button type="button" id="googleLogin" class="btn btn-outline" style="width:100%;margin-top:12px">Continue with Google</button><p id="authMessage" class="message"></p></div></section>`;
}

function dashboard() {
  return `<section class="container page"><p class="eyebrow">Your account</p><h1 style="font-size:2.8rem">My Donations</h1><p class="muted">Your donation history, pickups and status tracking.</p><button type="button" id="logoutButton" class="btn btn-outline" style="margin-top:12px">Log out</button><div id="dashboardContent" class="panel" style="margin-top:25px">Loading your donations…</div></section>`;
}

function admin() {
  return `<section class="container page"><p class="eyebrow">Administration</p><h1 style="font-size:2.8rem">Donation management</h1><p class="muted">Review, approve and schedule ReVastra donations.</p><div id="adminContent" class="panel" style="margin-top:25px">Admin database access will be enabled when Supabase is connected.</div></section>`;
}

function track() {
  const id = decodeURIComponent(
    new URLSearchParams(location.search).get("ref") || path.split("/")[2] || "",
  );
  return `<section class="container page" style="max-width:850px"><p class="eyebrow">Donation tracking</p><h1>Track your donation</h1><p class="muted">Reference: ${esc(id)}</p><div id="trackContent" class="panel">Loading donation status…</div></section>`;
}

const views = {
  home,
  about,
  "how-it-works": how,
  donate,
  "schedule-pickup": schedulePickup,
  login,
  dashboard,
  admin,
  track,
};

document.getElementById("app").innerHTML = shell((views[page] || home)());

document
  .getElementById("menuToggle")
  ?.addEventListener("click", () =>
    document.getElementById("mobileLinks").classList.toggle("open"),
  );

if (page === "schedule-pickup") {
  (async () => {
    if (!db) {
      location.href = "/login/";
      return;
    }
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) {
      sessionStorage.setItem(
        "revastra_after_login",
        location.pathname + location.search,
      );
      location.href = "/login/";
      return;
    }
    if (!sessionStorage.getItem("revastra_pending_donation_id")) {
      location.href = "/donate/";
    }
  })();
}

function wireChoices(container, hiddenName) {
  const root = document.getElementById(container);

  root?.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => {
      root
        .querySelectorAll("button")
        .forEach((x) => x.classList.remove("selected"));

      b.classList.add("selected");

      root.parentElement.querySelector(`input[name="${hiddenName}"]`).value =
        b.dataset.value;
    }),
  );
}

wireChoices("categoryChoices", "category");
wireChoices("conditionChoices", "condition");

let selectedPhotos = [];

document.getElementById("photoInput")?.addEventListener("change", (e) => {
  selectedPhotos = Array.from(e.target.files || []);

  document.getElementById("photoLabel").textContent = selectedPhotos.length
    ? `${selectedPhotos.length} photo(s) selected: ${selectedPhotos.map((x) => x.name).join(", ")}`
    : "＋ Upload photos of your items";
});

// Complete pickup details for the donation created on the previous page.
document.getElementById("pickupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Capture the form element directly before any asynchronous work.
  const form = document.getElementById("pickupForm");
  const msg = document.getElementById("pickupMessage");

  if (!form || !msg) {
    console.error("Pickup form or message element was not found.");
    return;
  }

  const f = new FormData(form);

  if (!db) {
    msg.className = "message error";
    msg.textContent =
      "Supabase is not connected. Please refresh and try again.";
    return;
  }

  const donationId = sessionStorage.getItem("revastra_pending_donation_id");

  if (!donationId) {
    msg.className = "message error";
    msg.textContent =
      "No pending donation was found. Please submit your clothing donation again.";
    return;
  }

  const {
    data: { user },
    error: userError,
  } = await db.auth.getUser();

  if (userError || !user) {
    msg.className = "message error";
    msg.textContent = "Please log in before scheduling a pickup.";
    return;
  }

  const submitButton = form.querySelector(
    'button[type="submit"], button:not([type])',
  );

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Saving pickup…";
  }

  const { data: updatedDonation, error } = await db
    .from("donations")
    .update({
      full_name: f.get("full_name"),
      phone: f.get("phone"),
      email: f.get("email"),
      city: f.get("city"),
      pickup_address: f.get("pickup_address"),
      pincode: f.get("pincode"),
      preferred_pickup_date: f.get("pickup_date"),
      preferred_pickup_time: f.get("pickup_time"),
      instructions: f.get("instructions"),
      status: "scheduled",
    })
    .eq("id", donationId)
    .eq("donor_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    msg.className = "message error";
    msg.textContent = "Could not save pickup details: " + error.message;

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Confirm pickup details";
    }

    return;
  }

  if (!updatedDonation) {
    msg.className = "message error";
    msg.textContent =
      "The donation could not be found for this account. Please submit your donation again.";

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Confirm pickup details";
    }

    return;
  }

  sessionStorage.removeItem("revastra_pending_donation_id");

  location.href = "/dashboard/?saved=1";
});

// Keep old local demo records out of the cloud-backed dashboard.
if (page === "dashboard") {
  const box = document.getElementById("dashboardContent");

  if (box) {
    box.textContent = "Loading your donations…";
  }
}

let authMode = "login";

document.querySelectorAll("[data-mode]").forEach((b) =>
  b.addEventListener("click", () => {
    authMode = b.dataset.mode;

    document
      .querySelectorAll("[data-mode]")
      .forEach((x) => x.classList.toggle("active", x === b));

    document
      .getElementById("nameWrap")
      .classList.toggle("hidden", authMode !== "register");

    document.getElementById("nameWrap").querySelector("input").required =
      authMode === "register";

    document.getElementById("authEyebrow").textContent =
      authMode === "login" ? "Welcome back" : "Join ReVastra";

    document.getElementById("authTitle").textContent =
      authMode === "login" ? "Sign in" : "Create account";

    document.querySelector("#authForm button").textContent =
      authMode === "login" ? "Sign in" : "Create account";

    document.getElementById("authMessage").textContent = "";
  }),
);

document.getElementById("authForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formElement = e.currentTarget;
  const form = new FormData(formElement);
  const msg = document.getElementById("authMessage");

  if (!db) {
    msg.className = "message error";
    msg.textContent = "Supabase is not connected. Please refresh the page.";
    return;
  }

  const email = form.get("email");
  const password = form.get("password");
  const full_name = form.get("full_name");

  const button = formElement.querySelector(
    "button[type='submit'], button:not([type])",
  );

  if (button) {
    button.disabled = true;
    button.textContent = "Please wait…";
  }

  try {
    const result =
      authMode === "register"
        ? await db.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: location.origin,
              data: { full_name },
            },
          })
        : await db.auth.signInWithPassword({
            email,
            password,
          });

    if (result.error) {
      msg.className = "message error";
      msg.textContent = result.error.message;

      if (button) {
        button.disabled = false;
        button.textContent =
          authMode === "login" ? "Sign in" : "Create account";
      }
    } else if (authMode === "register" && !result.data.session) {
      msg.className = "message success";
      msg.textContent =
        "Account created. Check your email to confirm, then sign in.";

      if (button) {
        button.disabled = false;
        button.textContent = "Create account";
      }
    } else {
      const next = sessionStorage.getItem("revastra_after_login");
      sessionStorage.removeItem("revastra_after_login");

      location.replace(next || "/");
    }
  } catch (err) {
    msg.className = "message error";
    msg.textContent = err.message || "Authentication failed.";

    if (button) {
      button.disabled = false;
    }
  }
});

document.getElementById("googleLogin")?.addEventListener("click", async () => {
  if (!db) return;

  const msg = document.getElementById("authMessage");

  const { error } = await db.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: location.origin + "/",
    },
  });

  if (error) {
    msg.className = "message error";
    msg.textContent = error.message;
  }
});

document.getElementById("logoutButton")?.addEventListener("click", async () => {
  if (!db) return;

  const { error } = await db.auth.signOut();

  if (error) {
    alert("Could not log out: " + error.message);
    return;
  }

  location.href = "/login/";
});

document
  .getElementById("donationForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const msg = document.getElementById("donationMessage");
    const f = new FormData(form);
    const files = selectedPhotos || [];

    if (!db) {
      msg.className = "message error";
      msg.textContent =
        "Supabase is not connected. Please refresh and try again.";
      return;
    }

    if (!files.length) {
      msg.className = "message error";
      msg.textContent = "Please upload at least one clothing photo.";
      return;
    }

    if (
      files.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type),
      )
    ) {
      msg.className = "message error";
      msg.textContent = "Please upload JPG, PNG or WEBP images only.";
      return;
    }

    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      msg.className = "message error";
      msg.textContent = "Each photo must be 5 MB or smaller.";
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await db.auth.getUser();

    if (userError || !user) {
      msg.className = "message error";
      msg.textContent = "Please sign in before submitting a donation.";

      sessionStorage.setItem("revastra_after_login", "/donate/");

      setTimeout(() => {
        location.href = "/login/";
      }, 1200);

      return;
    }

    const button = form.querySelector(
      'button[type="submit"], button:not([type])',
    );

    if (button) {
      button.disabled = true;
      button.textContent = "Saving donation…";
    }

    const reference = "RV-" + Date.now().toString().slice(-8);

    const { data: donation, error: insertError } = await db
      .from("donations")
      .insert({
        donor_id: user.id,
        reference,
        category: f.get("category"),
        size: f.get("size"),
        condition: f.get("condition"),
        quantity: Number(f.get("quantity")),
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      msg.className = "message error";
      msg.textContent = "Could not save donation: " + insertError.message;

      if (button) {
        button.disabled = false;
        button.textContent = "Continue to schedule pickup →";
      }

      return;
    }

    const uploadedPaths = [];

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

      const storagePath = `${user.id}/${donation.id}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await db.storage
        .from("donation-photos")
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        msg.className = "message error";
        msg.textContent =
          "Donation was saved, but a photo upload failed: " +
          uploadError.message +
          ". Please contact support before submitting again.";

        if (button) {
          button.disabled = false;
          button.textContent = "Continue to schedule pickup →";
        }

        return;
      }

      uploadedPaths.push({
        donation_id: donation.id,
        donor_id: user.id,
        storage_path: storagePath,
        original_name: file.name,
      });
    }

    const { error: photoRowError } = await db
      .from("donation_photos")
      .insert(uploadedPaths);

    if (photoRowError) {
      msg.className = "message error";
      msg.textContent =
        "Photos uploaded, but their records could not be saved: " +
        photoRowError.message;

      if (button) {
        button.disabled = false;
        button.textContent = "Continue to schedule pickup →";
      }

      return;
    }

    sessionStorage.setItem("revastra_pending_donation_id", donation.id);
    sessionStorage.setItem("revastra_pending_donation_reference", reference);

    location.href = "/schedule-pickup/?ref=" + encodeURIComponent(reference);
  });

async function loadUserData() {
  if (!db) return;

  const {
    data: { user },
    error: authError,
  } = await db.auth.getUser();

  if (authError || !user) {
    if (page === "dashboard" || page === "admin") {
      sessionStorage.setItem(
        "revastra_after_login",
        location.pathname + location.search,
      );

      location.href = "/login/";
    }

    return;
  }

  if (page === "dashboard") {
    const box = document.getElementById("dashboardContent");

    const { data, error } = await db
      .from("donations")
      .select("*")
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      box.textContent = "Could not load donations: " + error.message;
      return;
    }

    if (!data?.length) {
      box.innerHTML = `No donations yet. <a href="/donate/">Submit your first donation</a>.`;
      return;
    }

    const cards = [];

    for (const d of data) {
      const { data: photos } = await db
        .from("donation_photos")
        .select("storage_path,original_name")
        .eq("donation_id", d.id)
        .eq("donor_id", user.id);

      let photoHtml = "";

      if (photos?.length) {
        const signed = await Promise.all(
          photos.map(async (photo) => {
            const { data: signedData } = await db.storage
              .from("donation-photos")
              .createSignedUrl(photo.storage_path, 3600);

            return signedData?.signedUrl
              ? `<img
                  src="${esc(signedData.signedUrl)}"
                  alt="${esc(photo.original_name || "Donation photo")}"
                  style="width:100px;height:100px;object-fit:cover;border-radius:10px;margin:6px"
                >`
              : "";
          }),
        );

        photoHtml = `<div style="margin-top:10px">${signed.join("")}</div>`;
      }

      cards.push(`
        <article style="padding:16px 0;border-bottom:1px solid #e5e0d8">
          <h3>
            ${esc(d.reference)}
            <span class="badge">${esc(d.status)}</span>
          </h3>

          <p>
            ${esc(d.category)} ·
            Size: ${esc(d.size || "—")} ·
            Condition: ${esc(d.condition || "—")} ·
            Quantity: ${d.quantity}
          </p>

          <p>
            Pickup: ${esc(d.preferred_pickup_date || "Not scheduled")}
            · ${esc(d.preferred_pickup_time || "")}
          </p>

          <p>${esc(d.pickup_address || "Pickup address not added yet")}</p>

          ${photoHtml}

          <p>
            <a href="/track/?ref=${encodeURIComponent(d.reference)}">
              Track donation
            </a>
          </p>
        </article>
      `);
    }

    box.innerHTML = cards.join("");
  }

  if (page === "admin") {
    const { data: roles } = await db
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (!roles?.some((r) => r.role === "admin")) {
      document.getElementById("adminContent").textContent =
        "Admin access is required for this account.";

      return;
    }

    const { data, error } = await db
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    const box = document.getElementById("adminContent");

    if (error) {
      box.textContent = error.message;
      return;
    }

    box.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Donor</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            ${data
              .map(
                (d) => `
              <tr>
                <td>${esc(d.reference)}</td>
                <td>${esc(d.donor_id)}</td>
                <td>${esc(d.category)}</td>
                <td>${d.quantity}</td>
                <td>${esc(d.status)}</td>
                <td>
                  <select class="field status-select" data-id="${d.id}">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="scheduled">Pickup Scheduled</option>
                    <option value="picked_up">Collected</option>
                    <option value="completed">Distributed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    box.querySelectorAll(".status-select").forEach((sel) => {
      sel.value = data.find((d) => d.id === sel.dataset.id).status;

      sel.addEventListener("change", async () => {
        const { error } = await db
          .from("donations")
          .update({ status: sel.value })
          .eq("id", sel.dataset.id);

        if (error) alert(error.message);
      });
    });
  }
}

if (page === "track") {
  (async () => {
    const ref = decodeURIComponent(
      new URLSearchParams(location.search).get("ref") ||
        path.split("/")[2] ||
        "",
    );

    const box = document.getElementById("trackContent");

    if (!db) {
      box.textContent =
        "Connect Supabase in app.js to look up live donation tracking.";

      return;
    }

    const { data, error } = await db
      .from("donations")
      .select(
        "reference,status,category,quantity,created_at,preferred_pickup_date,preferred_pickup_time,pickup_address",
      )
      .eq("reference", ref)
      .maybeSingle();

    if (error || !data) {
      box.textContent = "Donation not found, or sign in to view this donation.";

      return;
    }

    box.innerHTML = `
      <h2>${esc(data.reference)}</h2>

      <p>${esc(data.category)} · ${data.quantity} item(s)</p>

      <p>
        Status:
        <span class="badge">${esc(data.status)}</span>
      </p>

      <p>
        Preferred pickup:
        ${esc(data.preferred_pickup_date || "Not scheduled")}
      </p>

      <p>
        Preferred time:
        ${esc(data.preferred_pickup_time || "Not scheduled")}
      </p>

      <p>
        Pickup address:
        ${esc(data.pickup_address || "Not provided")}
      </p>
    `;
  })();
} else {
  loadUserData();
}
