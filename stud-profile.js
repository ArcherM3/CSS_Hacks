/* =============================================
   stud-profile.js
   Student Portal — Profile & Pending Complaints
   ============================================= */

// Tracks whether pending complaints have been fetched this session
let complaintsLoaded = false;

/* ---------- Helpers ---------- */

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function getCompletionColor(pct) {
  if (pct >= 70) return '#2E7D32';
  if (pct >= 40) return '#F57C00';
  return '#C62828';
}

function getStatusLabel(pct) {
  if (pct === 0)  return 'Not Started';
  if (pct < 40)   return 'Early Stage';
  if (pct < 70)   return 'In Progress';
  return 'Near Done';
}

function getAuthHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

function getStudentId() {
  return localStorage.getItem('studentId') || 'UG_25_CSE_0042';
}

/* ---------- Dashboard stats ---------- */

/*
  Expected API response from GET /api/complaints/stats?studentId=...
  {
    submitted: 34,
    resolved:  3,
    pending:   31
  }
*/
async function fetchDashboardStats() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('https://web-wizards-backend.onrender.com/complaints/complaint/student/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const stats = await res.json();
    // Assuming backend returns { total: X, resolved: Y, pending: Z } or similar
    // Based on openapi.json, it returns counts of complaints at each stage.
    // Let's adapt based on likely keys
    const submitted = stats.total_complaints || 0;
    const resolved = stats.resolved || 0;
    const pending = stats.pending || 0;

    document.getElementById('countSubmitted').textContent = submitted;
    document.getElementById('countResolved').textContent  = resolved;
    document.getElementById('countPending').textContent   = pending;
    document.getElementById('pendingBadge').textContent   = pending;

    document.querySelectorAll('.stat-loading').forEach(el => el.classList.remove('stat-loading'));

    const base = submitted || 1;
    document.getElementById('fillSubmitted').style.width = '100%';
    document.getElementById('fillResolved').style.width  = `${Math.round((resolved / base) * 100)}%`;
    document.getElementById('fillPending').style.width   = `${Math.round((pending  / base) * 100)}%`;

    // Also update profile info from localStorage or fetch /student/me
    updateProfileInfo();

  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
  }
}

async function updateProfileInfo() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('https://web-wizards-backend.onrender.com/student/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            document.querySelector('.profile-name').textContent = data.username;
            document.querySelectorAll('.meta-value')[0].textContent = data.sch_id;
            document.querySelectorAll('.meta-value')[1].textContent = data.college_email;
            if (data.avatar) {
                const photoDiv = document.querySelector('.profile-photo');
                const avatarUrl = data.avatar.startsWith('http') ? data.avatar : `https://web-wizards-backend.onrender.com${data.avatar}`;
                photoDiv.style.backgroundImage = `url(${avatarUrl})`;
                photoDiv.style.backgroundSize = 'cover';
                photoDiv.style.backgroundPosition = 'center';
                photoDiv.innerHTML = ''; // Clear label and hint
                
                // Update navbar avatar too if not already updated
                localStorage.setItem("avatar", avatarUrl);
                const navAvatar = document.getElementById("profile-icon-img");
                if (navAvatar) navAvatar.src = avatarUrl;
            }
        }
    } catch (e) {
        console.error("Profile update error:", e);
    }
}

async function fetchPendingComplaints() {
  const tbody = document.getElementById('pendingTableBody');
  const token = localStorage.getItem('token');
  if (!token) return;

  tbody.innerHTML = `<tr class="table-state-row"><td colspan="4">Loading…</td></tr>`;

  try {
    const res = await fetch('https://web-wizards-backend.onrender.com/complaints/student/my-complaints', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const complaints = await res.json();
    buildTable(complaints);
    complaintsLoaded = true;

  } catch (err) {
    console.error('Failed to fetch pending complaints:', err);
    tbody.innerHTML = `<tr class="table-state-row error"><td colspan="4">Failed to load complaints.</td></tr>`;
  }
}

function buildTable(complaints) {
  const tbody = document.getElementById('pendingTableBody');
  tbody.innerHTML = '';

  if (!complaints || complaints.length === 0) {
    tbody.innerHTML = `<tr class="table-state-row"><td colspan="4">No complaints found.</td></tr>`;
    return;
  }

  complaints.forEach((c, i) => {
    const row = document.createElement('tr');
    row.style.animationDelay = `${i * 0.03}s`;
    
    // Format status
    const status = c.status || 'Pending';
    const color = status === 'Resolved' ? '#2E7D32' : (status === 'Pending' ? '#F57C00' : '#C62828');

    row.innerHTML = `
      <td class="row-id">${c.id || c.complaintId || 'N/A'}</td>
      <td class="row-title">${c.title}</td>
      <td class="row-date">${formatDate(c.created_at || c.date)}</td>
      <td>
        <span class="status-chip" style="background:${color}18; color:${color}; border-color:${color}40;">
          ${status}
        </span>
      </td>`;
    tbody.appendChild(row);
  });
}


/* ---------- Toggle panel ---------- */

function togglePendingList() {
  const panel = document.getElementById('pendingPanel');
  const btn   = document.getElementById('togglePendingBtn');

  const isOpen      = panel.classList.toggle('open');
  const arrowRotate = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';

  btn.innerHTML =
    (isOpen ? 'Close' : 'View all') +
    `<svg id="arrowIcon" xmlns="http://www.w3.org/2000/svg"
        width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        style="transition:transform 0.3s; transform:${arrowRotate}">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
        d="M17 8l4 4m0 0l-4 4m4-4H3"/>
    </svg>`;

  // Fetch pending list only on first open
  if (isOpen && !complaintsLoaded) {
    fetchPendingComplaints();
  }
}

/* ---------- Logout is handled globally by navbar.js ---------- */

/* ---------- Init ---------- */

// Fetch stats as soon as the page loads
document.addEventListener('DOMContentLoaded', fetchDashboardStats);
