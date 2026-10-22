import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Waves, Zap, ShieldAlert, Bell, Search, Menu, X, ChevronRight, ChevronDown,
  Clock3, MapPin, CalendarDays, ExternalLink, CheckCircle2, AlertTriangle,
  Info, CircleAlert, Settings, LayoutDashboard, Plus, Pencil, Archive,
  LogOut, Eye, EyeOff, Filter, Sun, Moon, Type, Volume2, RefreshCw,
  Activity, FileText, Check, Trash2, ArrowUpRight, RadioTower, WavesLadder
} from "lucide-react";
import "./styles.css";

const CATEGORIES = ["Power Interruption", "Sea Travel", "Disaster Advisory"];
const DEMO_ANNOUNCEMENTS = [
  {
    id: "demo-power-01", title: "Scheduled power interruption — demonstration",
    category: "Power Interruption", location: "Selected service areas, Corcuera",
    status: "Scheduled", urgency: "Advisory",
    date: "2026-10-24", startTime: "08:00", restoration: "",
    reason: "Demonstration record only. Replace with verified information from the authorized source.",
    content: "This sample record demonstrates how a scheduled power interruption may be presented. It is not an actual notice and must not be used for travel or safety decisions.",
    source: "DEMO DATA — no official source attached", publishedAt: "2026-10-22T07:00:00+08:00",
    updatedAt: "2026-10-22T07:00:00+08:00", validity: "2026-10-24T18:00", archived: false, demo: true
  },
  {
    id: "demo-sea-01", title: "Sea travel status — demonstration only",
    category: "Sea Travel", location: "Corcuera routes",
    status: "Unconfirmed", urgency: "Informational",
    date: "2026-10-22", startTime: "", restoration: "",
    reason: "No verified operational update is connected to this demonstration website.",
    content: "Please check with the appropriate maritime or local authority before making travel decisions. This is sample content only, not a live sea travel advisory.",
    source: "DEMO DATA — verify with the appropriate authority", publishedAt: "2026-10-22T07:00:00+08:00",
    updatedAt: "2026-10-22T07:00:00+08:00", validity: "", archived: false, demo: true
  },
  {
    id: "demo-disaster-01", title: "Community preparedness reminder — demonstration",
    category: "Disaster Advisory", location: "Corcuera, Romblon",
    status: "Advisory Issued", urgency: "Advisory",
    date: "2026-10-22", startTime: "", restoration: "",
    reason: "Preparedness reminder for demonstration purposes.",
    content: "Keep emergency contact information accessible and follow announcements from authorized local and national agencies. This is not an official warning or emergency instruction.",
    source: "DEMO DATA — no official advisory attached", publishedAt: "2026-10-22T07:00:00+08:00",
    updatedAt: "2026-10-22T07:00:00+08:00", validity: "", archived: false, demo: true
  }
];

const CATEGORY_META = {
  "Power Interruption": { icon: Zap, short: "Power", color: "amber", description: "Scheduled and ongoing interruptions, affected areas, and restoration updates." },
  "Sea Travel": { icon: Waves, short: "Sea travel", color: "blue", description: "Route status and official sea travel advisories." },
  "Disaster Advisory": { icon: ShieldAlert, short: "Disaster", color: "red", description: "Public safety advisories and preparedness information." }
};

