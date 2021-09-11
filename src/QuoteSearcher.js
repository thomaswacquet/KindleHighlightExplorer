class QuoteSearcher {
	constructor() {
		this.allQuotes = [];
		this.quoteSearchResults = [];
	}

	clearQuotes() {
		this.allQuotes = [];
	}

	loadQuotesFromClippings(clippings) {
		let text = clippings.replaceAll('\r\n', '\n');
		let textQuotes = text.split('==========\n');

		textQuotes.forEach(quote => {
			let quoteLines = quote.split('\n');

			if (!quoteLines[3])
				return;

			let bookMatches = /(.*?) \(/.exec(quoteLines[0])
			let authorMatches = /\(([^)]+)\)/g.exec(quoteLines[0]);
			let author = '';
			let book = quoteLines[0];
			let dateMatches = /Added on (.*)/.exec(quoteLines[1]);
			let date = "";

			if (bookMatches != null)
				book = bookMatches[bookMatches.length - 1];
			if (authorMatches != null)
				author = authorMatches[authorMatches.length - 1];
			if (dateMatches != null)
				date = dateMatches[dateMatches.length - 1];

			this.allQuotes.push({
				content: quoteLines[3],
				book: book,
				author: author,
				date: date
			});
		});
	}

	filterAuthor(author) {
		if (!this.quoteSearchResults.length)
			this.quoteSearchResults = this.allQuotes;

		let results = [];
		this.quoteSearchResults.forEach(quote => {
			if (quote.author == author) {
				results.push(quote);
			}
		});
		return results;
	}

	filterBook(book) {
		if (!this.quoteSearchResults.length)
			this.quoteSearchResults = this.allQuotes;

		let results = [];
		this.quoteSearchResults.forEach(quote => {
			if (quote.book == book) {
				results.push(quote);
			}
		});
		return results;
	}

	search(query) {
		if (!query) {
			this.quoteSearchResults = this.allQuotes;

			return this.quoteSearchResults;
		}

		this.quoteSearchResults = [];
		query = query.toLowerCase();
		this.allQuotes.forEach(quote => {
			if (quote.content.toLowerCase().includes(query)) {
				this.quoteSearchResults.push(quote);
			}
		});
		return this.quoteSearchResults;
	}
};