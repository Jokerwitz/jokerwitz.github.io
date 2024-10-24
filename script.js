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
  
  // Helper function to delay between API calls
  const delay = ms => new Promise(res => setTimeout(res, ms));
  
  // Function to fetch data from WiseOldMan API
  async function fetchWiseOldManData(type, name, sectionId, tableId) {
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
        const td = document.createElement('td');
        td.textContent = `${index + 1}. ${player.player.username} (${player.data.gained})`;
        row.appendChild(td);
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
      await fetchWiseOldManData('skill', skills[i], 'skillsSection', 'skillsTable');
      await delay(100); // Ensure we're staying under the API rate limit
    }
  }
  
  // Function to load the bosses data
  async function loadBosses() {
    const table = document.getElementById('bossesTable');
    table.innerHTML = ''; // Clear table before populating
    for (let i = 0; i < bosses.length; i++) {
      await fetchWiseOldManData('boss', bosses[i], 'bossesSection', 'bossesTable');
      await delay(100); // Ensure we're staying under the API rate limit
    }
  }
  
  // Function to load the activities data
  async function loadActivities() {
    const table = document.getElementById('activitiesTable');
    table.innerHTML = ''; // Clear table before populating
    for (let i = 0; i < activities.length; i++) {
      await fetchWiseOldManData('activity', activities[i], 'activitiesSection', 'activitiesTable');
      await delay(100); // Ensure we're staying under the API rate limit
    }
  }
  
  // Function to load both skills, bosses, and activities
  function loadHighscores() {
    loadSkills();
    loadBosses();
    loadActivities();
  }
  
  // Add event listener to the button
  document.getElementById('loadHighscoresBtn').addEventListener('click', loadHighscores);
  