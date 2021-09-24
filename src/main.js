const resultsBox = document.querySelector('#results-box');
const filterBook = document.querySelector('#filter-book');
const filterAuthor = document.querySelector('#filter-author');
const searchInput = document.querySelector('#search-input');

let filterBooks = [];
let filterAuthors = [];
let quoteSearcher = new QuoteSearcher();


function init() {
	searchInput.value = "";

	// load files
	document.querySelector('#file').addEventListener('change', function() {
		loadFiles(this.files);
	});

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

	// export
	document.querySelector('.export-clippings').addEventListener('click', e => {
		quoteSearcher.exportClippings();
	});

	document.querySelector('.export-all-clippings').addEventListener('click', e => {
		quoteSearcher.exportAllClippings();
	});

	quoteSearcher.loadFromCache();

	let results = quoteSearcher.search('');
	displayQuotes(results);
	//loadFiles(document.querySelector('#file').files);
}


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

	document.querySelector('.imported-file-count').innerHTML = `${files.length} import${files.length > 1 ? 's' : ''}`;
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



function searchQuotes(query) {
	clearResults();
	let results = quoteSearcher.search(query);
	
	displayQuotes(results);
}

function displayQuotes(quotes) {
	resultsBox.innerHTML = '';
	document.querySelector('.result-count').innerHTML = `${quotes.length} quotes`;

	quotes.forEach(quote => {
		appendQuote(quote);
	});

	sortSelect(filterBook);
	sortSelect(filterAuthor);
}

function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return;
}

function appendQuote(quote) {
	let quoteBox = document.createElement('div');
	quoteBox.className = 'quote-box';
	quoteBox.innerHTML = `
	<p class="quote"><q>${quote.content}</q></p>
	<p><strong class="author">${quote.author}</strong>, <em class="book">${quote.book}</em></p>
	<input type="image" src="imgs/delete.png" height="20px" title="Delete" />
	${quote.date ? `<em class="date">${quote.date}</em>` : ''}
	${quote.locs ? `<span class="locs">Loc ${quote.locs}</span>` : ''}
`;

	if (!quote.enabled)
		quoteBox.classList.add('quote-disabled');

	resultsBox.appendChild(quoteBox);

	quoteBox.querySelector('input').addEventListener('click', e => {
		e.target.parentNode.classList.toggle('quote-disabled');
		quote.enabled = !quote.enabled;
		quoteSearcher.update();
	});

	if (!filterBooks.includes(quote.book)) {
		filterBooks.push(quote.book);
		filterBook.innerHTML += `<option value="${quote.book}">${quote.book}${quote.author ? ` - ${quote.author}` : ''}</option>`;
	}
	if (quote.author && !filterAuthors.includes(quote.author)) {
		filterAuthors.push(quote.author);
		filterAuthor.innerHTML += `<option value="${quote.author}">${quote.author}</option>`;
	}
	
}

init();