import axios from 'axios';
import { AutoCompleteResponse } from './interfaces';

const BASE_URL = 'https://geoportal.stadt-koeln.de/Finder/Lookup?filter=type:adr&query=';

export async function autoCompleteAddress(query: string): Promise<AutoCompleteResponse> {
    // TODO: implement!

    return {
        count: 1,
        addresses: [{
            district: 'Kalk',
            zip: '51103',
            city: 'Köln',
            street: 'Straße des 17. Juni',
            numbers: ['4', '4a']
        }],
        time: 0,
    }
}

export class InvalidParameters extends Error {
}