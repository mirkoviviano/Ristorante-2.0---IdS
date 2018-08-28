import { Injectable } from '@angular/core';

@Injectable()
export class RistorantiService {

	constructor() {
	}

	getRistoranti() {
		return new Promise( resolve =>
		{
			resolve();
		})
		
	}

}