const localDate = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: value.includes("T") ? "short" : undefined });
};
const statusClass = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const newId = () => `coral-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

function loadAnnouncements() {
  try {
    const saved = localStorage.getItem("coral-announcements-v1");
    return saved ? JSON.parse(saved) : DEMO_ANNOUNCEMENTS;
  } catch { return DEMO_ANNOUNCEMENTS; }
}
function loadNotifications() {
  try { return JSON.parse(localStorage.getItem("coral-notifications-v1") || "[]"); }
  catch { return []; }
}
function App() {
  const [page, setPage] = useState("Home");
  const [mobileNav, setMobileNav] = useState(false);
  const [announcements, setAnnouncements] = useState(loadAnnouncements);
  const [notifications, setNotifications] = useState(loadNotifications);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(emptyForm());
  const [textScale, setTextScale] = useState("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => { localStorage.setItem("coral-announcements-v1", JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem("coral-notifications-v1", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => {
    document.documentElement.dataset.scale = textScale;
    document.documentElement.dataset.contrast = highContrast ? "high" : "normal";
    document.documentElement.dataset.motion = reduceMotion ? "reduced" : "normal";
  }, [textScale, highContrast, reduceMotion]);

  function emptyForm() {
    return { title:"", category:"Power Interruption", location:"", status:"Unconfirmed", urgency:"Informational", date:"", startTime:"", restoration:"", reason:"", content:"", source:"", validity:"" };
  }
  function notify(message) { setToast(message); window.setTimeout(() => setToast(""), 3200); }
  const activeAnnouncements = announcements.filter(a => !a.archived);
  const visibleAnnouncements = useMemo(() => {
    return announcements.filter(a => {
      if (!showArchived && a.archived) return false;
      if (page !== "Home" && CATEGORIES.includes(page) && a.category !== page) return false;
      if (categoryFilter !== "All categories" && a.category !== categoryFilter) return false;
      if (statusFilter !== "All statuses" && a.status !== statusFilter) return false;
      const q = search.trim().toLowerCase();
      return !q || [a.title,a.category,a.location,a.status,a.content,a.source].some(v => (v || "").toLowerCase().includes(q));
    }).sort((a,b) => new Date(b.updatedAt || b.publishedAt || 0) - new Date(a.updatedAt || a.publishedAt || 0));
  }, [announcements, page, categoryFilter, statusFilter, search, showArchived]);
  const latest = activeAnnouncements.slice().sort((a,b) => new Date(b.updatedAt || 0)-new Date(a.updatedAt || 0)).slice(0,3);
  const unreadCount = notifications.filter(n => !n.read).length;

  function createNotification(announcement, eventLabel) {
    const item = {
      id: newId(), announcementId: announcement.id, title: announcement.title,
      category: announcement.category, summary: `${eventLabel}: ${announcement.status}`,
      timestamp: new Date().toISOString(), read: false, eventLabel
    };
    setNotifications(prev => [item, ...prev]);
  }
  function go(next) {
    setPage(next); setMobileNav(false); setSelected(null); setSearch(""); setCategoryFilter("All categories"); setStatusFilter("All statuses"); setShowArchived(false);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }
  function openCreate(category = "Power Interruption") {
    setEditing(null); setFormData({ ...emptyForm(), category }); setFormError(""); setPage("Manage"); setSelected(null);
  }
  function openEdit(item) {
    setEditing(item.id);
    setFormData({ title:item.title, category:item.category, location:item.location || "", status:item.status || "Unconfirmed", urgency:item.urgency || "Informational", date:item.date || "", startTime:item.startTime || "", restoration:item.restoration || "", reason:item.reason || "", content:item.content || "", source:item.source || "", validity:item.validity || "" });
    setFormError(""); setSelected(null); setPage("Manage");
  }
  function saveAnnouncement(publish) {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category || !formData.source.trim()) {
      setFormError("Please complete the title, category, details, and information source before saving or publishing."); return;
    }
    const now = new Date().toISOString();
    const previous = announcements.find(a => a.id === editing);
    const item = { ...formData, id: editing || newId(), createdAt: previous?.createdAt || now, publishedAt: publish ? (previous?.publishedAt || now) : (previous?.publishedAt || ""), updatedAt: now, archived:false, draft:!publish, demo: false };
    setAnnouncements(prev => editing ? prev.map(a => a.id === editing ? item : a) : [item, ...prev]);
    if (publish) createNotification(item, previous ? "Announcement updated" : "New announcement published");
    setFormError(""); setFormData(emptyForm()); setEditing(null); go("Dashboard");
    notify(publish ? (previous ? "Announcement updated and published." : "Announcement published.") : "Draft saved.");
  }
  function archiveAnnouncement(item) {
    if (!window.confirm(`Archive “${item.title}”? It will no longer appear among active announcements.`)) return;
    setAnnouncements(prev => prev.map(a => a.id === item.id ? {...a, archived:true, updatedAt:new Date().toISOString()} : a));
    notify("Announcement archived.");
  }
  function restoreAnnouncement(item) {
    setAnnouncements(prev => prev.map(a => a.id === item.id ? {...a, archived:false, updatedAt:new Date().toISOString()} : a));
    notify("Announcement restored.");
  }
  function login(e) {
    e.preventDefault();
    // Demo-only gate. Replace with server-side authentication before deployment.
    if (adminUser.trim() && adminPass.trim()) {
      setAdminLoggedIn(true); setShowAdminLogin(false); setAdminUser(""); setAdminPass(""); go("Dashboard");
      notify("Demo administrator session started. Configure secure authentication before deployment.");
    } else notify("Enter a username and password to continue.");
  }
  function markAllRead() { setNotifications(prev => prev.map(n => ({...n, read:true}))); }
  function markRead(id) { setNotifications(prev => prev.map(n => n.id === id ? {...n, read:true} : n)); }
  function deleteDemoData() {
    if (!window.confirm("Remove all demonstration announcements from this browser? This cannot be undone.")) return;
    setAnnouncements(prev => prev.filter(a => !a.demo)); notify("Demonstration records removed.");
  }

  const NavLink = ({ label, icon: Icon, active, onClick }) => (
    <button className={`nav-link ${active ? "active" : ""}`} onClick={onClick}>
      <Icon size={18} strokeWidth={1.9}/><span>{label}</span>{active && <span className="nav-active-dot" />}
    </button>
  );
  const CategoryIcon = ({ category, size = 20 }) => {
    const Icon = CATEGORY_META[category]?.icon || Info;
    return <Icon size={size} strokeWidth={1.9}/>;
  };
  const StatusBadge = ({ value, urgency = false }) => (
    <span className={`status-badge ${urgency ? "urgency" : ""} ${statusClass(value)}`}>
      {urgency && <span className="status-dot" />}{value || "Unconfirmed"}
    </span>
  );
  const AnnouncementCard = ({ item, compact = false }) => (
    <article className={`announcement-card ${compact ? "compact" : ""}`}>
      <div className={`category-icon ${CATEGORY_META[item.category]?.color || "blue"}`}><CategoryIcon category={item.category} size={20}/></div>
      <div className="announcement-main">
        <div className="announcement-meta">
          <span>{item.category}</span><span className="meta-separator">•</span><span>Updated {localDate(item.updatedAt)}</span>
        </div>
        <button className="announcement-title" onClick={() => setSelected(item)}>{item.title}</button>
        <p className="announcement-summary">{item.content}</p>
        <div className="announcement-foot">
          <span className="location-text"><MapPin size={14}/>{item.location || "Location not provided"}</span>
          <StatusBadge value={item.status}/>
          {item.demo && <span className="demo-label">Demo</span>}
        </div>
      </div>
      <button className="icon-button card-open" aria-label={`Open ${item.title}`} onClick={() => setSelected(item)}><ChevronRight size={19}/></button>
    </article>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Waves size={26}/><span className="brand-dot"/></div>
          <div><div className="brand-name">CORAL<span>.</span></div><div className="brand-subtitle">COMMUNITY ALERT LINK</div></div>
          <button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={20}/></button>
        </div>
        <div className="sidebar-caption">COMMUNITY</div>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink label="Overview" icon={LayoutDashboard} active={page==="Home"} onClick={() => go("Home")}/>
          <NavLink label="Power interruptions" icon={Zap} active={page==="Power Interruption"} onClick={() => go("Power Interruption")}/>
          <NavLink label="Sea travel status" icon={Waves} active={page==="Sea Travel"} onClick={() => go("Sea Travel")}/>
          <NavLink label="Disaster advisories" icon={ShieldAlert} active={page==="Disaster Advisory"} onClick={() => go("Disaster Advisory")}/>
        </nav>
        <div className="sidebar-caption second-caption">YOUR CORAL</div>
        <nav className="main-nav">
          <NavLink label="Notifications" icon={Bell} active={page==="Notifications"} onClick={() => go("Notifications")}/>
          <NavLink label="Accessibility" icon={Settings} active={page==="Accessibility"} onClick={() => go("Accessibility")}/>
          {adminLoggedIn && <NavLink label="Admin dashboard" icon={Activity} active={page==="Dashboard"} onClick={() => go("Dashboard")}/>}
        </nav>
        <div className="sidebar-spacer"/>
        <div className="sidebar-help">
          <div className="help-icon"><ShieldAlert size={18}/></div>
          <div><strong>Stay informed.</strong><p>Always verify urgent information with the responsible authority.</p></div>
        </div>
        <div className="sidebar-bottom">
          {adminLoggedIn ? <button className="sidebar-admin-button" onClick={() => {setAdminLoggedIn(false); go("Home"); notify("Demo administrator session ended.");}}><LogOut size={16}/> Sign out of demo admin</button> :
            <button className="sidebar-admin-button" onClick={() => setShowAdminLogin(true)}><Settings size={16}/> Administrator login <ArrowUpRight size={14}/></button>}
          <div className="sidebar-version">CORAL WEB · RESEARCH DEMO</div>
        </div>
      </aside>

      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation overlay" onClick={() => setMobileNav(false)}/>}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-toggle" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21}/></button>
            <div className="breadcrumb">Corcuera, Romblon <ChevronRight size={14}/> <strong>{page === "Home" ? "Community overview" : page}</strong></div>
          </div>
          <div className="topbar-actions">
            <span className="date-chip"><CalendarDays size={15}/>{new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})}</span>
            <button className={`notification-top ${notificationOpen ? "pressed" : ""}`} aria-label="Open notifications" onClick={() => {setNotificationOpen(v=>!v); go("Notifications");}}><Bell size={19}/>{unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}</button>
            <button className="avatar-button" onClick={() => adminLoggedIn ? go("Dashboard") : setShowAdminLogin(true)} aria-label="Administrator access"><span>CA</span></button>
          </div>
        </header>

        <div className="page-content">
          {page === "Home" && <>
            <section className="welcome-row">
              <div><div className="eyebrow"><span className="eyebrow-line"/> COMMUNITY INFORMATION CENTER</div><h1>Good day, Corcuera.</h1><p className="welcome-copy">Your local source for community updates, travel status, and public safety advisories.</p></div>
              <div className="welcome-art" aria-hidden="true"><div className="sun-orb"/><div className="island island-back"/><div className="island island-front"/><div className="art-wave wave-one"/><div className="art-wave wave-two"/><div className="art-wave wave-three"/><div className="art-palm">♧</div></div>
            </section>
            <section className="hero-alert">
              <div className="hero-alert-icon"><Info size={22}/></div>
              <div className="hero-alert-copy"><strong>Information notice</strong><p>This research demonstration uses sample records. Check the source and update time on every announcement. Do not rely on demo data for real-world decisions.</p></div>
              <span className="demo-pill">DEMO MODE</span>
            </section>
            <section className="section-block">
              <div className="section-heading"><div><div className="eyebrow">QUICK ACCESS</div><h2>What do you need to know?</h2></div><span className="section-note">Choose a category to explore</span></div>
              <div className="category-grid">
                {CATEGORIES.map(category => {
                  const meta = CATEGORY_META[category]; const Icon = meta.icon;
                  const count = activeAnnouncements.filter(a => a.category === category).length;
                  return <button className="category-card" key={category} onClick={() => go(category)}>
                    <div className={`category-card-icon ${meta.color}`}><Icon size={23}/></div>
                    <div className="category-card-copy"><h3>{category}</h3><p>{meta.description}</p><span className="category-card-count">{count} {count === 1 ? "record" : "records"} available</span></div>
                    <ChevronRight className="category-arrow" size={19}/>
                  </button>;
                })}
              </div>
            </section>
            <section className="section-block latest-block">
              <div className="section-heading"><div><div className="eyebrow">LATEST UPDATES</div><h2>Recent announcements</h2></div><button className="text-link" onClick={() => go("Power Interruption")}>Browse updates <ChevronRight size={16}/></button></div>
              <div className="announcement-list">{latest.length ? latest.map(item => <AnnouncementCard key={item.id} item={item}/>) : <EmptyState title="No announcements yet" description="When verified announcements are published, they will appear here."/>}</div>
            </section>
            <section className="source-reminder"><div className="source-reminder-icon"><RadioTower size={20}/></div><div><strong>Check the source before you act</strong><p>CORAL shares information entered by authorized administrators. It does not independently confirm power restoration, sea travel safety, or emergency conditions.</p></div></section>
          </>}

          {CATEGORIES.includes(page) && <>
            <PageIntro icon={CATEGORY_META[page].icon} eyebrow="COMMUNITY INFORMATION" title={page} description={CATEGORY_META[page].description}/>
            <div className="page-banner"><div className={`banner-icon ${CATEGORY_META[page].color}`}><CategoryIcon category={page} size={23}/></div><div><strong>{page === "Power Interruption" ? "Electricity updates" : page === "Sea Travel" ? "Travel status updates" : "Public safety information"}</strong><p>{page === "Power Interruption" ? "Review affected areas, reported schedules, and confirmed restoration details." : page === "Sea Travel" ? "Review available route information and advisories from identified sources." : "Review advisory details, urgency labels, and precautions from identified authorities."}</p></div></div>
            <div className="filters-row">
              <div className="search-field"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search announcements..." aria-label="Search announcements"/></div>
              <div className="select-wrap"><Filter size={16}/><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} aria-label="Filter by status"><option>All statuses</option>{[...new Set(announcements.filter(a=>a.category===page).map(a=>a.status))].map(s=><option key={s}>{s}</option>)}</select><ChevronDown size={14}/></div>
            </div>
            <div className="results-caption">{visibleAnnouncements.length} {visibleAnnouncements.length===1?"announcement":"announcements"} found <span>·</span> sorted by latest update</div>
            <div className="announcement-list">{visibleAnnouncements.length ? visibleAnnouncements.map(item=><AnnouncementCard key={item.id} item={item}/>) : <EmptyState title="Nothing to show yet" description="No matching announcements are available. Try changing your search or check again later."/>}</div>
            <div className="notice-foot"><Info size={16}/><span>Always check the source and timestamp. “Unconfirmed” means the status has not been verified in the information entered here.</span></div>
          </>}

          {page === "Notifications" && <>
            <PageIntro icon={Bell} eyebrow="YOUR CORAL" title="Notifications" description="Keep track of new announcements and important updates."/>
            <div className="notification-toolbar"><div><strong>{unreadCount} unread</strong><span> · {notifications.length} total notifications</span></div><button className="secondary-button" onClick={markAllRead} disabled={!unreadCount}><Check size={16}/> Mark all as read</button></div>
            {notifications.length ? <div className="notification-list">{notifications.map(n=><button key={n.id} className={`notification-item ${n.read?"read":""}`} onClick={()=>{markRead(n.id);const item=announcements.find(a=>a.id===n.announcementId);if(item)setSelected(item);}}>
              <div className={`notification-symbol ${CATEGORY_META[n.category]?.color || "blue"}`}><CategoryIcon category={n.category}/></div><div className="notification-body"><div className="notification-item-heading"><strong>{n.title}</strong>{!n.read&&<span className="unread-dot"/>}</div><p>{n.summary}</p><span className="notification-time"><Clock3 size={13}/>{localDate(n.timestamp)} · {n.category}</span></div><ChevronRight size={17}/>
            </button>)}</div> : <EmptyState title="You're all caught up" description="New notifications will appear here when an administrator publishes or updates an announcement."/>}
          </>}

          {page === "Accessibility" && <>
            <PageIntro icon={Settings} eyebrow="PREFERENCES" title="Accessibility settings" description="Adjust the interface to make CORAL more comfortable to read and use. These preferences apply on this device while the page is open."/>
            <div className="settings-panel">
              <SettingRow icon={Type} title="Text size" description="Choose a comfortable reading size."><div className="segmented"><button className={textScale==="normal"?"selected":""} onClick={()=>setTextScale("normal")}>Standard</button><button className={textScale==="large"?"selected":""} onClick={()=>setTextScale("large")}>Large</button><button className={textScale==="larger"?"selected":""} onClick={()=>setTextScale("larger")}>Extra large</button></div></SettingRow>
              <SettingRow icon={Eye} title="High-contrast mode" description="Increase contrast between text, backgrounds, and controls."><button className={`toggle ${highContrast?"on":""}`} role="switch" aria-checked={highContrast} onClick={()=>setHighContrast(v=>!v)}><span/></button></SettingRow>
              <SettingRow icon={Volume2} title="Reduced motion" description="Reduce animated transitions and scrolling effects."><button className={`toggle ${reduceMotion?"on":""}`} role="switch" aria-checked={reduceMotion} onClick={()=>setReduceMotion(v=>!v)}><span/></button></SettingRow>
              <div className="settings-foot"><CheckCircle2 size={17}/> Your selections are applied immediately to this page.</div>
            </div>
            <div className="accessibility-tip"><Info size={19}/><div><strong>Need clearer information?</strong><p>Each status uses a text label as well as a color. If you find any control difficult to use, please include it in your usability feedback during the research evaluation.</p></div></div>
          </>}

          {page === "Dashboard" && adminLoggedIn && <>
            <PageIntro icon={LayoutDashboard} eyebrow="ADMINISTRATION" title="Admin dashboard" description="Manage community announcements and review their publication status." action={<button className="primary-button" onClick={()=>openCreate()}><Plus size={17}/> New announcement</button>}/>
            <div className="admin-demo-warning"><AlertTriangle size={18}/><div><strong>Demonstration administrator mode</strong><p>This login is a front-end demonstration only, not secure authentication. Do not deploy with real community data until server-side authentication and a database are configured.</p></div></div>
            <div className="stats-grid"><StatCard label="Active announcements" value={activeAnnouncements.length} icon={FileText} tone="blue"/><StatCard label="Drafts" value={announcements.filter(a=>a.draft&&!a.archived).length} icon={Pencil} tone="amber"/><StatCard label="Archived" value={announcements.filter(a=>a.archived).length} icon={Archive} tone="slate"/><StatCard label="Unread notifications" value={unreadCount} icon={Bell} tone="red"/></div>
            <div className="dashboard-panel">
              <div className="panel-heading"><div><h2>Announcement management</h2><p>Create, update, publish, and archive information.</p></div><button className="secondary-button" onClick={()=>setShowArchived(v=>!v)}><Archive size={15}/>{showArchived?"Hide archived":"Show archived"}</button></div>
              <div className="table-wrap"><table><thead><tr><th>Announcement</th><th>Category</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
                {announcements.filter(a=>showArchived?a.archived:!a.archived).map(item=><tr key={item.id}><td><div className="table-title">{item.title}{item.demo&&<span className="demo-label">Demo</span>}</div><div className="table-subtitle">{item.location||"Location not provided"}</div></td><td><span className="table-category"><CategoryIcon category={item.category} size={14}/>{item.category}</span></td><td><StatusBadge value={item.archived?"Archived":item.draft?"Draft":item.status}/></td><td>{localDate(item.updatedAt)}</td><td><div className="table-actions"><button className="small-icon-action" title="Edit" aria-label="Edit announcement" onClick={()=>openEdit(item)}><Pencil size={15}/></button>{item.archived?<button className="small-icon-action" title="Restore" aria-label="Restore announcement" onClick={()=>restoreAnnouncement(item)}><RefreshCw size={15}/></button>:<button className="small-icon-action danger" title="Archive" aria-label="Archive announcement" onClick={()=>archiveAnnouncement(item)}><Archive size={15}/></button>}</div></td></tr>)}
              </tbody></table>{announcements.filter(a=>showArchived?a.archived:!a.archived).length===0&&<EmptyState title="No records in this view" description="Create a new announcement to get started."/>}</div>
            </div>
            <div className="dashboard-bottom"><button className="text-link danger-text" onClick={deleteDemoData}><Trash2 size={15}/> Remove demo announcements</button><span>Changes are stored in this browser only.</span></div>
          </>}

          {page === "Manage" && adminLoggedIn && <>
            <PageIntro icon={editing?Pencil:Plus} eyebrow="ANNOUNCEMENT MANAGEMENT" title={editing?"Edit announcement":"Create announcement"} description="Provide verified details and identify the source before publishing."/>
            <form className="announcement-form" onSubmit={e=>{e.preventDefault();saveAnnouncement(true);}}>
              <div className="form-section-title"><span>01</span><div><h2>Announcement details</h2><p>Use clear wording residents can quickly understand.</p></div></div>
              <label className="form-field full">Announcement title *<input value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} placeholder="e.g. Scheduled power interruption" required/></label>
              <div className="form-grid">
                <label className="form-field">Category *<select value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value,status:e.target.value==="Power Interruption"?"Scheduled":e.target.value==="Sea Travel"?"Unconfirmed":"Advisory Issued"})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
                <label className="form-field">Affected area / route<input value={formData.location} onChange={e=>setFormData({...formData,location:e.target.value})} placeholder="Barangay, area, or route"/></label>
                <label className="form-field">Status<select value={formData.status} onChange={e=>setFormData({...formData,status:e.target.value})}>{(formData.category==="Power Interruption"?["Scheduled","Ongoing","Restored","Unconfirmed"]:formData.category==="Sea Travel"?["Operational","Suspended","Restricted","Advisory Issued","Unconfirmed"]:["Informational","Advisory Issued","Warning","Emergency","Unconfirmed"]).map(s=><option key={s}>{s}</option>)}</select></label>
                <label className="form-field">Urgency level<select value={formData.urgency} onChange={e=>setFormData({...formData,urgency:e.target.value})}>{["Informational","Advisory","Warning","Emergency"].map(s=><option key={s}>{s}</option>)}</select></label>
                <label className="form-field">Advisory / interruption date<input type="date" value={formData.date} onChange={e=>setFormData({...formData,date:e.target.value})}/></label>
                <label className="form-field">Start time<input type="time" value={formData.startTime} onChange={e=>setFormData({...formData,startTime:e.target.value})}/></label>
                {formData.category==="Power Interruption"&&<label className="form-field">Expected restoration time<input type="datetime-local" value={formData.restoration} onChange={e=>setFormData({...formData,restoration:e.target.value})}/><span className="field-hint">An estimate does not mean power has been restored.</span></label>}
                <label className="form-field">Valid until<input type="datetime-local" value={formData.validity} onChange={e=>setFormData({...formData,validity:e.target.value})}/></label>
              </div>
              <label className="form-field full">Reason / short context<textarea value={formData.reason} onChange={e=>setFormData({...formData,reason:e.target.value})} rows="2" placeholder="Reason if officially reported"/></label>
              <label className="form-field full">Announcement details *<textarea value={formData.content} onChange={e=>setFormData({...formData,content:e.target.value})} rows="5" placeholder="Enter verified information and relevant instructions..." required/></label>
              <label className="form-field full">Information source / reference *<input value={formData.source} onChange={e=>setFormData({...formData,source:e.target.value})} placeholder="Name the official agency or verified source" required/><span className="field-hint">Do not label a record official unless the source has been verified.</span></label>
              {formError&&<div className="form-error"><CircleAlert size={17}/>{formError}</div>}
              <div className="form-actions"><button type="button" className="secondary-button" onClick={()=>saveAnnouncement(false)}>Save as draft</button><button type="submit" className="primary-button"><CheckCircle2 size={17}/>{editing?"Update and publish":"Publish announcement"}</button><button type="button" className="text-link" onClick={()=>go("Dashboard")}>Cancel</button></div>
            </form>
          </>}

          {!["Home","Notifications","Accessibility","Dashboard","Manage",...CATEGORIES].includes(page) && <EmptyState title="Page not found" description="Choose a section from the navigation to continue."/>}
          {page === "Dashboard" && !adminLoggedIn && <EmptyState title="Administrator access required" description="Log in to access announcement management." action={<button className="primary-button" onClick={()=>setShowAdminLogin(true)}>Administrator login</button>}/>}
          {page === "Manage" && !adminLoggedIn && <EmptyState title="Administrator access required" description="Log in to manage announcements." action={<button className="primary-button" onClick={()=>setShowAdminLogin(true)}>Administrator login</button>}/>}

          <footer className="site-footer"><div className="footer-brand"><div className="footer-logo"><Waves size={17}/></div><strong>CORAL<span>.</span></strong><span>Community Rescue and Alert Link</span></div><div className="footer-links"><span>Corcuera, Romblon</span><span>Research website demonstration</span><button onClick={()=>go("Accessibility")}>Accessibility</button></div><p className="footer-disclaimer">CORAL is an information-sharing research prototype. It is not an emergency response service. Verify urgent information with the appropriate authorities.</p></footer>
        </div>
      </main>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="modal-top"><div className={`category-icon ${CATEGORY_META[selected.category]?.color||"blue"}`}><CategoryIcon category={selected.category} size={21}/></div><button className="icon-button" onClick={()=>setSelected(null)} aria-label="Close announcement"><X size={20}/></button></div>
        {selected.demo&&<div className="detail-demo-alert"><Info size={15}/> Demonstration record · Not an official notice</div>}
        <div className="detail-category">{selected.category}</div><h2 id="detail-title">{selected.title}</h2><div className="detail-badges"><StatusBadge value={selected.status}/><StatusBadge value={selected.urgency} urgency/></div>
        <p className="detail-content">{selected.content}</p>
        {selected.reason&&<div className="detail-info-block"><strong>Reason / context</strong><p>{selected.reason}</p></div>}
        <div className="detail-facts">
          <Fact icon={MapPin} label="Affected area / route" value={selected.location||"Not provided"}/>
          <Fact icon={CalendarDays} label="Advisory date" value={localDate(selected.date)}/>
          {selected.startTime&&<Fact icon={Clock3} label="Start time" value={selected.startTime}/>}
          {selected.restoration&&<Fact icon={Clock3} label="Expected restoration" value={localDate(selected.restoration)}/>}
          {selected.validity&&<Fact icon={Clock3} label="Valid until" value={localDate(selected.validity)}/>}
          <Fact icon={ExternalLink} label="Information source" value={selected.source||"Not provided"}/>
          <Fact icon={Clock3} label="Published" value={localDate(selected.publishedAt)}/>
          <Fact icon={RefreshCw} label="Last updated" value={localDate(selected.updatedAt)}/>
        </div>
        <div className="modal-disclaimer"><ShieldAlert size={17}/><span>Check the original source for the latest information. CORAL does not independently verify the announcement.</span></div>
        {adminLoggedIn&&<div className="modal-actions"><button className="secondary-button" onClick={()=>openEdit(selected)}><Pencil size={15}/> Edit announcement</button><button className="secondary-button" onClick={()=>setSelected(null)}>Close</button></div>}
      </section></div>}

      {showAdminLogin && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowAdminLogin(false);}}><section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div className="login-brand"><div className="brand-mark"><Waves size={25}/></div><div><strong>CORAL<span>.</span></strong><small>ADMINISTRATOR ACCESS</small></div><button className="icon-button" onClick={()=>setShowAdminLogin(false)} aria-label="Close login"><X size={20}/></button></div>
        <h2 id="login-title">Welcome back.</h2><p className="login-copy">Sign in to manage community announcements.</p>
        <div className="login-demo-note"><Info size={16}/><span>Prototype only: any non-empty username and password opens a demo session. This is not secure authentication.</span></div>
        <form onSubmit={login}><label className="form-field">Username<input value={adminUser} onChange={e=>setAdminUser(e.target.value)} placeholder="Enter demo username" autoComplete="username" required/></label><label className="form-field">Password<div className="password-wrap"><input type={showPassword?"text":"password"} value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="Enter demo password" autoComplete="current-password" required/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label><button type="submit" className="primary-button full-button">Continue to dashboard <ChevronRight size={17}/></button></form>
        <p className="login-foot">For research demonstration only. Configure server-side authentication before deployment.</p>
      </section></div>}
      {toast&&<div className="toast-message" role="status"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}

function PageIntro({icon:Icon, eyebrow, title, description, action}) {
  return <section className="page-intro"><div className="page-intro-icon"><Icon size={22}/></div><div className="page-intro-text"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action&&<div className="page-intro-action">{action}</div>}</section>;
}
function EmptyState({title, description, action}) {
  return <div className="empty-state"><div className="empty-icon"><FileText size={23}/></div><h3>{title}</h3><p>{description}</p>{action}</div>;
}
function SettingRow({icon:Icon,title,description,children}) {
  return <div className="setting-row"><div className="setting-row-icon"><Icon size={19}/></div><div className="setting-row-copy"><strong>{title}</strong><p>{description}</p></div><div className="setting-control">{children}</div></div>;
}
function StatCard({label,value,icon:Icon,tone}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong></div></div>;
}
function Fact({icon:Icon,label,value}) {
  return <div className="detail-fact"><div className="fact-icon"><Icon size={16}/></div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

createRoot(document.getElementById("root")).render(<App/>);
