const resultsBox = document.querySelector('#results-box');
let allQuotes = [];
let filteredQuotes = [];
const filterBook = document.querySelector('#filter-book');
const filterAuthor = document.querySelector('#filter-author');
const searchInput = document.querySelector('#search-input');
let filterBooks = [];
let filterAuthors = [];
let quoteSearcher = new QuoteSearcher();


// load files
document.querySelector('#file').addEventListener('change', function() {
	loadFiles(this.files);
});

function loadFiles(files) {
	clearResults();
	quoteSearcher.clearQuotes();

	for (let i = 0; i < files.length; i++) {
		let fileReader = new FileReader();
		fileReader.onload = e => {
			quoteSearcher.loadQuotesFromClippings(e.target.result);
//			console.log(quoteSearcher.allQuotes)
			let results = quoteSearcher.search('');
			displayQuotes(results);
		};

		fileReader.readAsText(files[i]);
	}
}

function clearResults() {
	filterBooks = [];
	filterAuthors = [];

	resultsBox.innerHTML = '';
	filterAuthor.value = '';
	filterBook.value = '';

	filterAuthor.innerHTML = '<option></option>';
	filterBook.innerHTML = '<option></option>';
}

// search
document.querySelector('#search-box .submit').addEventListener('click', e => {
	searchQuotes(searchInput.value); 
});
searchInput.addEventListener('keyup', e => {
	if (e.key == "Enter") {
		searchQuotes(searchInput.value); 
	}
});

function searchQuotes(query) {
	clearResults();
	let results = quoteSearcher.search(query);
	
	displayQuotes(results);
}

function displayQuotes(quotes) {
	resultsBox.innerHTML = '';
	document.querySelector('.result-count').innerHTML = `${quotes.length} quotes`;

	quotes.forEach(quote => {
		appendQuote(quote.content, quote.book, quote.author, quote.date);
	});
}

function appendQuote(content, bookTitle, author, date) {
	let quoteBox = document.createElement('div');
	quoteBox.className = 'quote-box';
	const book = bookTitle + ' - ' + author;

	quoteBox.innerHTML = `
	<p class="quote">${content}</p>
	<em>${author}</em><br>
	<strong class="book">${book}</strong>
	`;

	if (date) {
		quoteBox.innerHTML += `<em class="date">${date}</em>`;
	}
	resultsBox.appendChild(quoteBox);

	if (!filterBooks.includes(book)) {
		filterBooks.push(book);
		filterBook.innerHTML += `<option value="${bookTitle}">${book}</option>`;
	}
	if (!filterAuthors.includes(author)) {
		filterAuthors.push(author);
		filterAuthor.innerHTML += `<option value="${author}">${author}</option>`;
	}
}


// filters
filterAuthor.addEventListener('change', e => {
	filterBook.value = '';
	let results = quoteSearcher.filterAuthor(e.target.value);

	displayQuotes(results);
});

filterBook.addEventListener('change', e => {
	filterAuthor.value = '';
	let results = quoteSearcher.filterBook(e.target.value);

	displayQuotes(results);
});

loadFiles(document.querySelector('#file').files);