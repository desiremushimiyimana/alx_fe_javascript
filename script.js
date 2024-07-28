document.addEventListener('DOMContentLoaded', () => {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const newQuoteBtn = document.getElementById('newQuote');
    const categoryFilter = document.getElementById('categoryFilter');
    const importFile = document.getElementById('importFile');
    const exportBtn = document.getElementById('exportBtn');

    addQuoteBtn.addEventListener('click', () => {
        addQuote(newQuoteText.value, newQuoteCategory.value);
    });

    newQuoteBtn.addEventListener('click', showRandomQuote);
    exportBtn.addEventListener('click', exportQuotes);

    function addQuote(text, category) {
        text = text.trim();
        category = category.trim();
        if (text === "" || category === "") {
            alert('Please enter both quote and category.');
            return;
        }

        const newQuote = { text, category };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        updateCategoryFilter();
        clearInputFields();
    }

    function showRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = 'No quotes available.';
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = filteredQuotes[randomIndex].text;
    }

    function updateCategoryFilter() {
        const categories = [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function getFilteredQuotes() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'all') {
            return quotes;
        }
        return quotes.filter(q => q.category === selectedCategory);
    }

    function filterQuotes() {
        showRandomQuote();
    }

    function clearInputFields() {
        newQuoteText.value = '';
        newQuoteCategory.value = '';
    }

    function exportQuotes() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            localStorage.setItem('quotes', JSON.stringify(quotes));
            updateCategoryFilter();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    updateCategoryFilter();
    showRandomQuote();
});
