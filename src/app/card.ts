export class Legality {
	format: string;
	legality: string;

	toString(): string {
		return `${this.format}: ${this.legality}`;
	}

}


export class Set {
	name: string;
	code: string;

}

export class Card {
	name: string;
	manaCost: string;
	type: string;
	subtypes: string[];
	text: string;
	set: Set;
	legalities: any[];

}