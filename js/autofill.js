/**
 * Subreddit Autocomplete Logic
 */

const POPULAR_SUBREDDITS = [
    'r/AskReddit',
    'r/funny',
    'r/gaming',
    'r/aww',
    'r/todayilearned',
    'r/worldnews',
    'r/science',
    'r/pics',
    'r/movies',
    'r/videos',
    'r/IAmA',
    'r/mildlyinteresting',
    'r/explainlikeimfive',
    'r/tifu',
    'r/AskScience',
    'r/books',
    'r/television',
    'r/Music',
    'r/Showerthoughts',
    'r/space',
    'r/history',
    'r/EarthPorn',
    'r/news',
    'r/technology',
    'r/dataisbeautiful',
    'r/personalfinance',
    'r/Futurology',
    'r/Documentaries',
    'r/buildapc',
    'r/politics'
];

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('subredditInput');
    const suggestionsList = document.getElementById('subredditSuggestions');
    
    if (!input || !suggestionsList) return;

    let activeIndex = -1;

    // Listen to value input edits
    input.addEventListener('input', () => {
        const val = input.value.trim().toLowerCase();
        activeIndex = -1;
        
        if (!val) {
            hideSuggestions();
            return;
        }

        // Filter matches (handles with and without r/ prefix)
        const matches = POPULAR_SUBREDDITS.filter(sub => {
            const cleanSub = sub.replace('r/', '').toLowerCase();
            return sub.toLowerCase().includes(val) || cleanSub.includes(val);
        });

        // Dedup and limit
        const uniqueMatches = [...new Set(matches)].slice(0, 8);

        if (uniqueMatches.length === 0) {
            hideSuggestions();
            return;
        }

        renderSuggestions(uniqueMatches);
    });

    // Handle key navigation
    input.addEventListener('keydown', (e) => {
        const items = suggestionsList.querySelectorAll('.suggestion-item');
        if (suggestionsList.classList.contains('hidden') || !items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            highlightItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            highlightItem(items);
        } else if (e.key === 'Enter') {
            if (activeIndex > -1) {
                e.preventDefault();
                selectItem(items[activeIndex].textContent);
            }
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsList.contains(e.target)) {
            hideSuggestions();
        }
    });

    function renderSuggestions(list) {
        suggestionsList.innerHTML = '';
        list.forEach(sub => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = sub;
            div.addEventListener('click', () => {
                selectItem(sub);
            });
            suggestionsList.appendChild(div);
        });
        suggestionsList.classList.remove('hidden');
    }

    function highlightItem(items) {
        items.forEach(item => item.classList.remove('active'));
        if (activeIndex > -1) {
            items[activeIndex].classList.add('active');
            items[activeIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    function selectItem(val) {
        input.value = val;
        hideSuggestions();
        input.focus();
    }

    function hideSuggestions() {
        suggestionsList.innerHTML = '';
        suggestionsList.classList.add('hidden');
        activeIndex = -1;
    }
});
