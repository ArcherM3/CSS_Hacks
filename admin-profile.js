// ─── Toggle pending table ────────────────────────────────────────────────────
const pendingCard  = document.getElementById('pendingCard');
const tableWrapper = document.getElementById('tableWrapper');
const closeBtn     = document.getElementById('closeBtn');

pendingCard.addEventListener('click', function () {
  tableWrapper.classList.toggle('hidden');
});

closeBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  tableWrapper.classList.add('hidden');
});

// ─── Filter rows by complaint ID ─────────────────────────────────────────────
function filterComplaints() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.row').forEach(row => {
    const id = row.getAttribute('data-id').toLowerCase();
    row.style.display = id.includes(query) ? '' : 'none';
  });
}

// ─── Status dropdown colour update ───────────────────────────────────────────
function updateStatus(select) {
  const colors = {
    'Pending':      '#FF3B30',
    'In Progress':  '#0055FF',
    'Resolved':     '#00C853'
  };
  select.style.borderColor = colors[select.value] || '#52525B';
  select.style.color       = colors[select.value] || '#52525B';
}

// ─── Load department metrics (total / resolved / pending) ────────────────────
/**
 * Hits:  GET /complaints/stats?department=<dept>
 *
 * Expected JSON shape from backend:
 * {
 *   "total":    127,
 *   "resolved": 89,
 *   "pending":  38
 * }
 *
 * If your backend uses different field names, adjust the destructuring below.
 */
async function loadDepartmentStats(department) {
  try {
    const token = localStorage.getItem("token");
    const res  = await fetch(
      `https://web-wizards-backend.onrender.com/complaints/complaint/admin/stats?department=${encodeURIComponent(department)}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
    const data = await res.json();

    // Update the three metric cards with live numbers
    document.getElementById('totalCount').textContent   = data.total_complaints ?? data.total ?? '—';
    document.getElementById('resolvedCount').textContent = data.resolved ?? '—';
    document.getElementById('pendingCount').textContent  = data.pending  ?? '—';

  } catch (err) {
    console.error('Failed to load department stats:', err);
    // Leave the '—' placeholders visible so the UI doesn't show stale numbers
  }
}

// ─── Load pending complaints table ───────────────────────────────────────────
/**
 * Hits:  GET /complaints/pending?department=<dept>
 *
 * Each complaint object should contain:
 *   { id, description, date, status }
 */
async function loadComplaints(department) {
  try {
    const token = localStorage.getItem("token");
    const res  = await fetch(
      `https://web-wizards-backend.onrender.com/complaints/admin/my-complaints?department=${encodeURIComponent(department)}`, {
        headers: { "Authorization": `Bearer ${token}` }
      }
    );
    const data = await res.json();

    const tbody = document.getElementById('complaintsBody');
    tbody.innerHTML = '';

    data.forEach(complaint => {
      const row = document.createElement('tr');
      row.classList.add('row');
      // Use complaint.id or complaint.complaintId depending on backend response
      const cId = complaint.id || complaint.complaintId;
      row.setAttribute('data-id', cId);

      row.innerHTML = `
        <td>${cId}</td>
        <td>${complaint.description || complaint.title || 'N/A'}</td>
        <td>${complaint.date || formatDate(complaint.created_at)}</td>
        <td>
          <select class="status-select status-drop" onchange="updateComplaintStatus('${cId}', this.value)">
            <option value="open" ${complaint.status === 'open' ? 'selected' : ''}>open</option>
            <option value="in_progress" ${complaint.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
            <option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </td>
      `;

      tbody.appendChild(row);
    });

    // Apply initial colors
    document.querySelectorAll('.status-drop').forEach(select => updateStatus(select));

  } catch (err) {
    console.error('Failed to load complaints:', err);
  }
}

async function updateComplaintStatus(complaintId, newStatus) {
    const token = localStorage.getItem("token");
    try {
        const url = `https://web-wizards-backend.onrender.com/complaints/complaint/${complaintId}/status?status_data=${encodeURIComponent(newStatus)}`;
        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (res.ok) {
            alert(`Status updated to ${newStatus}`);
            // Update UI colors
            const select = document.querySelector(`tr[data-id="${complaintId}"] .status-drop`);
            if (select) updateStatus(select);
            
            // Refresh stats to reflect changes in numbers
            const dept = document.querySelectorAll('.detail-value')[1].textContent.trim();
            loadDepartmentStats(dept);
        } else {
            const errData = await res.json();
            alert("Failed to update status: " + (errData.detail || "Server error"));
        }
    } catch (e) {
        console.error("Status update error:", e);
        alert("An error occurred while updating status.");
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString();
}


async function loadAdminProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch('https://web-wizards-backend.onrender.com/admin/me', {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            document.querySelector('.admin-name').textContent = data.username;
            // Use fallback if position/dept not in data
            document.querySelectorAll('.detail-value')[0].textContent = data.position || 'Administrator';
            document.querySelectorAll('.detail-value')[1].textContent = data.department || 'General';
            
            if (data.avatar) {
                const img = document.querySelector('.profile-photo');
                const avatarUrl = data.avatar.startsWith('http') ? data.avatar : `https://web-wizards-backend.onrender.com${data.avatar}`;
                img.src = avatarUrl;
                
                // Update navbar avatar too
                localStorage.setItem("avatar", avatarUrl);
                const navAvatar = document.getElementById("profile-icon-img");
                if (navAvatar) navAvatar.src = avatarUrl;
            }

            // After loading profile, load stats for that department
            loadDepartmentStats(data.department);
            loadComplaints(data.department);
        } else {
            localStorage.clear();
            window.location.href = "login.html";
        }
    } catch (e) {
        console.error("Admin profile load error:", e);
    }
}

// Logout is handled globally by navbar.js

// Bootstrap
document.addEventListener("DOMContentLoaded", loadAdminProfile);
