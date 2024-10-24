let loading = false; // To keep track of loading state
let cancelLoading = false; // To allow canceling the loading process

const skills = [
  "overall", "attack", "defence", "strength", "hitpoints", "ranged", "prayer",
  "magic", "cooking", "woodcutting", "fletching", "fishing", "firemaking", 
  "crafting", "smithing", "mining", "herblore", "agility", "thieving", 
  "slayer", "farming", "runecrafting", "hunter", "construction"
];

const bosses = [
  'abyssal_sire', 'alchemical_hydra', 'amoxliatl', 'araxxor', 'artio', 'barrows_chests', 
  'bryophyta', 'callisto', 'calvarion', 'cerberus', 'chambers_of_xeric', 
  'chambers_of_xeric_challenge_mode', 'chaos_elemental', 'chaos_fanatic', 
  'commander_zilyana', 'corporeal_beast', 'crazy_archaeologist', 'dagannoth_prime', 
  'dagannoth_rex', 'dagannoth_supreme', 'deranged_archaeologist', 'duke_sucellus', 
  'general_graardor', 'giant_mole', 'grotesque_guardians', 'hespori', 'kalphite_queen', 
  'king_black_dragon', 'kraken', 'kreearra', 'kril_tsutsaroth', 'lunar_chests', 
  'mimic', 'nex', 'nightmare', 'phosanis_nightmare', 'obor', 'phantom_muspah', 
  'sarachnis', 'scorpia', 'scurrius', 'skotizo', 'sol_heredit', 'spindel', 
  'tempoross', 'the_gauntlet', 'the_corrupted_gauntlet', 'the_hueycoatl', 
  'the_leviathan', 'the_whisperer', 'theatre_of_blood', 'theatre_of_blood_hard_mode', 
  'thermonuclear_smoke_devil', 'tombs_of_amascut', 'tombs_of_amascut_expert', 
  'tzkal_zuk', 'tztok_jad', 'vardorvis', 'venenatis', 'vetion', 'vorkath', 
  'wintertodt', 'zalcano', 'zulrah'
];

const activities = [
  'league_points', 'bounty_hunter_hunter', 'bounty_hunter_rogue', 'clue_scrolls_all', 
  'clue_scrolls_beginner', 'clue_scrolls_easy', 'clue_scrolls_medium', 'clue_scrolls_hard', 
  'clue_scrolls_elite', 'clue_scrolls_master', 'last_man_standing', 'pvp_arena', 
  'soul_wars_zeal', 'guardians_of_the_rift', 'colosseum_glory'
];

// Ranking emojis
const rankingEmojis = ["🥇", "🥈", "🥉"];

// Helper function to delay between API calls
const delay = ms => new Promise(res => setTimeout(res, ms));

// Function to format numbers into K notation (e.g., 21576080 => 21576K, 11111 => 11.1K)
function formatGainedValue(value) {
  if (value >= 100000) {
    // For values 100,000 or more, no decimal place, just whole K
    return Math.floor(value / 1000) + 'K';
  } else if (value >= 10000) {
    // For values between 10,000 and 100,000, keep one decimal place
    return (value / 1000).toFixed(1) + 'K';
  }
  return value; // Return the value as it is if it's below 10,000
}

// Function to fetch data from WiseOldMan API
async function fetchWiseOldManData(type, name, tableId) {
  if (cancelLoading) return; // Stop loading if requested

  const url = `https://api.wiseoldman.net/v2/groups/4052/gained?metric=${name}&period=month&limit=3`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Create table rows with data
    const table = document.getElementById(tableId);
    const row = document.createElement('tr');
    const header = document.createElement('th');
    header.textContent = name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
    row.appendChild(header);

    data.forEach((player, index) => {
      // If gained is 0, show N/A instead of player details
      if (player.data.gained === 0) {
        const td = document.createElement('td');
        td.textContent = "N/A";
        row.appendChild(td);
      } else {
        const td = document.createElement('td');
        const rankEmoji = rankingEmojis[index]; // Get the emoji for rank
        const formattedGained = formatGainedValue(player.data.gained); // Format gained XP
        td.textContent = `${rankEmoji} ${player.player.username} (${formattedGained})`;
        row.appendChild(td);
      }
    });

    table.appendChild(row);
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
  }
}

// Function to load the skills data
async function loadSkills() {
  const table = document.getElementById('skillsTable');
  table.innerHTML = ''; // Clear table before populating
  for (let i = 0; i < skills.length; i++) {
    await fetchWiseOldManData('skill', skills[i], 'skillsTable');
    await delay(100); // Ensure we're staying under the API rate limit
    if (cancelLoading) break; // Stop loading if requested
  }
}

// Function to load the bosses data
async function loadBosses() {
  const table = document.getElementById('bossesTable');
  table.innerHTML = ''; // Clear table before populating
  for (let i = 0; i < bosses.length; i++) {
    await fetchWiseOldManData('boss', bosses[i], 'bossesTable');
    await delay(100); // Ensure we're staying under the API rate limit
    if (cancelLoading) break; // Stop loading if requested
  }
}

// Function to load the activities data
async function loadActivities() {
  const table = document.getElementById('activitiesTable');
  table.innerHTML = ''; // Clear table before populating
  for (let i = 0; i < activities.length; i++) {
    await fetchWiseOldManData('activity', activities[i], 'activitiesTable');
    await delay(100); // Ensure we're staying under the API rate limit
    if (cancelLoading) break; // Stop loading if requested
  }
}

// Function to load both skills, bosses, and activities
async function loadHighscores() {
  loading = true;
  cancelLoading = false;
  updateButtonText("Stop Loading"); // Change button to "Stop Loading"
  await Promise.all([loadSkills(), loadBosses(), loadActivities()]);

  if (!cancelLoading) {
    updateButtonText("Re-Load Highscores"); // Once done, change to "Re-Load Highscores"
  }
  loading = false;
}

// Update the button text and toggle state
function updateButtonText(text) {
  const button = document.getElementById('loadHighscoresBtn');
  button.textContent = text;
}

// Button click handler to toggle between loading and stopping
function handleButtonClick() {
  if (loading) {
    // Stop loading if it's in progress
    cancelLoading = true;
    updateButtonText("Re-Load Highscores");
  } else {
    // Start loading
    loadHighscores();
  }
}

// Add event listener to the button
document.getElementById('loadHighscoresBtn').addEventListener('click', handleButtonClick);

// Function to convert table data to CSV format
function tableToCSV(tableId) {
  const table = document.getElementById(tableId);
  const rows = table.querySelectorAll('tr');
  let csvContent = '';

  rows.forEach(row => {
    const cols = row.querySelectorAll('th, td');
    let rowContent = [];
    cols.forEach(col => {
      rowContent.push('"' + col.innerText + '"');
    });
    csvContent += rowContent.join(',') + '\n';
  });

  return csvContent;
}

// Function to export all table data into a CSV
function exportToSpreadsheet() {
  let csv = '';
  
  csv += 'Skills\n';
  csv += tableToCSV('skillsTable') + '\n';
  
  csv += 'Bosses\n';
  csv += tableToCSV('bossesTable') + '\n';
  
  csv += 'Activities\n';
  csv += tableToCSV('activitiesTable') + '\n';
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'highscores.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Add event listener to export link
document.getElementById('exportSpreadsheet').addEventListener('click', exportToSpreadsheet);
