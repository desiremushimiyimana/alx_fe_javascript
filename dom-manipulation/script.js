let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];
  
  // Load quotes from local storage
  function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Show a random quote
  function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `"${quote.text}" - ${quote.category}`;
  }
  
  // Add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      displayRandomQuote();
      alert('Quote added successfully!');
    } else {
      alert('Please enter both quote text and category.');
    }
  }
  
  // Populate categories dynamically
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Filter quotes based on selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = filteredQuotes.map(quote => `"${quote.text}" - ${quote.category}`).join('<br><br>');
  }
  
  // Export quotes to a JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Fetch quotes from the server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Example API
      const serverQuotes = await response.json();
      return serverQuotes.map(quote => ({ text: quote.title, category: 'Server' }));
    } catch (error) {
      console.error('Failed to fetch quotes from server:', error);
      return [];
    }
  }
  
  // Sync local quotes with server
  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const allQuotes = [...quotes, ...serverQuotes];
    quotes = [...new Map(allQuotes.map(quote => [quote.text, quote])).values()]; // Remove duplicates
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification('Quotes synced with server successfully!');
  }
  
  // Periodically sync quotes with server
  function startPeriodicSync() {
    setInterval(syncQuotes, 60000); // Sync every 60 seconds
  }
  
  // Show notification
  function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.innerText = message;
    notification.style.display = 'block';
  }
  
  // Close notification
  function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
  }
  
  // Initialize the application
  function init() {
    loadQuotes();
    populateCategories();
    filterQuotes();
    startPeriodicSync();
    displayRandomQuote();
  }
  
  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
  document.getElementById('addQuoteButton').addEventListener('click', addQuote);
  window.onload = init;
  