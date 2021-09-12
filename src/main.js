const resultsBox = document.querySelector('#results-box');
let allQuotes = [];
let filteredQuotes = [];
const filterBook = document.querySelector('#filter-book');
const filterAuthor = document.querySelector('#filter-author');
const searchInput = document.querySelector('#search-input');
let filterBooks = [];
let filterAuthors = [];
let quoteSearcher = new QuoteSearcher();


searchInput.value = "";
// load files
document.querySelector('#file').addEventListener('change', function() {
	loadFiles(this.files);
});

function loadFiles(files) {
	clearResults();
	quoteSearcher.clearQuotes();
	let fileNames = [];
	for (let i = 0; i < files.length; i++) {
		fileNames.push(files[i].name)
		let fileReader = new FileReader();
		fileReader.onload = e => {
			quoteSearcher.loadQuotesFromClippings(e.target.result);

			let results = quoteSearcher.search('');
			displayQuotes(results);
		};
		
		fileReader.readAsText(files[i]);
	}

	document.querySelector('.imported-file-count').innerHTML = `${files.length} imported file${files.length > 1 ? 's' : ''}`;
	document.querySelector('.imported-file-count').title = fileNames.join(', ');
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
document.querySelector('#search-box .randomize').addEventListener('click', e => {
	let res = quoteSearcher.randomize();
	displayQuotes(res);
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
	const book = bookTitle;
	quoteBox.innerHTML = `
	<q class="quote">${content}</q>
	<p><strong class="author">${author}</strong>, <em class="book">${book}</em></p>
	<input type="image" src="imgs/delete.png" height="20px" title="Delete" />
`;
	quoteBox.querySelector('input').addEventListener('click', e=> {
		e.target.parentNode.classList.toggle('quote-disabled');
	});

	if (date) {
		quoteBox.innerHTML += `<em class="date">${date}</em>`;
	}
	resultsBox.appendChild(quoteBox);

	if (!filterBooks.includes(book)) {
		filterBooks.push(book);
		filterBook.innerHTML += `<option value="${bookTitle}">${bookTitle} - ${author}</option>`;
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