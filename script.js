let wars = [];
let currentFile = 'wars.json';
let recordsPerPage = 10;
let currentPage = 1;
let sortOrderStartDate = true;
let sortOrderDuration = true;



async function fetchWars() {
    try {
        const response = await fetch(currentFile);
        wars = await response.json();
        sortWarsByStartDate();
        renderTable();
        setInterval(updateDurations, 1000);
    } catch (error) {
        console.error('Error fetching wars:', error);
    }
}

function toggleWars() {
    currentFile = currentFile === 'wars.json' ? 'endwars.json' : 'wars.json';
    document.getElementById('switchButton').textContent = currentFile === 'wars.json' ? 'Show Ended Wars' : 'Show Ongoing Wars';
    fetchWars();
}

function sortWarsByStartDate() {
    wars.sort((a, b) => sortOrderStartDate ? new Date(a.start_date) - new Date(b.start_date) : new Date(b.start_date) - new Date(a.start_date));
    sortOrderStartDate = !sortOrderStartDate;
    renderTable();
}

function sortWarsByDuration() {
    wars.sort((a, b) => {
        const durationA = a.end_date ? new Date(a.end_date) - new Date(a.start_date) : new Date() - new Date(a.start_date);
        const durationB = b.end_date ? new Date(b.end_date) - new Date(b.start_date) : new Date() - new Date(b.start_date);
        return sortOrderDuration ? durationB - durationA : durationA - durationB;
    });
    sortOrderDuration = !sortOrderDuration;
    renderTable();
}

function updateDurations() {
    document.querySelectorAll(".duration").forEach(span => {
        const startDate = new Date(span.dataset.start);
        const now = new Date();
        let diff = now - startDate;
        let seconds = Math.floor((diff / 1000) % 60);
        let minutes = Math.floor((diff / (1000 * 60)) % 60);
        let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        let days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
        let months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30)) % 12);
        let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        span.textContent = `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
    });
}

function renderTable() {
    const tableBody = document.getElementById('warTableBody');
    tableBody.innerHTML = '';
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    wars.slice(start, end).forEach(war => {
        const endDateContent = war.end_date ? new Date(war.end_date).toLocaleDateString('it-IT') : `<span class='duration' data-start='${war.start_date}'></span>`;
        const row = `<tr>
            <td>${war.countries}</td>
            <td>${new Date(war.start_date).toLocaleDateString('it-IT')}</td>
            <td>${endDateContent}</td>
            <td>${war.description}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    updateDurations();
}

function setRecordsPerPage(value) {
    recordsPerPage = parseInt(value);
    currentPage = 1;
    renderTable();
}

 function nextPage() {
    if ((currentPage * recordsPerPage) < wars.length) {
        currentPage++;
        renderTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

window.onload = fetchWars;
