import axios from "axios";
import { AutoCompleteResponse, Address } from "./interfaces";

const BASE_URL =
    "https://geoportal.stadt-koeln.de/Finder/Lookup?filter=type:adr&query=";

export async function autoCompleteAddress(
    query: string
): Promise<AutoCompleteResponse> {
    // TODO: implement!
    const res = await axios(BASE_URL, {
        params: {
            query,
        },
    });
    if (typeof query !== "string") throw new InvalidParameters();

    const locs = res.data.locs as any[];

    let addresses = locs.map((loc) => {
        const fields = loc.fields;
        console.log("fields,", fields);
        const cityName = fields.qua.split(" ")[0]

        const address: Address = {
            district: fields.stb, //stb
            zip: fields.plz, //plz
            city: cityName, //stt
            street: fields.str, //str
            numbers: fields.hnr, //hnr
        };

        return address;
    });

    console.log("adresses", addresses);

   const mergedAddress = {
       district: addresses[0].district, //stb
       zip: addresses[0].zip, //plz
       city: addresses[0].city, //stt
       street: addresses[0].street, //str
       numbers: [] as any[], //hnr
   };

   addresses.forEach((address)=> {
    mergedAddress.numbers.push(address.numbers)
   })
   console.log('merged', mergedAddress)
   addresses.splice(0);
   addresses.push(mergedAddress);

    return {
        count: locs.length,
        addresses,
        time: 0,
    };
}

export class InvalidParameters extends Error {}
