class QuoteSearcher {
	constructor() {
		this.quoteSearchResults = [];
		
		this.allQuotes = [];
	}
	
	loadFromCache() {
		this.allQuotes = JSON.parse(localStorage.getItem('allQuotes'));
	}

	clearQuotes() {
		this.allQuotes = [];
		this.update();
	}
	
	update() {
		localStorage.setItem('allQuotes', JSON.stringify(this.allQuotes));
	}
	
	randomize() {
		function shuffle(array) {
			var currentIndex = array.length,  randomIndex;
			
			// While there remain elements to shuffle...
			while (currentIndex != 0) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;
				
				// And swap it with the current element.
				[array[currentIndex], array[randomIndex]] = [
					array[randomIndex], array[currentIndex]];
				}
				
				return array;
			}
			
		return shuffle(this.getSearchResultsWithFilters());
	}
		
	getSearchResultsWithFilters() {
		let arr = this.quoteSearchResults;
		if (this.authorFilter)
		arr = this.filterAuthor(this.authorFilter);
		if (this.bookFilter)
		arr = this.filterBook(this.bookFilter);
		return arr;
	}
	
	loadQuotesFromClippings(clippings) {
		let text = clippings.replaceAll('\r\n', '\n');
		let textQuotes = text.split('==========\n');
		
		textQuotes.forEach(quote => {
			let quoteLines = quote.split('\n');
			
			if (!quoteLines[3])
			return;
			if (/Your Note on Location/i.test(quoteLines[1]))
			return;
			
			let bookMatches = /(.*?) \(/i.exec(quoteLines[0])
			let authorMatches = /\(([^)]+)\)$/i.exec(quoteLines[0]);
			let locMatches = /Your Highlight on Location (\d*-?\d*)/i.exec(quoteLines[1])
			let author = '';
			let book = quoteLines[0];
			let dateMatches = /Added on (.*)/i.exec(quoteLines[1]);
			let date = "";
			let locs = "";
			
			if (bookMatches != null)
			book = bookMatches[bookMatches.length - 1];
			if (authorMatches != null)
			author = authorMatches[authorMatches.length - 1];
			if (dateMatches != null)
			date = dateMatches[dateMatches.length - 1];
			if (locMatches != null)
			locs = locMatches[locMatches.length - 1];
			
			this.allQuotes.push({
				content: quoteLines[3],
				book: book,
				author: author,
				date: date,
				enabled: true,
				locs: locs
			});
		});
		
		this.update();
	}
	
	filterAuthor(author) {
		this.authorFilter = author;
		this.bookFilter = "";
		
		if (!this.quoteSearchResults.length)
		this.quoteSearchResults = this.allQuotes;
		
		let results = [];
		this.quoteSearchResults.forEach(quote => {
			if (author && quote.author == author) {
				results.push(quote);
			}
		});
		return results;
	}
	
	filterBook(book) {
		this.bookFilter = book;
		this.authorFilter = "";
		
		if (!this.quoteSearchResults.length)
			this.quoteSearchResults = this.allQuotes;
		
		let results = [];
		this.quoteSearchResults.forEach(quote => {
			if (book && quote.book == book) {
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
	
	exportClippings() {
		let quotesToExport = this.getSearchResultsWithFilters();
		
		this.exportQuotes(quotesToExport);
	}
	
	exportAllClippings() {
		let quotesToExport = this.allQuotes();
		
		this.exportQuotes(quotesToExport);
	}
	
	exportQuotes(quotesToExport) {
		let lines = [];
		quotesToExport.forEach(quote => {
			if (!quote.enabled) {
				return;
			}
			
			let string ='';
			
			string += `${quote.book} (${quote.author})\n`;
			if (quote.locs && quote.date)
			string += `- Your Highlight on Location ${quote.locs} | Added on ${quote.date}\n`;
			else
			string += '-\n';
			string += `\n${quote.content}\n==========\n`;
			lines.push(string)
		});
		
		let blob = new Blob(lines, { type: "text/plain;charset=utf-8" });
		saveAs(blob, "My New Clippings.txt");
	}
};